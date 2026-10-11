# =============================================================================
# 商帮帮 · 门户官网 —— 生产镜像（多阶段构建）
#
# 构建上下文 = apps/portal 目录本身
#   （deploy/docker-compose.yml 里写的是 context: ../apps/portal）
# 所以下面的 COPY 路径都相对于 apps/portal。
#
# 这个应用和外贸站（apps/foreign-site）**不是一回事**，别搞混：
#   * 门户是纯静态页面 + 一个留资接口 /api/lead
#   * **不连数据库**，没有 Payload，没有迁移
#   * 启动就是 `node server.js`，不需要 entrypoint.sh
#
# 前置要求：
#   next.config.mjs 里要有 output: "standalone"
#   —— 本项目已经有这一行。兜底：本文件在 builder 阶段额外设了
#   NEXT_PRIVATE_STANDALONE=1（Next.js 内部同样会打开 standalone 输出），
#   但正式做法是在 next.config.mjs 里显式声明。
#
# ⚠️ 关于留资接口 /api/lead（app/api/lead/route.ts）：
#   它会把线索**追加写入 <cwd>/data/leads.jsonl**（容器里就是 /app/data/leads.jsonl）。
#   所以本文件预建了 /app/data 并 chown 给运行用户，
#   deploy/docker-compose.yml 里还给它挂了具名卷 portal_data —— 两者缺一不可：
#     没有目录/属主 → 非 root 用户写不进，线索只留在控制台日志里；
#     没有卷        → 容器一重建，攒下的线索全没了。
#   这只是**临时方案**，正式做法应改成写数据库或转发 webhook
#   （代码里已支持 LEAD_WEBHOOK_URL 环境变量，见 README）。
# =============================================================================


# -----------------------------------------------------------------------------
# 1) deps —— 只装依赖，这一层缓存最好
# -----------------------------------------------------------------------------
FROM node:22-alpine AS deps

# libc6-compat：和外贸站保持一致。
# 门户目前没有 sharp 这类原生模块，严格说不装也能跑；
# 但保留它可以让两个镜像的基础环境一致，将来门户加图片处理也不用改这里。
RUN apk add --no-cache libc6-compat

WORKDIR /app

# 只复制依赖清单：改源码不会触发重新 npm ci
COPY package.json package-lock.json ./

# 有 lock 文件就严格按 lock 装，没有就退化成 npm install
RUN if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund; \
    else \
      npm install --no-audit --no-fund; \
    fi


# -----------------------------------------------------------------------------
# 2) builder —— 编译 Next.js（standalone 产物）
# -----------------------------------------------------------------------------
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# 打开 standalone 输出的兜底开关
ENV NEXT_PRIVATE_STANDALONE=1
# 构建比较吃内存，2G 小机器容易 OOM 被 kill
ENV NODE_OPTIONS=--max-old-space-size=4096

# ⚠️ NEXT_PUBLIC_ 前缀的变量是「构建期就要定下来」的：
#    Next.js 会把它的值**内联**进打包产物，运行期再改**不生效**。
#    门户里被内联的地方：content/site.ts 的 `process.env.NEXT_PUBLIC_SITE_URL`
#    （站点 canonical 链接、sitemap、robots 用）。
#    改了域名必须重新 build，光改 .env 再 restart 没用。
ARG NEXT_PUBLIC_SITE_URL=https://shangbangbang.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

# 门户的 public/ 目录仓库里是存在的（图片等静态资源），不需要像外贸站那样 mkdir 兜底。
# 万一以后被挪走了，构建会在这里失败，届时按实际情况调整。
RUN npm run build


# -----------------------------------------------------------------------------
# 3) runner —— 只带运行需要的东西，非 root 运行
# -----------------------------------------------------------------------------
FROM node:22-alpine AS runner

# libc6-compat：与外贸站镜像保持一致
# wget 是 busybox 自带的，拿来做健康检查，不用额外装 curl
RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# server.js 读这两个变量：PORT 默认 3000，HOSTNAME 默认 0.0.0.0
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 非 root 用户运行：容器被打穿时影响面小很多
# ⚠️ uid/gid 故意和外贸站用同一组（1001:1001），
#    这样两个应用在挂载卷时的属主规则完全一样，排查问题时少记一套。
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nextjs

# --- standalone 产物（.next/standalone 里已含最小化的 node_modules + server.js）---
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# 静态资源：standalone 不会自动带，必须手动拷
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# public 目录（图片等）
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# --- 留资线索的落盘目录 ---
# route.ts 里写的是 path.join(process.cwd(), "data")，容器里 cwd 就是 /app，
# 所以必须是 /app/data。
# 这里先建好并归 nextjs 所有：compose 里挂具名卷时，
# 首次创建的空卷会继承镜像里这个目录的属主，否则非 root 用户写不进去。
# ⚠️ 这个目录**不在**构建产物里 —— 镜像里它是空的，数据全靠卷。
RUN mkdir -p /app/data \
 && chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

# 健康检查：busybox wget，不引 curl 这种不确定存在的工具。
# 检查首页即可：门户是纯静态页，首页能返回就说明服务活着。
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/ || exit 1

# 门户没有 entrypoint.sh：不连数据库、不跑迁移，直接起 Next.js。
CMD ["node", "server.js"]
