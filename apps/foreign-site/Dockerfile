# =============================================================================
# 商帮帮 · 外贸站 —— 生产镜像（多阶段构建）
#
# 构建上下文 = apps/foreign-site 目录本身
#   （deploy/docker-compose.yml 里写的是 context: ../apps/foreign-site）
# 所以下面的 COPY 路径都相对于 apps/foreign-site。
#
# 前置要求（缺一不可，详见 deploy/README.md 第 5 步）：
#   1) next.config.mjs 加上 output: "standalone"
#      —— 本项目当前没有这一行。兜底：本文件在 builder 阶段额外设了
#      NEXT_PRIVATE_STANDALONE=1（Next.js 内部同样会打开 standalone 输出），
#      但正式做法是在 next.config.mjs 里显式声明。
#   2) payload.config.ts 改用 Postgres 适配器，并 npm i @payloadcms/db-postgres
#   3) payload/migrations 里要有迁移文件（npm exec payload migrate:create 生成）
#
# 关于「构建期要不要数据库」：
#   前台用 generateStaticParams 列出所有租户，所以**构建时会连数据库**
#   （见 app/(frontend)/[site]/layout.tsx）。两种玩法：
#     a. 构建期不连库（DATABASE_URL 填占位值）→ 构建成功，但没有预渲染页面，
#        页面等第一次被访问时才按需生成。适合第一次上线打通链路。
#     b. 构建期连库（DATABASE_URL 指向 db，且库已经跑过迁移）→ 每个租户的页面
#        全部预渲染成静态文件，速度最好。第二次构建用这个。
#   两种都在 deploy/README.md 里写了。
# =============================================================================


# -----------------------------------------------------------------------------
# 1) deps —— 只装依赖，这一层缓存最好
# -----------------------------------------------------------------------------
FROM node:22-alpine AS deps

# libc6-compat：sharp 的原生二进制在 Alpine(musl) 下的兼容层，必须有
# （sharp 官方发的是预编译包，不需要 vips-dev 那套编译工具）
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

# 构建期数据库连接串：默认是「连不上的占位值」，
# docker-compose 的 build.args 会把 .env 里的 DATABASE_URL 传进来。
# 它只在构建期用，不会写死进镜像（运行时由 compose 的 environment 覆盖）。
ARG DATABASE_URL=postgres://build:build@127.0.0.1:5432/build
ENV DATABASE_URL=$DATABASE_URL

# ⚠️ 下面这两个是「构建期就要定下来」的，运行期再改**不生效**：
#   NEXT_PUBLIC_ROOT_DOMAIN —— middleware 在构建时被打包，NEXT_PUBLIC_ 前缀的值会被内联
#   DEFAULT_SITE            —— getAllSiteSlugs() 在构建时用它兜底
ARG NEXT_PUBLIC_ROOT_DOMAIN=shangbangbang.com
ARG DEFAULT_SITE=hengxin-tools
ENV NEXT_PUBLIC_ROOT_DOMAIN=$NEXT_PUBLIC_ROOT_DOMAIN
ENV DEFAULT_SITE=$DEFAULT_SITE

# ⚠️ 第三方接入：都是「填了就生效、没填自动跳过」，留空不影响网站运行。
#    同样因为是 NEXT_PUBLIC_ 前缀，必须走构建参数（改完要重新 build，restart 没用）。
ARG NEXT_PUBLIC_GA_ID=""
ARG NEXT_PUBLIC_TAWK_PROPERTY_ID=""
ARG NEXT_PUBLIC_TAWK_WIDGET_ID=""
ARG GOOGLE_SITE_VERIFICATION=""
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
ENV NEXT_PUBLIC_TAWK_PROPERTY_ID=$NEXT_PUBLIC_TAWK_PROPERTY_ID
ENV NEXT_PUBLIC_TAWK_WIDGET_ID=$NEXT_PUBLIC_TAWK_WIDGET_ID
ENV GOOGLE_SITE_VERIFICATION=$GOOGLE_SITE_VERIFICATION

# public 目录仓库里目前不存在（Payload 上传媒体时才生成），
# 先建一个，保证 runner 阶段的 COPY 一定有东西可拷
RUN mkdir -p public/media migrations

RUN npm run build


# -----------------------------------------------------------------------------
# 3) runner —— 只带运行需要的东西，非 root 运行
# -----------------------------------------------------------------------------
FROM node:22-alpine AS runner

# libc6-compat：sharp 运行也需要
# wget 是 busybox 自带的，拿来做健康检查，不用额外装 curl
RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# server.js 读这两个变量：PORT 默认 3000，HOSTNAME 默认 0.0.0.0
# （这两个默认值已经验证过：next/dist/build/utils.js 里生成 server.js 时就是这么写的）
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 非 root 用户运行：容器被打穿时影响面小很多
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nextjs

# --- standalone 产物（.next/standalone 里已含最小化的 node_modules + server.js）---
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# 静态资源：standalone 不会自动带，必须手动拷
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# public 目录（builder 阶段已确保存在）
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# --- 给 Payload 命令行（迁移 / run seed.ts）留一套源码 + 完整依赖 ---
# standalone 是精简产物，跑不了 Payload 的命令行；命令行需要 TS 源码
# （payload.config.ts、seed.ts）和完整的 node_modules。
#
# 这里逐个列出需要拷贝的目录，而不是整目录拷 —— 为了避开 node_modules
# 和 .next（它们体积大且没必要重复一份）。
# ⚠️ 以后新增顶层目录（比如 pages/、src/）时，记得在这个列表里补上，
#    否则命令行会报「找不到模块」。
COPY --from=builder --chown=nextjs:nodejs /app/package.json /app/package-lock.json /app/tsconfig.json /app/next.config.mjs /app/postcss.config.mjs ./full/
COPY --from=builder --chown=nextjs:nodejs /app/payload.config.ts /app/seed.ts /app/middleware.ts ./full/
COPY --from=builder --chown=nextjs:nodejs /app/payload ./full/payload
COPY --from=builder --chown=nextjs:nodejs /app/lib ./full/lib
COPY --from=builder --chown=nextjs:nodejs /app/app ./full/app
COPY --from=builder --chown=nextjs:nodejs /app/components ./full/components
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./full/scripts
# 注意：**不要**把 public 拷进 /full —— 那里面是上传的媒体文件，
# 命令行（迁移/种子）用不到，白占一份空间。
# 迁移文件（还没生成的话这行会失败，先执行 npm exec payload migrate:create）
COPY --from=builder --chown=nextjs:nodejs /app/migrations ./full/migrations
# 完整依赖装回去
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./full/node_modules

# --- Payload 媒体上传目录 ---
# payload/collections/Media.ts 里 staticDir = <app>/public/media。
# 这里先建好并归 nextjs 所有：compose 里挂具名 volume 时，
# 首次创建的空卷会继承镜像里这个目录的属主，否则非 root 用户写不进去。
RUN mkdir -p /app/public/media \
 && chown -R nextjs:nodejs /app/public

# --- 启动脚本：可选地先跑迁移/种子，再拉起 Next.js ---
COPY --chown=nextjs:nodejs entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

USER nextjs

EXPOSE 3000

# 健康检查：busybox wget，不引 curl 这种不确定存在的工具
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/ || exit 1

# 注意：entrypoint.sh 里只做「迁移 + 启动」，不做 seed
# （seed 会清空库里已有的业务数据，绝不能自动跑，详见 README）
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "server.js"]
