# 商帮帮 · 门户 + 外贸独立站 —— 上线部署指南（中文）

> 写给不懂运维的人。照着从上往下做，能把这套系统跑在**一台海外服务器**上。
>
> **这台服务器上跑的是两个应用，共用一个 Caddy：**
>
> | | 门户（`apps/portal`） | 外贸站（`apps/foreign-site`） |
> |---|---|---|
> | 是什么 | 商帮帮自己的官网 | 卖给客户的「多租户外贸独立站」产品 |
> | 域名 | `shangbangbang.com`、`www.shangbangbang.com` | `客户名.shangbangbang.com`、客户自己的域名 |
> | 内容 | 纯静态页面 + 留资接口 `/api/lead` | Next.js + Payload CMS + PostgreSQL，后台在 `/admin` |
> | 要数据库吗 | **不要** | **要**（PostgreSQL） |
> | 容器名 | `sbb-portal` | `sbb-site` |
> | compose 服务名 | `portal` | `site` |
>
> **两个应用的页面路径都是 `/`，全靠访问的域名（Host 头）区分** ——
> 所以 Caddy 里的站点块必须分开写，这也是本指南最容易配错的地方。
>
> 外贸站这一侧是「**一套代码服务 N 个客户**」：客户 A 和客户 B 用同一个网站程序、
> 同一个数据库，靠访问的**域名**区分该显示谁的内容。
> 所以部署只需要做**一次**，以后加客户是「加一条 DNS + 后台建个站点」，不用重新部署。
>
> ⚠️ 本指南里 **`app` 这个词已经全部改叫 `site`**（对应 `deploy/docker-compose.yml`
> 里的服务名）。如果你手上有旧的笔记还在敲 `docker compose build app`，
> 会报「no such service」—— 那是服务改名了，不是你没装 Docker。

---

## 目录

- [第 0 步：先改 3 处代码（不做这步，后面一定跑不起来）](#第-0-步先改-3-处代码不做这步后面一定跑不起来)
- [第 1 步：买服务器](#第-1-步买服务器)
- [第 2 步：服务器初始化](#第-2-步服务器初始化)
- [第 3 步：DNS 怎么配](#第-3-步dns-怎么配)
- [第 4 步：把代码放到服务器上](#第-4-步把代码放到服务器上)
- [第 5 步：从零到上线（完整流程）](#第-5-步从零到上线完整流程)
- [第 6 步：数据库迁移（生产环境必须看这一节）](#第-6-步数据库迁移生产环境必须看这一节)
- [第 7 步：加一个新客户 / 绑客户自己的域名](#第-7-步加一个新客户--绑客户自己的域名)
- [第 8 步：日常运维](#第-8-步日常运维)
- [第 9 步：出问题了怎么查](#第-9-步出问题了怎么查)
- [上线安全清单（照着打勾）](#上线安全清单照着打勾)
- [这个版本已知的坑（心里有数就行）](#这个版本已知的坑心里有数就行)
- [附：两个应用的对照速查](#附两个应用的对照速查)

---

## 第 0 步：先改 3 处代码（不做这步，后面一定跑不起来）

代码里有 3 个地方是「开发模式能用、生产模式必须改」的。**先在本地改好、提交**，再上传服务器。

### 0.1 `apps/foreign-site/next.config.mjs` —— 加上 standalone 输出

Docker 镜像是按 Next.js 的 `standalone`（精简产物）模式写的，必须显式打开：

```js
import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 👇 加这一行：让 next build 产出 .next/standalone，Docker 才装得进小镜像
  output: "standalone",
};

export default withPayload(nextConfig);
```

> Dockerfile 里设了 `NEXT_PRIVATE_STANDALONE=1` 作为兜底，所以不加也能构建成功；
> 但**请加上**，这是官方推荐做法，也避免以后换工具链时踩坑。
>
> ✅ **门户（`apps/portal/next.config.mjs`）已经加好了**，代码如下（不用你动手，列出来只是让你知道两边一致）：
>
> ```js
> /** @type {import('next').NextConfig} */
> const nextConfig = {
>   reactStrictMode: true,
>   // Docker 部署用：只打包运行时真正需要的文件，镜像小很多
>   output: "standalone",
> };
>
> export default nextConfig;
> ```
>
> ⚠️ 两边都要有这一行。**只开一边**的后果是：那一边构建出来的镜像里
> 找不到 `.next/standalone`，Dockerfile 的 COPY 直接失败，`docker compose build` 报错退出。
> （门户和外贸站是**两个独立的构建**，互不影响，所以要分别确认。）

### 0.2 `apps/foreign-site/payload.config.ts` —— 换成 PostgreSQL

现在连的是本地 SQLite，生产要换成 Postgres。先装适配器：

```bash
cd apps/foreign-site
npm install @payloadcms/db-postgres@3.90.2
```

> ⚠️ 版本号建议和 `payload` 保持一致（当前 `package.json` 里 payload 是 `3.90.2`）。
> 装完 `package-lock.json` 会更新，**一定要一起提交**，服务器构建时靠它装依赖。
> （Docker 构建用的是 `npm ci`，它要求 `package.json` 和 `package-lock.json`
> 完全对得上；如果服务器上构建报「lock file 不一致」，
> 就在本地重新 `npm install` 一次、把 lock 文件提交上去。）

然后改 `payload.config.ts` 两处：

```ts
// 1) 顶部：把 sqlite 的 import 换成 postgres
import { postgresAdapter } from "@payloadcms/db-postgres";

// 2) 中间的 db 字段：把 sqliteAdapter({...}) 整段换掉
db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URL || "",
  },
}),
```

### 0.3 生成数据库迁移文件

生产环境**不能**用开发模式那套「自动同步表结构」，必须用迁移文件（见[第 6 步](#第-6-步数据库迁移生产环境必须看这一节)）。

```bash
cd apps/foreign-site
# 看现有迁移命令（命令名以实际输出为准）
npx payload migrate --help
# 生成一份迁移
npx payload migrate:create initial
```

生成的文件会在 `apps/foreign-site/migrations/` 下，**一起提交**。

> 这一步需要能连上一个 Postgres（本地起一个就行，见第 6 步的临时容器做法）。
> 如果 `migrate:create` 的行为和你预期不一致，**以 Payload 官方文档为准**，
> 不要照抄网上的旧命令。

> ⚠️ **需自行确认的一件事**：Postgres 适配器有一个 `push` 选项
> （作用类似开发模式的「自动同步表结构」）。生产环境不希望它自动改表，
> 请到 Payload 官方文档确认当前版本 `push` 的**默认值**，
> 以及生产环境应该怎么设（很多项目会显式关掉）。
> 这里**不给出具体写法**，因为版本之间行为有变，写错了可能悄悄改掉你的表结构。

---

## 第 1 步：买服务器

### 1.1 为什么必须放海外

你的买家在海外，客户是外贸工厂。服务器放海外有三条硬理由：

| | 海外服务器（香港/新加坡） | 国内服务器 |
|---|---|---|
| **备案** | 面向境外访问**通常不需要 ICP 备案** | **每个客户域名都要单独备案** |
| **交付周期** | 3～15 天能上线 | 备案 5～20 个工作日，客户的域名还得客户配合 |
| **买家访问速度** | 快 | 慢 |

**备案这条是生死线。** 你对外承诺「3～15 天交付」，如果服务器在国内，
每个客户都得等备案，这个承诺就是假的。

> ⚠️ 备案要求属于政策，可能变。**上线前请向你的服务商确认一次**，
> 尤其是「服务器在境外、但客户是境内公司」这种情况。
> 如果客户坚持要国内节点，那是另一套交付流程（+备案），报价要单独算。

### 1.2 买什么

**推荐节点**（按国内老板访问后台的速度排）：

1. **香港** —— 老板在国内访问后台最快，延迟低，是首选
2. **新加坡** —— 东南亚/中东买家访问更稳，国内访问比香港稍慢
3. **日本（东京/大阪）** —— 折中
4. 美国西部 —— 便宜，但国内访问后台会比较卡

**配置建议**：

| 阶段 | CPU/内存 | 硬盘 | 带宽 | 大致价位（以实际为准） |
|---|---|---|---|---|
| 自己开发测试 | 2 核 2G | 40G SSD | 1～3 Mbps | ¥60～150/月 |
| 1～5 个客户 | 2 核 4G | 60～80G SSD | 3～5 Mbps | ¥150～400/月 |
| 10～30 个客户 | 4 核 8G | 100G+ SSD | 5 Mbps+ | ¥400～1000/月 |
| 再往上 | 4 核 8G 起 + CDN | 按需 | 按流量 | 按需 |

> ⚠️ 上面价位只是量级参考，**以实际为准**：不同服务商、不同活动、不同计费方式
> （固定带宽 vs 按流量）差别很大。买之前算清楚流量费。
>
> 💡 **内存不要低于 2G**。`next build` 编译时很吃内存，2G 以下容易
> 编译到一半被系统杀掉（表现为构建失败、没有明确报错）。
>
> 💡 **现在这台机器要跑两个应用**（门户 + 外贸站）+ PostgreSQL：
> 运行时多一个 Node 进程（门户很轻，纯静态页，几十 MB 量级），
> 但**构建时是两个独立的 `next build`**，一个接一个跑、每次都吃满内存。
> 所以 2G 的机器「能跑起来，但重新构建时有 OOM 风险」。
> **建议起步 2 核 4G**；如果只有 2G，构建时**分开做**
> （先 `docker compose build portal`，再 `docker compose build site`），
> 并且加一点 swap。

**买服务器时几个容易忽略的点**：

- **一定要有公网 IPv4 地址**，并且能开 80 / 443 端口。
  极少数便宜套餐是「NAT 共享 IP」或纯 IPv6，那种做不了自动 HTTPS，别买。
- **安全组/防火墙**默认只放行 22，需要自己加 80 和 443。
- 系统选 **Ubuntu 22.04 / 24.04 LTS**（资料最多，出问题好搜）。
- 买完把 **IP、root 密码、控制台地址**记到一个地方。

### 1.3 域名

- **根域名**（`shangbangbang.com`）建议在 **Cloudflare** 托管 DNS，
  免费、支持 API（配通配符证书需要），解析生效快。
- 客户自己的域名由**客户自己注册**（资产归属清楚，少扯皮），
  你只需要让他们把解析指向你的服务器。

---

## 第 2 步：服务器初始化

从这一节开始，命令都在**服务器上**执行（用 SSH 连上去）。
Windows 上用 PowerShell 连：`ssh root@你的服务器IP`。

### 2.1 装 Docker 和 Docker Compose

Ubuntu 上最省事的是用官方一键脚本：

```bash
# 1) 装 Docker（官方脚本，会顺带装 docker compose 插件）
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2) 让 docker 开机自启
sudo systemctl enable --now docker

# 3) 验证：两条命令都能打印版本号就成功
docker --version
docker compose version
```

> 💡 上面的脚本地址和参数**可能随官方调整**，如果失败就去 Docker 官方文档
> 按「Install Docker Engine on Ubuntu」的步骤做。
> `docker compose version` 打不出来，说明只装了老的 `docker-compose`，
> 本指南所有命令用的都是新版 `docker compose`（中间是空格）。

### 2.2 建一个普通用户（不要一直用 root）

```bash
adduser deploy                      # 会让你设密码
usermod -aG sudo deploy             # 给它 sudo 权限
usermod -aG docker deploy           # 给它跑 docker 的权限
su - deploy                         # 切过去，之后都用这个用户
```

> 加进 `docker` 组等于给了这台机器的最高权限（能挂载任何目录）。
> 这是 Docker 的固有特性，知道就行。

### 2.3 开防火墙

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

> ⚠️ **别漏了 OpenSSH**，否则一开防火墙你就连不上服务器了。
> 另外云服务商控制台里还有一层「安全组」，两处都要放行 80/443。

### 2.4 建部署目录

```bash
sudo mkdir -p /srv/shangbangbang
sudo chown -R $USER:$USER /srv/shangbangbang
cd /srv/shangbangbang
```

约定：代码放 `/srv/shangbangbang`，里面是仓库原样结构
（`apps/foreign-site/...`、`deploy/...`）。

---

## 第 3 步：DNS 怎么配

假设服务器公网 IP 是 `1.2.3.4`，根域名是 `shangbangbang.com`。
（本指南默认**门户用根域名 + www，外贸站只用子域名**，见 `.env.example` 里的 `PORTAL_DOMAIN`。）

### 3.1 必须加的三条记录

到域名服务商（推荐 Cloudflare）的 DNS 管理里加：

| 类型 | 名称（Name） | 值（Value） | 这一条给谁用 |
|---|---|---|---|
| A | `@` | `1.2.3.4` | **门户**：`shangbangbang.com` 本身 |
| A | `www` | `1.2.3.4` | **门户**：`www.shangbangbang.com` |
| A | `*` | `1.2.3.4` | **外贸站**：所有 `客户名.shangbangbang.com` |

加了 `*` 这条以后，以后新客户**不用再改 DNS**：`客户名.shangbangbang.com`
自动就指向你的服务器了。这就是「一套系统服务 N 个客户」在 DNS 上的体现。

> ⚠️ 这三条记录**都必须有**，少一条的后果不一样：
> - 少 `@` → 门户打不开（浏览器直接说域名不存在）
> - 少 `www` → 从 `www.` 进来的访问打不开，而很多国内客户习惯输 `www.`
> - 少 `*` → 客户子域名全部不解析，每加一个客户都得手动加一条 DNS
>
> ⚠️ 用 Cloudflare 的话：
> - 「代理状态」建议先设成 **DNS only（灰云）**，等证书签发成功、网站能打开了，
>   再考虑开小黄云（CDN）。灰云阶段 Caddy 直接用 HTTP-01 验证，最不容易出错。
> - 如果开了小黄云又要签证书，需要注意 Cloudflare 和源站之间的转发配置，
>   这块**需自行确认**，别在没跑通之前折腾。

> 💡 如果门户要用**完全另一套域名**（比如 `shangbangbang.cn`）：
> 那套域名的 NS 可能不在同一个服务商，要去对应的服务商再加一遍
> `@` 和 `www` 两条 A 记录，并且同时改 `.env` 里的 `PORTAL_DOMAIN`。
> ⚠️ 但**不要**把 `PORTAL_DOMAIN` 写成 `shangbangbang.com` 的子域名
> （原因见 `deploy/Caddyfile` 顶部「域名撞车怎么查」）。

### 3.2 客户自己的域名

客户想用自己的 `factory-a.com`，让他（或你代为）加：

| 类型 | 名称 | 值 |
|---|---|---|
| A | `@` | `1.2.3.4` |
| A | `www` | `1.2.3.4`（客户要 www 就加） |

然后按[第 7 步](#第-7-步加一个新客户--绑客户自己的域名)在 Caddyfile 里加一段。

### 3.3 验证 DNS 生效

```bash
# 在服务器上执行，能打印出 1.2.3.4 就对了
dig +short shangbangbang.com
dig +short test.shangbangbang.com
dig +short factory-a.com
```

> 解析通常几分钟生效，慢的话等 10～30 分钟。
> **一定要确认生效了再去配证书**，否则证书签发会失败，
> 失败次数多了会被 CA 限流（一周内很难再签成功）。

---

## 第 4 步：把代码放到服务器上

三选一，推荐第一种。

### 方式 A：Git 拉取（推荐，方便以后更新）

```bash
cd /srv/shangbangbang
git clone <你的仓库地址> .
# 私有仓库需要配置 SSH key 或访问令牌
```

以后更新只要 `git pull`。

### 方式 B：从本地上传

在你的 Windows 上（PowerShell，在项目根目录执行）：

```powershell
scp -r E:\Work\shangbangbang_newwork\apps E:\Work\shangbangbang_newwork\deploy deploy@1.2.3.4:/srv/shangbangbang/
```

> `.env`、`node_modules`、`.next` 不要上传，服务器上会重新生成/安装。

### 方式 C：先在本地构建镜像再推上去

适合服务器配置很低（2G 内存编译会 OOM）的情况：
本地 `docker build` → 推送镜像仓库 → 服务器 `docker pull`。
这块需要额外搭镜像仓库，**需自行确认**具体做法。

### 上传后检查目录结构

```bash
ls -R /srv/shangbangbang | head -30
# 应该能看到两个应用和 deploy/：
#   apps/portal/         （门户，有自己的 Dockerfile、.dockerignore）
#   apps/foreign-site/   （外贸站，有自己的 Dockerfile、entrypoint.sh、.dockerignore）
#   deploy/              （docker-compose.yml、Caddyfile、.env.example、本指南）
```

> ⚠️ **两个应用目录都要完整传上去**。只传 `apps/foreign-site` 的话，
> `docker compose build portal` 会因为找不到构建上下文而失败。

---

## 第 5 步：从零到上线（完整流程）

> 全程在 `/srv/shangbangbang/deploy` 目录下操作。

### 第一次上线前，先做这一件事

```bash
cd /srv/shangbangbang
mkdir -p apps/foreign-site/migrations     # ⚠️ 别跳过这行，原因见下
```

> ⚠️ 为什么专门说这个：`docker compose` 遇到不存在的挂载目录时，
> 会**自动在服务器上创建一个 root 所有的空目录**，然后你以后用普通用户
> 往里面放迁移文件就会「Permission denied」。
> 所以先手动建好，省得排查这个莫名其妙的权限问题。
> （真要已经踩了：`sudo chown -R $USER:$USER apps/foreign-site/migrations`）

### 5.1 填环境变量

```bash
cd /srv/shangbangbang/deploy
cp .env.example .env
chmod 600 .env
nano .env          # 或用 vim，逐项改
```

**必须改的 7 项**（每一项在 `.env.example` 里都有详细中文说明）：

1. `POSTGRES_PASSWORD` —— 一串随机密码：
   ```bash
   openssl rand -base64 32
   ```
2. `PAYLOAD_SECRET` —— 一串随机值：
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   ```
3. `PORTAL_DOMAIN` —— 门户的域名。
   **默认 `shangbangbang.com` 就是对的**（门户占根域名 + www，外贸站只用子域名）。
   ⚠️ 别把它写成 `xxx.shangbangbang.com` 这种子域名，会和外贸站的通配块撞车。
4. `PORTAL_SITE_URL` —— 门户的完整地址，默认 `https://shangbangbang.com`。
   要和 `PORTAL_DOMAIN` 对上。⚠️ 它是**构建期**变量，改了要 `docker compose build portal`。
5. `ROOT_DOMAIN` —— 外贸站的根域名（客户子域名都挂在它下面）
6. `ACME_EMAIL` —— 改成你的邮箱
7. `DATABASE_URL` —— **第一次构建先保持占位值**
   `postgres://build:build@127.0.0.1:5432/build`（原因见 5.2）

另外还有一个上线开关（不是必须现在就改，但要知道它在哪）：

8. `RUN_MIGRATIONS` —— **第一次上线改成 `true`**（只影响外贸站容器，门户不受影响）

> ⚠️ 还有一项是**选填但强烈建议配**的：`LEAD_WEBHOOK_URL`
> （门户的留资线索转发到企业微信/飞书）。
> 配它需要**同时**改两个地方：`.env` 里填值 + `docker-compose.yml` 里把
> portal 服务那行注释去掉。详见[第 8 步的门户备份](#88-门户的留资线索leadsjsonl备份必看)。

### 5.2 第一次构建（不连数据库）

门户和外贸站是**两个独立的镜像**，要分别构建：

```bash
# ① 门户：完全不连数据库，随便什么时候构建都行
docker compose build portal

# ② 外贸站：第一次先用占位的 DATABASE_URL 构建（原因见下面）
docker compose build site

# 想一次全构建也行（等于上面两条）：
# docker compose build
```

**为什么第一次不连库**：应用在构建时会去数据库里查「有哪些客户站点」，
好给每个站点预渲染一份静态页面（`generateStaticParams`）。
但这时候库里**连表都还没有**，所以：

- 第一次构建 → 用占位 `DATABASE_URL`，能编译成功，但没有预渲染页面
  （页面等第一次被访问时才生成）。**先把链路跑通**。
- 跑完迁移之后 → 第二次构建时把 `DATABASE_URL` 改成真实值，
  这时每个客户的页面会全部预渲染成静态文件，**速度最好**。

> ⚠️ 构建阶段会连数据库，这意味着构建失败的常见原因之一是
> 「`DATABASE_URL` 填了真实值但数据库还没起来」。对不上就把占位值填回去。
> 门户没有这个问题：它**完全不需要数据库**，`docker compose build portal` 永远不该
> 因为数据库而失败 —— 如果它失败了，去查别的（多半是 `NEXT_PUBLIC_SITE_URL` 写错、
> 或者 `output: "standalone"` 被人删了）。

### 5.3 起全套服务

```bash
docker compose up -d
docker compose ps          # 四个服务都应该是 running，其中三个是 healthy
                           # （caddy 的 healthcheck 只是 `caddy version`，一般不显示 healthy）
```

四个服务分别是什么（**别看到多了一个就以为配错了**）：

| 服务 | 容器名 | 作用 | 对外端口 |
|---|---|---|---|
| `caddy` | `sbb-caddy` | 反代 + 自动 HTTPS，按域名分流 | **80 / 443** |
| `portal` | `sbb-portal` | 门户官网 | 无（只在 Docker 内网） |
| `site` | `sbb-site` | 外贸独立站 | 无（只在 Docker 内网） |
| `db` | `sbb-db` | PostgreSQL，只有 `site` 用 | 无（只在 Docker 内网） |

第一次起的时候，`site` 会先自动跑一次数据库迁移（因为 `RUN_MIGRATIONS=true`），
日志长这样：

```bash
docker compose logs -f site
# [entrypoint] RUN_MIGRATIONS=true，开始等数据库…
# [entrypoint] 数据库已就绪，执行 payload migrate…
# [entrypoint] 迁移完成。
# [entrypoint] 启动应用：node server.js
# ▲ Next.js 15.4.11
# - Local: http://0.0.0.0:3000
```

看到 `started server on` 之类就说明起来了。按 `Ctrl+C` 退出日志（不影响服务）。

### 5.4 验证能不能打开

```bash
# 1) 本机直接打两个容器（绕过 Caddy，确认应用自己是活的）
docker compose exec site wget -qO- http://127.0.0.1:3000/ | head -5
docker compose exec portal wget -qO- http://127.0.0.1:3000/ | head -5

# 2) 从外面访问根域名和 www（确认证书、反代、分流都对）
curl -I https://shangbangbang.com
curl -I https://www.shangbangbang.com
```

浏览器打开 `https://shangbangbang.com`：

- 地址栏有 🔒（证书签好了）
- 页面是**商帮帮门户官网**（不是某个客户的外贸站！）
- 页脚/联系方式里那个留资表单能提交成功（提交后浏览器控制台不会报错）

### 5.4.1 ⭐ 外贸站怎么访问（这里最容易懵）

⚠️ 记住一件事：**根域名现在归门户了**，所以
`https://shangbangbang.com/admin` 打开的是**门户的 404 页面**，不是 Payload 后台。
外贸站后台在**客户子域名**下面：

```
https://hengxin-tools.shangbangbang.com/admin
https://你新建的站点标识.shangbangbang.com/admin
```

子域名里的 `hengxin-tools` 就是后台「站点（客户）」里的**站点标识**，
两个必须一字不差（大小写不敏感）。

> ⚠️ 所以第一次上线时，「第一个管理员账号」这件事要**先有子域名可访问**才能做，
> 顺序建议是：
> 1. 先按 5.3 把服务起起来（迁移要已经跑过，见 5.7 / 第 6 步）；
> 2. 访问 `https://hengxin-tools.shangbangbang.com/admin` 建第一个管理员
>    （`hengxin-tools` 就是 `.env` 里 `DEFAULT_SITE` 的默认值；这个域名一定有，
>    因为 Caddy 的通配块接住了**所有**子域名）；
> 3. 想「有东西可看」再按 5.6 灌一次演示数据。

> 💡 **就是想让根域名也能进后台 / 看外贸站**：把 `deploy/Caddyfile` 里
> 「外贸站的根域名」那段注释去掉，然后 `docker compose restart caddy`。
> ⚠️ 但这样做的前提是门户**不能**再用根域名 —— 你的 `PORTAL_DOMAIN` 得先改成
> 别的域名。否则就是同一个域名被两个站点块认领，**Caddy 会直接报错起不来**。
> 具体见 `deploy/Caddyfile` 顶部「域名撞车怎么查」。

### 5.5 ⭐ 立刻创建超级管理员（有坑，必看）

后台是 Payload。**数据库里一个用户都没有时**，访问 `/admin` 会直接进
「创建第一个用户」界面，填邮箱密码即可 —— 这个账号就是超级管理员。

> ⚠️ **注意：这里的 `/admin` 指的是外贸站的 `/admin`，不是门户的。**
> 门户没有后台。外贸站的后台要从**子域名**进：
>
> ```
> https://hengxin-tools.shangbangbang.com/admin
> ```
>
> 而 `https://shangbangbang.com/admin` 是**门户**的地址，会返回 404 ——
> 这是正常的，不是坏了。原因见 5.4.1。

> ⚠️⚠️ **这个窗口只有一次。**
> 项目里 `payload/collections/Users.ts` 的 `create` 权限是
> `isSuperAdmin`（只有超管能建账号）。一旦有了第一个账号，
> 普通入口就不能再自助注册了；更糟的是**如果你把唯一的管理员删掉，
> 就没有人能再新建账号**（除非你把管理员重新插回数据库）。
>
> 所以：**网站一上线，第一件事就是建好管理员账号，并把密码存到密码管理器里。**

### 5.6 要不要灌演示数据？（想清楚再执行）

仓库里有个种子脚本 `apps/foreign-site/seed.ts`，会创建：

- 一个演示站点（租户 `hengxin-tools`，虚构的「恒信精密工具 / HX TOOLS」）
- 12 个产品、4 个分类、5 张认证、若干站点设置
- 一个超管账号 `admin@shangbangbang.com` / `Shangbang2026!`

执行方式：

```bash
docker compose exec site sh -c "cd /app/full && node node_modules/payload/bin.js run seed.ts"
```

> ⚠️⚠️ **三个警告，务必看完再决定**：
> 1. 这个脚本会**先清空** `inquiries`（询盘）、`products`、`categories`、
>    `certificates`、`site-settings`、`media` 里的**全部数据**再灌演示数据。
>    **上线之后绝对不能再跑** —— 会把你和客户的真实数据一起清掉。
> 2. 它会创建一个密码是公开的演示管理员账号。用它登录后**立刻改密码**
>    （后台右上角 → 账号设置），或者直接删掉这个账号、用你自己 5.5 建的那个。
> 3. 演示内容是一家虚构工厂。**交付给真实客户前必须全部替换掉。**

**建议**：第一次上线想「有东西看」就跑一次，然后用后台把演示站点改成
真实客户的信息；不想留演示数据就别跑，直接在后台建。

### 5.7 收尾：关掉自动迁移 + 第二次构建

确认网站正常之后：

```bash
nano .env
```

1. `RUN_MIGRATIONS` 改回 `false`
   （迁移改成你手动执行，避免每次重启都动数据库结构）
2. `DATABASE_URL` 改成真实值：
   `postgres://sbb_app:你的密码@db:5432/shangbangbang`

然后重新构建 + 重启，让每个客户的页面被预渲染：

```bash
docker compose build site
# 门户这次不用重建（它的内容没变）。
# 但如果你顺手改了 PORTAL_DOMAIN / PORTAL_SITE_URL，那就要连门户一起重建：
# docker compose build portal
docker compose up -d
docker compose ps
```

> 这一步之后，页面会变成静态的，打开速度明显变快。
> 也让搜索引擎更容易收录（SEO 是这个产品的核心卖点）。

### 5.8 上线后必做的 6 件事

1. ✅ 管理员密码已换成强密码（不是演示密码）
2. ✅ `.env` 里 `POSTGRES_PASSWORD` 和 `PAYLOAD_SECRET` 都是随机值
3. ✅ 外贸站后台能登录（`https://站点标识.shangbangbang.com/admin`），`http://` 会自动跳 `https://`
4. ✅ 门户能打开（`https://shangbangbang.com` 和 `https://www.shangbangbang.com`），
   留资表单能提交成功
5. ✅ 数据库和两个应用端口都没有暴露到公网（本项目默认就没暴露，别自己加 `ports`）
6. ✅ 配好了每日备份 —— **数据库**和**门户线索**两样都要备
   （见[第 8 步](#87-数据库备份与恢复最重要)）

---

## 第 6 步：数据库迁移（生产环境必须看这一节）

### 6.1 为什么不能用开发模式那套

开发时 Payload 会「看到字段变了就自动改表结构」（schema push）。
这个功能在生产环境有两个致命问题：

- 改表可能**丢数据**（它只保证结构对，不保证你的数据还在）
- 改到一半失败，数据库会卡在**半新半旧**的状态，网站直接崩

所以生产环境必须走**迁移文件**：先把「表结构怎么变」写成文件、人工审一遍，
再执行。文件提交进 git，换服务器、回滚都有据可查。

### 6.2 两条命令

```bash
cd apps/foreign-site

# ① 生成迁移文件（只生成文件，不改数据库）
npx payload migrate:create initial

# ② 执行迁移（真正改数据库）
npx payload migrate
```

其他可用命令（**以实际输出为准**）：

```bash
npx payload migrate:status     # 看哪些迁移跑了、哪些没跑
npx payload migrate:down       # 回滚最后一次迁移（生产环境慎用）
npx payload migrate:refresh    # 回滚并重跑全部迁移
npx payload migrate:reset      # 全部回滚
npx payload migrate:fresh      # 删库重建再跑全部迁移（⚠️ 会清空数据）
```

> ⚠️ 上面这些命令名和参数是从本项目安装的 `payload@3.90.2` 里核对出来的，
> 但**具体行为（尤其是 `refresh` / `reset` / `fresh` 对数据的处理）
> 请以 Payload 官方文档为准**，生产库上执行前先备份。

### 6.3 生成迁移文件时需要一个数据库

`migrate:create` 需要连一个 Postgres 来对比结构。**不要**拿生产库当试验场，
本地起一个临时的：

```bash
# 在服务器或本地，起一个一次性的 Postgres
docker run --rm -d --name tmp-pg \
  -e POSTGRES_PASSWORD=tmp -e POSTGRES_USER=tmp -e POSTGRES_DB=tmp \
  -p 55432:5432 postgres:16-alpine

cd apps/foreign-site
DATABASE_URL="postgres://tmp:tmp@127.0.0.1:55432/tmp" npx payload migrate:create initial
DATABASE_URL="postgres://tmp:tmp@127.0.0.1:55432/tmp" npx payload migrate

docker rm -f tmp-pg      # 用完删掉
```

生成的 `apps/foreign-site/migrations/` 目录**提交到 git**。

> 💡 迁移文件默认放在「命令执行目录下的 `migrations/`」。
> 本项目的 Docker 镜像是按这个约定写的
> （`docker-compose.yml` 里把 `apps/foreign-site/migrations` 只读挂到了容器的 `/app/full/migrations`）。
> 如果你的迁移文件生成到了别的目录，需要同步改 `docker-compose.yml` 里那个挂载路径。
> 也可以用 Postgres 适配器的 `migrationDir` 选项显式指定，**具体写法以官方文档为准**。

### 6.4 在服务器上执行迁移

**方式一（推荐，首次上线就用这个）**：让容器启动时自动跑一次。
在 `.env` 里临时把 `RUN_MIGRATIONS` 设成 `true`，然后：

```bash
docker compose up -d site
docker compose logs -f site | grep entrypoint
```

跑完记得改回 `false`。

**方式二（手动，日常改字段后发布时用）**：

```bash
cd /srv/shangbangbang
git pull                                   # 拉到新的迁移文件
cd deploy
docker compose exec site sh -c "cd /app/full && node node_modules/payload/bin.js migrate"
docker compose restart site                 # 让应用重新加载
```

> 💡 为什么要先 `cd /app/full`：镜像是用 Next.js 的 standalone（精简产物）
> 打包的，里面**没有**源码和完整的依赖，跑不了 Payload 的命令行。
> 所以 Dockerfile 里额外在 `/app/full` 放了一套「源码 + 完整 node_modules」，
> Payload 的命令行都在那个目录下执行。你不知道这件事的话，
> 会以为 `payload` 命令「在容器里不存在」。

### 6.5 改字段的标准流程（记住这个顺序）

```
本地改集合定义 → 本地生成迁移 → 本地验证 → 提交 git
   → 服务器 git pull → 备份数据库 → 执行迁移 → 重启 site → 验证
```

> ⚠️ **永远先备份再迁移**。备份命令见 [8.7](#87-数据库备份与恢复最重要)。
> 迁移出问题的概率不高，但出一次就够你熬夜。

---

## 第 7 步：加一个新客户 / 绑客户自己的域名

### 7.0 ⭐ 先选：这个客户的站点用哪个域名？

这一步**必须在建站点之前想清楚**，因为它决定了你要不要动「绑定域名」，
也决定了要不要重新构建。以演示中的「恒信精密工具」为例，两种做法：

#### 做法一（推荐）：用 `hengxin-tools.shangbangbang.com`

**零配置。** 因为「域名 → 站点标识」的规则是写死的：

```
客户名.shangbangbang.com   →   站点标识 = 客户名
```

所以只要后台那个站点的「站点标识」填的是 `hengxin-tools`，
`https://hengxin-tools.shangbangbang.com` **立刻就能用**：

- ✅ 不用在后台填任何「绑定域名」
- ✅ 不用跑 `npm run domains`
- ✅ 不用重新构建
- ✅ 不用改 Caddyfile、不用改 DNS（通配记录已经覆盖）

**加客户的首选就是它**，5 分钟一个。

#### 做法二：非要换成 `demo.shangbangbang.com`

⚠️ **`demo` 不是站点标识**（这个站点的标识是 `hengxin-tools`），
所以「按子域名猜标识」那条规则认不出来，必须靠映射表补上。要动的地方：

1. **在后台把 `demo.shangbangbang.com` 加到恒信这个站点的「绑定域名」里**
   （后台 → 系统 → 站点（客户）→ 恒信 → 「域名与状态」标签页 → 绑定域名 → 添加 →
   填 `demo.shangbangbang.com` → 保存）

2. 重新构建外贸站 —— **映射表会在这一步自动重新生成**：

   ```bash
   cd /srv/shangbangbang/deploy
   docker compose build site
   docker compose up -d
   ```

   > 💡 为什么构建就够了：`apps/foreign-site/package.json` 里的
   > `prebuild` 会在 `next build` **之前**自动执行 `npm run domains`，
   > 而 `npm run domains` 就是 `payload run scripts/gen-domains.ts` ——
   > 它会连数据库、把「域名 → 站点标识」写成
   > `lib/domains.generated.json`，然后被中间件（`lib/tenant.ts`）import。
   > 中间件跑在 Edge 运行时、**不能查数据库**，所以只能靠这张构建前生成的表。

   > ⚠️ **前提：这次构建的 `DATABASE_URL` 得是能连上库的真实值。**
   > 如果还停在 `.env.example` 里那个占位值
   > （`postgres://build:build@127.0.0.1:5432/build`），
   > `gen-domains.ts` 连不上库、构建会失败或生成的表是空的。
   > 第一次上线时构建用占位值是为了「先跑通链路」，那种情况下**先别折腾绑定域名**。

   > ⚠️ **关于「我想先确认一下那张表里到底有没有 demo」**：
   > 镜像里**没有** `scripts/` 目录（Dockerfile 为了减小体积只把
   > `payload/ lib/ app/ components/` 这些拷进了 `/app/full`），
   > 所以**在容器里手动敲 `npm run domains` 会报「找不到脚本」，这是正常的**，
   > 不代表你配错了。要眼见为实，用这两种办法之一：
   > - 构建时看输出：`docker compose build site 2>&1 | grep -A20 "域名映射"`；
   > - 或者直接在服务器上 checkout 一份仓库、装好依赖后跑（需要能连库，
   >   本地跑要写 `DATABASE_URL=...`，**具体做法以 `payload` 官方文档为准**）。

> ⚠️ **漏掉第 1 步的后果**：`demo.shangbangbang.com` 会被中间件
> 当成「没认出来的域名」，**回退到默认站点**（`.env` 里的 `DEFAULT_SITE`，
> 出厂值是 `hengxin-tools`）。所以现象会非常迷惑：
> **看起来「能用」，其实只是它恰好就是默认站点。**
> 等你以后加了第二个客户、把默认站点改成别人，这个域名就会**悄悄指向错误的站点**。
> 所以别用「打开能看就行」来验证这一步，要去确认解析出来的标识
> （用[9.3](#93--打开的是另一个客户的站点host-传错了)里的 `x-site-slug` 响应头最直接）。

> 💡 顺便说一句：`package.json` 里的 `prebuild` 已经会在 `next build` 之前
> 自动跑一次 `npm run domains`。但**在容器里单独执行第 2 步仍然必要** ——
> 因为你要先看到那张表打印出来，才能确认后台的域名确实被读到了。

### 7.1 用子域名（最简单，零配置）

1. **不用改 DNS** —— `*` 通配记录已经覆盖了
2. 后台 → 「系统 → 站点（客户）」→ 新建，填公司名、站点标识（比如 `abc-tools`）
3. 访问 `https://abc-tools.shangbangbang.com`

> ✅ **好消息**：下面这段「当前版本的限制」已经**不再成立**了 ——
> 仓库里已经加上了「域名 → 站点标识」映射表
> （`apps/foreign-site/lib/domains.generated.json`，
> 由 `scripts/gen-domains.ts` 在构建前生成，中间件通过 `lib/tenant.ts` 查它）。
>
> 也就是说：
> - ✅ `客户名.shangbangbang.com` 这类子域名 —— 能用
> - ✅ 客户自己的域名（`factory-a.com`）—— 也能用了，
>   **前提是它被写进了那个站点的「绑定域名」里**，并且跑过 `npm run domains` + 重新构建
>   （见 7.0 做法二和 7.2）
>
> ⚠️ 但注意「回退」这条规则**还在**：任何没被映射表认出来的域名，
> 依然会打开**默认站点**。这意味着**配错了不会报错，只会静默显示错误的站点** ——
> 排查方法见[第 9 步 9.3](#93--打开的是另一个客户的站点host-传错了)。

### 7.2 用客户自己的域名

1. 让客户把 `factory-a.com` 和 `www.factory-a.com` 的 A 记录指向你的服务器 IP
2. 等 DNS 生效：`dig +short factory-a.com`
3. **在后台把这个域名加到对应站点的「绑定域名」里**
   （后台 → 系统 → 站点（客户）→ 那个客户 → 「域名与状态」→ 绑定域名 → 添加）。
   ⚠️ 别填 `https://` 前缀，只填域名本身。
4. **重新构建外贸站**，让映射表把新域名带上：
   ```bash
   cd /srv/shangbangbang/deploy
   docker compose build site && docker compose up -d
   ```
   （原理和注意事项见 7.0 做法二里那段说明 —— 尤其是
   「构建用的 `DATABASE_URL` 必须能连上库」这一条。）
5. 编辑 `deploy/Caddyfile`，在「客户自己的域名」那段下面复制一份
   （**缩进请用 Tab**，不要用空格；下面这里为了在文档里显示才写成空格）：

   ```
   factory-a.com, www.factory-a.com {
       import site_common
       import proxy_to_site
   }
   ```

6. 重启 Caddy：

   ```bash
   cd /srv/shangbangbang/deploy
   docker compose restart caddy
   docker compose logs -f caddy          # 看它自动签发证书
   ```

> ⚠️ **顺序不能反**：先解析、后加配置。DNS 没生效就加配置，
> Caddy 会立刻尝试签发并失败，失败次数多了会被 CA 限流。
>
> ⚠️ 第 3、4 步和第 5、6 步是**两件不同的事**，都要做：
> - 第 3、4 步让**应用**知道这个域名属于哪个客户（否则显示默认站点）
> - 第 5、6 步让**Caddy**把这个域名的流量转进来并签好证书（否则根本打不开）
>
> 只做一半的典型症状：域名能打开、证书也对，但内容是**另一个客户**的。

### 7.3 后台加完客户后，别忘了重新构建

因为页面是按「已知的站点列表」预渲染的，新增客户之后要重新构建一次，
新客户的页面才会变成静态的（不重建也能访问，只是第一次访问慢一点）：

```bash
cd /srv/shangbangbang/deploy
docker compose build site && docker compose up -d
```

> ⚠️ 这里**只重建 `site`**，不要顺手 `docker compose build`（会把门户也重建一遍，
> 白等几分钟；门户只有在改了它自己的内容或 `PORTAL_SITE_URL` 时才需要重建）。

---

## 第 8 步：日常运维

### 8.1 看日志

```bash
cd /srv/shangbangbang/deploy

docker compose logs -f site        # 实时看外贸站日志（Ctrl+C 退出，不会停服务）
docker compose logs -f portal      # 实时看门户日志（留资线索也会打在这里，[LEAD] 开头）
docker compose logs -f caddy       # 看证书、看访问日志
docker compose logs -f db          # 看数据库日志
docker compose logs --tail=200 site   # 只看最后 200 行
```

> 日志里最常看的三样：
> - **Caddy 访问日志**：能直接看到「哪个域名被访问了、转发到了哪个容器」，
>   排查「打开的是另一个客户的站点」「门户和外贸站搞混了」全靠它
> - **site 的 `[cms]` 开头警告**：说明应用连不上数据库或查询失败
> - **portal 的 `[LEAD]` 开头日志**：每来一条留资线索都会打一行，
>   是「线索有没有丢」最快的判断依据

### 8.2 重启 / 停 / 起

```bash
docker compose restart site        # 只重启外贸站
docker compose restart portal      # 只重启门户
docker compose restart             # 重启全部
docker compose stop                # 停止（数据不丢）
docker compose start               # 再启动
docker compose down                # 删除容器（⚠️ 数据卷还在，但容器里的临时改动会丢）
docker compose down -v             # ⚠️⚠️ 连数据卷一起删 = 数据库、图片、门户线索全没了，别乱敲
docker compose ps                  # 看当前状态
```

> ⚠️ `down -v` 删掉的四个卷是：`pgdata`（客户全部数据）、`media`（客户上传的图）、
> **`portal_data`（门户的留资线索）**、`caddy_data`（证书）。
> 敲之前先把[第 8.7、8.8 节](#87-数据库备份与恢复最重要)的备份做掉。

### 8.3 更新代码重新部署

```bash
cd /srv/shangbangbang
git pull                                  # 拉新代码

cd deploy
# 如果这次改动涉及数据库字段：先按第 6 步生成并提交迁移文件
docker compose exec db pg_dump -U sbb_app -d shangbangbang -F c -f /tmp/before-update.dump   # 先备份！
docker compose build site                 # 重新构建外贸站镜像
# 如果这次也改了门户（apps/portal/ 下的东西），再补一条：
# docker compose build portal
docker compose up -d                      # 用新镜像替换旧容器
docker compose logs -f site               # 看着它起来
```

> 只改了文案/样式（没动数据库字段）的话，迁移那步可以跳过。
> 改了集合定义（`payload/collections/*.ts`）**必须**走迁移。
>
> ⚠️ **改了哪个应用就只构建哪个**：`apps/portal` 和 `apps/foreign-site` 是
> 两个完全独立的镜像，门户的改动**不会**进外贸站的镜像（反之亦然）。
> 只 `docker compose up -d` 而不 `build`，跑的还是旧镜像。

### 8.4 改环境变量

```bash
nano .env
docker compose up -d            # 大部分变量会被重新读取
docker compose restart site      # 保险起见再重启一次
```

> ⚠️ `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` 只在
> **数据库第一次初始化**时生效。卷建好之后再改 `.env`，
> 数据库里的账号密码不会跟着变，应用会连不上。
> 真要改密码，得先进数据库用 SQL 改（`ALTER USER ... WITH PASSWORD ...`），
> 并且同步改 `.env` 里的 `DATABASE_URL`。**改之前务必备份。**
>
> ⚠️ `ROOT_DOMAIN` 和 `DEFAULT_SITE` 属于**构建期**变量：
> 应用里识别域名的那段代码（middleware）在构建时就被打包定型了，
> 只改 `.env` 再 `restart` **不生效**，必须
> `docker compose build site && docker compose up -d` 重新构建。
>
> ⚠️ **门户这边同理，而且是另一套命令**（别敲错成 site）：
> - `PORTAL_SITE_URL` 是**构建期**变量（会被内联进页面里的 canonical / sitemap）→
>   改了必须 `docker compose build portal && docker compose up -d`
> - `PORTAL_DOMAIN` 是**运行时**变量，caddy 容器读它 →
>   改了 `.env` 之后 `docker compose up -d caddy`（或 `docker compose restart caddy`）即可，
>   门户容器不用动
> - `LEAD_WEBHOOK_URL` 是门户容器运行时变量 → `docker compose up -d portal`
>
> ⚠️⚠️ 改 `PORTAL_DOMAIN` 之前先读一遍 `deploy/Caddyfile` 顶部
> 「域名撞车怎么查」：把它改成 `ROOT_DOMAIN` 的**子域名**（比如
> `portal.shangbangbang.com`）会让 Caddy **起不来**。
> 要换就换成完全另一套域名（比如 `shangbangbang.cn`），并同步改 `PORTAL_SITE_URL`。

### 8.5 想连进数据库看看（不改 compose 配置）

项目**故意**没有把数据库端口暴露到公网，要临时进去用这两种方式：

```bash
# 方式一：直接用容器里的 psql（最省事，推荐）
docker compose exec db psql -U sbb_app -d shangbangbang

# 进去之后常用命令：\dt 看表，\d products 看表结构，\q 退出
```

```bash
# 方式二：用你电脑上的数据库工具连（Navicat / TablePlus / DBeaver）
# 在你自己电脑上开一条 SSH 隧道，再连本地 5433 端口
ssh -N -L 5433:127.0.0.1:5432 deploy@你的服务器IP
# 注意：db 容器的 5432 只绑在 Docker 内网，上面这条要先把端口临时映射出来，
#       或者改成连 site 容器所在主机的容器 IP（麻烦）。
# 所以临时调试建议还是用方式一。
```

> 💡 再强调一次：这个数据库**只有外贸站用**（Payload 的数据 + 客户询盘）。
> 门户**不连库**，所以你在库里翻不到任何门户的东西 ——
> 门户的留资线索在卷里那个 `leads.jsonl` 文件里，见
> [8.8](#88-门户的留资线索leadsjsonl备份必看)。

### 8.6 磁盘满了怎么办

Docker 的日志和镜像会越攒越多：

```bash
df -h                                   # 看磁盘
docker system df                        # 看 Docker 占了多少
docker image prune -a                   # 删没用到的旧镜像（会删掉旧版本，确认不需要回滚再执行）
docker builder prune                    # 清构建缓存（占几个 G 很常见）
```

在 `deploy/docker-compose.yml` 的每个服务里加日志上限（**建议早点加**）：

```yaml
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

### 8.7 数据库备份与恢复（最重要）

客户数据丢了就是事故，**这一段请务必配好，并且定期演练一次恢复**。

#### 手动备份

```bash
cd /srv/shangbangbang/deploy
mkdir -p /srv/backups

# 备份（-F c 是自定义格式，压缩过，恢复也快）
docker compose exec -T db pg_dump -U sbb_app -d shangbangbang -F c \
  > /srv/backups/db-$(date +%F-%H%M).dump

# 确认文件不是空的（正常应该几百 KB 到几 MB）
ls -lh /srv/backups/
```

> ⚠️ 把 `sbb_app` / `shangbangbang` 换成你 `.env` 里 `POSTGRES_USER` /
> `POSTGRES_DB` 的值。`-T` 不能省，否则输出会被终端格式搞坏。

#### 恢复（演练一遍！）

```bash
cd /srv/shangbangbang/deploy

# 1) 停应用，避免有人正在写入
docker compose stop site

# 2) 清空并重建数据库（⚠️ 会删掉当前所有数据，只在确认要恢复时做）
docker compose exec -T db psql -U sbb_app -d postgres \
  -c "DROP DATABASE IF EXISTS shangbangbang;" \
  -c "CREATE DATABASE shangbangbang OWNER sbb_app;"

# 3) 灌回备份
docker compose exec -T db pg_restore -U sbb_app -d shangbangbang --no-owner \
  < /srv/backups/db-2026-10-11-1200.dump

# 4) 重新起应用
docker compose start site
docker compose logs -f site
```

> 恢复命令的参数（`--no-owner` 等）随 PostgreSQL 版本略有差异，
> **以官方文档为准**。第一次一定要在**测试库**上练一遍，
> 别等真出事的时候第一次用。

#### 媒体文件备份（客户上传的图片/PDF）

媒体存在 Docker 具名卷里，备份方式：

```bash
# 备份（打成 tar 包）
docker run --rm \
  -v deploy_media:/data:ro \
  -v /srv/backups:/backup \
  alpine tar czf /backup/media-$(date +%F).tar.gz -C /data .

# 恢复
docker run --rm \
  -v deploy_media:/data \
  -v /srv/backups:/backup \
  alpine sh -c "rm -rf /data/* && tar xzf /backup/media-2026-10-11.tar.gz -C /data"
```

> ⚠️ 卷名 `deploy_media` 的规则是「compose 项目名_卷名」。
> 项目名默认是 `docker-compose.yml` 所在目录名（这里是 `deploy`）。
> 用 `docker volume ls` 确认实际名字，**别照抄**。

#### 自动备份（每天凌晨 3 点）

```bash
crontab -e
```

加一行（注意整行写成一条命令）：

```
0 3 * * * cd /srv/shangbangbang/deploy && docker compose exec -T db pg_dump -U sbb_app -d shangbangbang -F c > /srv/backups/db-$(date +\%F).dump && find /srv/backups -name "db-*.dump" -mtime +14 -delete
```

> 这行做的事情：每天 3 点备份一次，并删掉 14 天前的旧备份。
> ⚠️ crontab 里的 `%` 必须写成 `\%`，否则会被 cron 当成换行。
> **更好的做法**是把备份放到另一台机器或对象存储（服务器整台挂掉时，
> 备份和数据库一起没了）。这块**需自行确认**你打算用哪个存储服务。

### 8.8 门户的留资线索（leads.jsonl）备份（必看）

> ⚠️ **先说清楚：这是一个临时方案，别把它当正式方案用。**
> 门户的 `/api/lead` 接口（`apps/portal/app/api/lead/route.ts`）当前做的事情是：
> 打一行控制台日志 + **把线索追加写到容器里的 `/app/data/leads.jsonl`**。
> `deploy/docker-compose.yml` 给这个目录挂了具名卷 `portal_data`，所以
> **重建容器不会丢**；但这条链路的问题很明显：
>
> | 问题 | 后果 |
> |---|---|
> | 文件在服务器上，你不在服务器上 | 来了新线索你**不会知道**（没有邮件、没有微信提醒） |
> | 备份要自己做（见下） | 磁盘挂了 / `down -v` 敲错就全没了 |
> | 用 SQL 查不了、后台看不到 | 想做统计、导客户、分配给销售都很别扭 |
>
> **正式做法（二选一，代码里已经留好口子）：**
>
> 1. **转发到 webhook（最省事，不用改代码）**：
>    在 `.env` 里填 `LEAD_WEBHOOK_URL`（企业微信机器人 / 飞书 / 自建接口的地址），
>    并且去 `deploy/docker-compose.yml` 的 `portal` 服务里把
>    `# LEAD_WEBHOOK_URL: ${LEAD_WEBHOOK_URL}` 这行的注释去掉，
>    然后 `docker compose up -d portal`。
>    > ⚠️ 企业微信机器人对消息格式有要求，代码里发的是 `{"msgtype":"text",...}` 这种
>    > 企业微信格式。**换成飞书或其他服务时格式可能不一样，需自行确认**（可能要改代码）。
> 2. **改成写数据库**：门户目前没有库，要给门户单独加一个库或复用外贸站的库，
>    然后改 `route.ts`。这属于**改应用代码**，不在本指南范围内。
>
> ⚠️ 如果你已经把门户部署到了 Serverless 平台（Vercel 之类），
> 容器里的文件系统**不持久**，leads.jsonl 那条路等于没写 —— 必须用上面两种方案之一。

#### 手动看一眼 / 备份线索

```bash
cd /srv/shangbangbang/deploy

# 1) 看卷里有没有东西（卷名规则是「项目名_卷名」，这里项目名是 deploy）
docker volume ls | grep portal_data

# 2) 直接看内容（每行一条 JSON，最新的在最后）
docker run --rm -v deploy_portal_data:/data alpine tail -20 /data/leads.jsonl

# 3) 备份（打成 tar 包，和媒体文件一个套路）
docker run --rm \
  -v deploy_portal_data:/data:ro \
  -v /srv/backups:/backup \
  alpine tar czf /backup/portal-leads-$(date +%F).tar.gz -C /data .

# 4) 恢复（⚠️ 会先清空现有线索，确认了再敲）
docker run --rm \
  -v deploy_portal_data:/data \
  -v /srv/backups:/backup \
  alpine sh -c "rm -f /data/leads.jsonl && tar xzf /backup/portal-leads-2026-10-11.tar.gz -C /data"
```

> ⚠️ 卷名 `deploy_portal_data` 是按「compose 项目名_卷名」拼的，
> 项目名默认是 `docker-compose.yml` 所在目录名（这里是 `deploy`）。
> **先用 `docker volume ls` 确认真实名字，别照抄。**

#### 自动备份（加到同一个 crontab 里）

```bash
crontab -e
```

在 [8.7](#87-数据库备份与恢复最重要) 那条数据库备份的**后面**再加一行：

```
0 4 * * * docker run --rm -v deploy_portal_data:/data:ro -v /srv/backups:/backup alpine tar czf /backup/portal-leads-$(date +\%F).tar.gz -C /data . && find /srv/backups -name "portal-leads-*.tar.gz" -mtime +30 -delete
```

> 这行做的事情：每天 4 点（错开 3 点的数据库备份）打包一次门户线索，
> 并删掉 30 天前的旧包。
> ⚠️ 同样是「备份和服务器在一起」的问题 —— 服务器整台挂了就一起没了，
> 建议把 `/srv/backups` 同步到对象存储或另一台机器（见 8.7 里的同一句提醒）。

### 8.9 看证书状态

```bash
docker compose logs caddy | grep -i -E "certificate|obtain|renew|error"
```

Caddy 会自动续期（到期前 30 天左右开始动手），一般不用管。
但如果证书一直签不下来，看[第 9 步](#91-证书签不下来浏览器提示不安全)。

---

## 第 9 步：出问题了怎么查

> 排查口诀：**从里往外查** —— 先确认 site 自己是活的，再确认 Caddy 能转发，
> 最后确认外面能访问。

### 9.1 证书签不下来（浏览器提示「不安全」）

**症状**：`https://` 打不开，或证书报错；`docker compose logs caddy` 里有
`error` / `obtain` / `challenge` 字样。

**按顺序查**：

```bash
# 1) DNS 到底解析对了吗？（最常见的原因就是这个）
dig +short shangbangbang.com
dig +short test.shangbangbang.com
# 没打印出你的服务器 IP → 去 DNS 服务商改记录，等生效

# 2) 80 端口从外网通吗？（HTTP-01 验证需要）
curl -I http://shangbangbang.com
# 超时 → 检查云服务商「安全组」和服务器 ufw 是不是都放行了 80

# 3) 看 Caddy 具体报什么错
docker compose logs --tail=200 caddy
```

**常见原因**：

| 日志里的关键词 | 原因 | 怎么办 |
|---|---|---|
| `no such host` / `NXDOMAIN` | DNS 没配或没生效 | 回去配 A 记录，等 10 分钟 |
| `timeout` / `connection refused` | 80 端口没通 | 安全组 + ufw 都放行 80 |
| `rate limit` / `too many failed authorizations` | 失败太多次被 CA 限流 | 等一周，或先用 `ACME_CA` 指向 staging 调试 |
| `unauthorized` / `invalid token`（通配符时） | DNS 插件凭据不对 | 检查 `.env` 里 DNS 凭据，看插件 README 确认变量名 |
| `no module named dns.providers.xxx` | Caddy 镜像里没装这个 DNS 插件 | 用 xcaddy 自己编译（见 9.6） |

**最快恢复网站的办法**：打开 `deploy/Caddyfile`，把全局设置里那行
`acme_ca https://acme-staging-v02.api.letsencrypt.org/directory`
取消注释（**不是改 `.env`，`.env` 里没有这个开关**），
然后 `docker compose restart caddy`，用 Let's Encrypt 的 staging 环境
验证流程通不通；通了再把那行注释回去、重启一次。
staging 的证书浏览器不认，**只用来验证链路**。

### 9.2 502 Bad Gateway

**含义**：Caddy 活着，但它转发给后端（`site:3000` 或 `portal:3000`）时没得到正常响应。

```bash
# 1) 哪个应用的容器不健康？（先确定是门户还是外贸站）
docker compose ps
# site 或 portal 显示 Restarting / Exited → 看它的日志

# 2) 看对应应用的日志（这一步能直接告诉你是哪个）
docker compose logs --tail=200 site
docker compose logs --tail=200 portal

# 3) 应用自己能响应吗？（在容器内部打）
docker compose exec site wget -qO- http://127.0.0.1:3000/ | head -5
docker compose exec portal wget -qO- http://127.0.0.1:3000/ | head -5
```

**常见原因**：

| 日志里的关键词 | 原因 | 怎么办 |
|---|---|---|
| `ECONNREFUSED` + 数据库相关 | 数据库没起来 / 连接串错了（**只可能是外贸站**，门户不连库） | `docker compose logs db`；核对 `.env` 里 `DATABASE_URL` 的用户名密码库名 |
| `relation "xxx" does not exist` | **没跑数据库迁移** | 按[第 6 步](#64-在服务器上执行迁移)跑 `payload migrate` |
| `Cannot find module` | 构建产物不全 | 哪个应用报的错就重建哪个：`docker compose build site --no-cache && docker compose up -d`（门户换成 `build portal`） |
| 容器反复重启、没明显报错 | 内存不够被系统杀掉（**跑两个应用后更容易撞到**） | `free -h` 看内存；升级配置或加 swap；也可以只用 `docker compose up -d portal` 先保门户 |
| `ENOTFOUND db` | site 和 db 不在同一个网络 | `docker compose down && docker compose up -d` 重建 |
| **只有门户 502，外贸站正常** | 门户镜像没构建成功 / 容器没起来 | `docker compose logs portal`；`docker compose build portal && docker compose up -d portal` |
| **根域名 502、子域名正常** | Caddy 找不到 `portal` 这个服务名（比如服务被改名/删了） | 检查 `docker-compose.yml` 里服务名是不是 `portal`，以及 Caddyfile 里 `reverse_proxy portal:3000` 有没有被改错 |

### 9.3 ⭐ 打开的是另一个客户的站点（Host 传错了）

**这是这套系统最典型的故障**，因为「哪个域名 = 哪个客户」全靠 Host 头判断。

**症状**：访问 `abc-tools.shangbangbang.com`，出来的是别的客户的内容。

**排查**：

```bash
# 1) 看应用收到的 Host 到底是什么（这是决定性证据）
docker compose logs caddy | grep -i "abc-tools"
docker compose logs site | tail -50

# 2) 手动指定 Host 直接打应用，看它返回哪个站点
docker compose exec site wget -qO- --header="Host: abc-tools.shangbangbang.com" \
  http://127.0.0.1:3000/ | grep -i "<title>"
```

**原因和修法**：

| 现象 | 原因 | 修法 |
|---|---|---|
| `wget --header=Host:` 能返回正确的站点，但从外面访问不对 | Caddy 转发时把 Host 改了 | 检查 `deploy/Caddyfile` 的 `(proxy_to_site)` 片段里这几行还在不在：<br>`header_up Host {host}`<br>`header_up X-Forwarded-Host {host}` |
| 直接打应用也不对（子域名） | 应用里的域名解析规则不认识这个域名 | 看 `apps/foreign-site/lib/tenant.ts`：<br>子域名规则是 `xxx.shangbangbang.com` → 站点标识 `xxx`；<br>⚠️ `www` / `admin` / `api` / `app` / `cdn` / `static` / `mail` 这几个子域名是**保留字**，不当作客户站点 |
| 直接打应用也不对（客户自己的域名） | 映射表里没有这个域名 → 回退到默认站点 | ① 后台那个站点的「绑定域名」里有没有它；<br>② 有没有重新构建（`docker compose build site`）—— 映射表是**构建前生成**的，见[第 7.0 节](#70--先选这个客户的站点用哪个域名) |
| 所有域名都显示同一个站点 | 很可能是 Host 被上游（CDN/负载均衡）改掉了 | 如果有 Cloudflare 等在前端，确认它是**原样透传 Host**，而不是改成源站 IP |
| 站点标识对但内容空 | 后台那个站点的数据还没录 | 登录 `/admin`，切到那个站点看有没有内容 |
| **根域名打开的是外贸站** | 门户没接上，根域名被外贸站认领了 | 见 [9.7](#97--门户和外贸站搞混了根域名打开成了外贸站) |

**一个快速自检**：应用会给响应加一个 `x-site-slug` 响应头，
可以直接看到它认为你在访问哪个站点：

```bash
curl -sI https://abc-tools.shangbangbang.com | grep -i x-site-slug
```

> 如果这个头显示的不是 `abc-tools`，问题一定在「域名解析规则」或「Host 传递」，
> 而不是数据库。

### 9.4 媒体文件丢失（图片全裂了）

**症状**：客户上传的产品图 404，或上传报错。

```bash
# 1) 卷还在吗？
docker volume ls | grep media

# 2) 卷里有没有东西？
docker run --rm -v deploy_media:/data alpine ls -la /data | head

# 3) 容器里那个目录的属主对不对？（非 root 运行，属主错了就写不进去）
docker compose exec site ls -ld /app/public/media
# 应该是 nextjs nextjs
```

**常见原因**：

| 现象 | 原因 | 修法 |
|---|---|---|
| 卷是空的，但之前有图 | 执行过 `docker compose down -v`（连卷一起删了） | 从备份恢复（[8.7](#87-数据库备份与恢复最重要)），或让客户重传 |
| `EACCES` / `permission denied` | 卷的属主不是 `nextjs`（uid 1001） | 见下面 |
| 图片时有时无 | 卷没挂上，文件写在容器里，重建容器就没了 | 检查 `docker-compose.yml` 的 `volumes: - media:/app/public/media` |

**属主问题的修法**：

```bash
docker compose exec -u root site chown -R nextjs:nextjs /app/public/media
docker compose restart site
```

> 如果每次重建容器都要重设属主，说明卷创建时的属主没继承镜像设置
> （Dockerfile 里已经 `mkdir` + `chown` 过了，正常不会出问题）。
> 真的反复出现，就在启动脚本里加一句 `chown`，**但要知道自己在绕过什么**。

### 9.5 后台 /admin 打不开或登录后空白

```bash
# 1) 确认 PAYLOAD_SECRET 没变过（改过会导致所有登录态失效）
grep PAYLOAD_SECRET .env

# 2) 看应用日志里有没有 Payload 的报错
docker compose logs site | grep -i -E "payload|error" | tail -30

# 3) 清掉浏览器里那个域名的 Cookie / 换无痕窗口再试
```

> 换了 `PAYLOAD_SECRET` 之后，所有人都会被强制登出，重新登录即可，数据不会丢。

### 9.6 想用通配符证书，但 Caddy 说没有 DNS 模块

官方 `caddy:2-alpine` 镜像**不含任何 DNS 插件**。要签 `*.shangbangbang.com`，
必须自己编译一个：

```bash
# 在任意一台装了 Docker 的机器上执行
docker run --rm caddy:2-builder xcaddy build \
  --with github.com/caddy-dns/cloudflare \
  --output /tmp/caddy
```

> ⚠️ 上面这条命令的**镜像名、参数、插件路径以 xcaddy / caddy-dns 官方文档为准**，
> 不同版本可能不一样，**需自行确认**。
> 编译出来的二进制再打进你自己的镜像，然后把 `deploy/.env` 里的
> `CADDY_IMAGE` 指向它。
>
> **更省事的做法**：不用通配符。在 `deploy/Caddyfile` 里给每个子域名
> 单独写一段（复制「客户自己的域名」那段，把域名改掉），
> Caddy 用 HTTP-01 自动签单域名证书，**零额外配置**。
> 客户数量不多的时候，这是更划算的选择。
> 客户多了再上通配符。

### 9.7 ⭐ 门户和外贸站搞混了（根域名打开成了外贸站）

**症状（很常见，先看这一节再排查别的）**：

- 打开 `https://shangbangbang.com`，出来的是**某个客户的外贸站**，不是商帮帮官网
- 或者反过来：打开 `https://客户名.shangbangbang.com`，出来的是门户页面
- 或者 `https://shangbangbang.com/admin` 是 404（这个**不是故障**，见下）

**先记住设计意图**（对照着看就不会慌）：

| 你访问的域名 | 应该看到 | 归哪个容器 |
|---|---|---|
| `shangbangbang.com` | 商帮帮门户官网 | `portal:3000` |
| `www.shangbangbang.com` | 商帮帮门户官网 | `portal:3000` |
| `客户名.shangbangbang.com` | 那个客户的外贸站 | `site:3000` |
| `客户自己的域名` | 那个客户的外贸站 | `site:3000` |
| `shangbangbang.com/admin` | **404**（门户没有后台） | `portal:3000` |
| `客户名.shangbangbang.com/admin` | Payload 后台 | `site:3000` |

**按顺序查（4 步，别跳）**：

```bash
cd /srv/shangbangbang/deploy

# 1) 看 .env 里两个域名到底配成了什么
grep -E "PORTAL_DOMAIN|ROOT_DOMAIN" .env
# 默认应该是两个都等于 shangbangbang.com（门户占根域名和 www，
# 外贸站只占 客户名.shangbangbang.com），这是正常的、也是推荐的

# 2) 看 Caddy 到底把请求转发给了谁 —— 这是决定性证据
docker compose logs caddy | grep -i "shangbangbang.com"
# 日志里会显示反向代理的目标。目标是 portal:3000 就对了。

# 3) 绕过 Caddy，直接问两个容器同一个 Host，看各自答什么
docker compose exec caddy wget -qO- --header="Host: shangbangbang.com" http://portal:3000/ | grep -i "<title>"
docker compose exec caddy wget -qO- --header="Host: shangbangbang.com" http://site:3000/   | grep -i "<title>"
# 两边的标题应该完全不同：portal 是官网标题，site 是某个客户的标题。
# 如果第 2 条看起来「也像官网」，说明你其实是在看缓存/看错 URL，回到第 1 步。

# 4) 确认 Caddy 加载的配置就是你以为的那份
docker compose exec caddy caddy validate --config /etc/caddy/Caddyfile
# 通过 = 配置本身没语法/域名冲突问题；不通过 = 它会把出问题的域名指出来。
# 💡 还有一条只看不碰的办法：在服务器上（不是在容器里）跑
#      docker compose config
#    它会把 .env 里的变量替换进 compose 后的最终结果打出来，
#    用来确认 PORTAL_DOMAIN / ROOT_DOMAIN 到底被解析成了什么，最直观。
# ⚠️ caddy 子命令的参数随版本略有差异，以 `caddy validate --help` 和官方文档为准。
```

**最常见的原因（对号入座）**：

| 现象 | 原因 | 修法 |
|---|---|---|
| 根域名打开是外贸站 | `deploy/Caddyfile` 里「门户」那个站点块被删了/被注释了，于是根域名没人认领，落到了外贸站的通配块或默认站点上 | 检查第 1 段 `{$PORTAL_DOMAIN}, www.{$PORTAL_DOMAIN}` 是否还在；改完 `docker compose restart caddy` |
| 根域名打开是外贸站 | 你把 `PORTAL_DOMAIN` 改成了别的域名，但 DNS 那边的 `@` / `www` 还指着这台服务器，同时 Caddyfile 里外贸站的根域名块被打开了 | 要么把 `PORTAL_DOMAIN` 改回根域名，要么把门户域名的 DNS 也切过去。**两者只能有一个占根域名** |
| **Caddy 反复重启 / 起不来**，日志里有 `ambiguous` / `already defined` 之类字样 | 同一个域名被两个站点块认领了（典型：`PORTAL_DOMAIN` 填成了 `xxx.shangbangbang.com` 子域名，撞上 `*.shangbangbang.com`） | 见 `deploy/Caddyfile` 顶部「域名撞车怎么查」，那里有完整排查步骤。**报错原文以你的实际日志为准** |
| 门户首页打开正常，但点任何链接都 404 | 门户的 standalone 产物里缺 `.next/static` 或 `public`（Dockerfile 的 COPY 漏了） | 重新构建门户：`docker compose build portal --no-cache && docker compose up -d portal` |
| 门户能打开，但提交留资表单报 500 | 容器里的 `/app/data` 写不进去（卷属主不对） | 见 [9.8](#98-门户提交留资失败500或线索没落盘) |
| 所有域名都指向同一个站点 | 上游有 CDN（比如 Cloudflare 小黄云）把 Host 改掉了 | 确认 CDN 是**原样透传 Host**，不是改成源站 IP |

> 💡 **一个 30 秒自检**：外贸站会给响应加 `x-site-slug` 头，门户不会。
> 所以「这个域名到底进了哪个容器」一问便知：
>
> ```bash
> curl -sI https://shangbangbang.com | grep -i x-site-slug
> # 没有输出 = 走的是门户 ✅
> # 输出 x-site-slug: xxx = 走的是外贸站 ❌（配错了）
> ```
>
> ⚠️ `x-site-slug` 这个响应头来自**外贸站的中间件**（`apps/foreign-site/middleware.ts`）。
> 有两点要知道：一是门户是纯静态页面、**没有中间件**，所以门户永远没有这个头；
> 二是中间件的 matcher 排除了 `/admin`、`/api`、`/_next` 和带点的路径，
> 所以**在后台页面或接口上是看不到这个头的** —— 自检请用站点首页
> （`curl -sI https://客户名.shangbangbang.com/`）。

### 9.8 门户提交留资失败（500）或线索没落盘

**症状**：门户页面能打开，但填完留资表单提交时报错；或者提交「显示成功」，
可是 `leads.jsonl` 里没有新记录。

**先看门户日志**（代码里每条线索都会打一行 `[LEAD]`）：

```bash
cd /srv/shangbangbang/deploy

# 1) 看有没有 [LEAD] 日志。有 = 请求进来了；没有 = 请求压根没到应用（看 Caddy 日志）
docker compose logs --tail=100 portal | grep -E "\[LEAD\]|error|EACCES|ENOENT"

# 2) 卷挂上了吗？目录属主对吗？
docker compose exec portal ls -ld /app/data
# 应该是 nextjs 所有、可写

# 3) 卷里到底有没有文件
docker run --rm -v deploy_portal_data:/data alpine ls -la /data
```

**常见原因**：

| 现象 | 原因 | 修法 |
|---|---|---|
| 日志里有 `[LEAD]`，但 `[LEAD] 落盘失败` | `/app/data` 写不进去（属主不对或卷没挂上） | 见下 |
| `docker compose exec portal ls -ld /app/data` 显示 root 所有 | 卷是先被 root 创建的，没继承镜像里 `chown nextjs` 的设置 | `docker compose exec -u root portal chown -R nextjs:nodejs /app/data`，然后 `docker compose restart portal` |
| 卷是空的，但之前有线索 | 执行过 `docker compose down -v` | 从备份恢复，见 [8.8](#88-门户的留资线索leadsjsonl备份必看) |
| 日志里连 `[LEAD]` 都没有 | 请求没到应用：域名走错了容器，或者门户容器没起来 | 先看 [9.7](#97--门户和外贸站搞混了根域名打开成了外贸站)，再看 `docker compose ps` |
| 表单提示「请求格式不正确」 | 前端发的字段名和接口要求的不一致（接口要求 `name` / `contact` / `interest`） | 这是**改代码**的范畴，不属于部署问题 |
| webhook 没收到消息 | `.env` 填了 `LEAD_WEBHOOK_URL`，但 compose 里那行还注释着 | 把 `docker-compose.yml` 里 `# LEAD_WEBHOOK_URL: ...` 的注释去掉，再 `docker compose up -d portal` |

> ⚠️ **先认清一件事**：落盘（leads.jsonl）是**临时方案**，
> 它失败时接口**仍然会返回成功**（代码里落盘是 try/catch 包住的，
> 「不影响本次提交」）—— 也就是说**你可能会在不知情的情况下丢线索**。
> 所以：要么尽快按 [8.8](#88-门户的留资线索leadsjsonl备份必看) 配上
> `LEAD_WEBHOOK_URL`，要么定期人工检查卷里有没有新数据。

---

## 上线安全清单（照着打勾）

- [ ] **`PAYLOAD_SECRET` 换成了随机长字符串**（不是代码里那个 `dev-only-...`）
- [ ] **`POSTGRES_PASSWORD` 换成了随机强密码**，不是 `CHANGE_ME...`
- [ ] **后台管理员密码换成了强密码**，不是演示密码 `Shangbang2026!`
- [ ] **演示数据已清理**（虚构工厂「恒信精密工具 / HX TOOLS」的内容不能给真实客户看）
- [ ] **数据库没有暴露公网端口**：`docker-compose.yml` 的 `db` 服务里没有 `ports`
- [ ] **site 和 portal 都没有暴露公网端口**：只有 `caddy` 有 `ports: 80/443`
- [ ] **服务器防火墙**：只放行 22 / 80 / 443
- [ ] **`.env` 权限 600**，且没有提交到 git（`git status` 里看不到它）
- [ ] **每日自动备份已配好**，并且**演练过一次恢复**
- [ ] **备份不在同一台服务器上**（至少同步到对象存储或另一台机器）
- [ ] **Caddy 的 `caddy_data` 卷已持久化**（否则重启就重新签证书，很快被 CA 限流）
- [ ] **Docker 日志上限已配**（`max-size: 10m`），避免磁盘写满
- [ ] **PostgreSQL 与依赖镜像定期更新**（`docker compose pull db` 后重启）

---

## 这个版本已知的坑（心里有数就行）

部署时遇到下面这些**不是你把服务器配错了**，是代码/架构本身的待办：

| # | 现象 | 说明 |
|---|---|---|
| 1 | 客户绑自己的域名，打开的却是默认站点 | 「域名 → 站点标识」的映射表（`lib/domains.generated.json`）**是有的**，但它**在构建前生成**。所以：后台加完「绑定域名」之后**必须重新构建**（`docker compose build site`），而且这次构建的 `DATABASE_URL` 得是能连上库的真实值，否则表是空的 → 域名认不出来 → 回退到默认站点。详见[第 7.0 节](#70--先选这个客户的站点用哪个域名) |
| 2 | 后台改了内容，前台有时不变 | 前台页面是按「构建时拿到的数据」预渲染的。改完内容要 `docker compose build site && docker compose up -d`；长期方案是加 `revalidate` 做定时刷新（`README.md` 里也提到这点） |
| 3 | 新增客户后，新客户页面第一次访问慢 | 新站点不在构建时的站点列表里，是第一次访问时按需生成的。重新构建一次即可 |
| 4 | 客户要多语言 | 现在只开了英文。`payload.config.ts` 里加语种即可，但前台 URL 结构要一起改 |
| 5 | 询盘没有邮件/微信通知 | 外贸站现在只写控制台和后台列表 |
| 6 | `payload migrate:create` 到底会不会按预期生成迁移文件 | 本项目**还没有真正跑过一次**迁移（`migrations/` 目录都还不存在），所以这条链路属于「纸面流程」。第一次执行时**请以 Payload 官方文档为准**，生成的文件要人工看一眼 |
| 7 | 数据库是空的时候，`/admin` 能不能自助创建第一个管理员 | 这依赖 Payload 的初始化逻辑。如果它不让建，就用 `seed.ts` 建一个（见 5.6），或者手工往 `users` 表插一条 —— 别在这一步卡住心态。⚠️ 注意 `/admin` 要从**子域名**进（见 5.4.1） |
| 8 | **门户的留资线索只写容器里的文件** | `/api/lead` 把线索追加写到 `/app/data/leads.jsonl`（挂了具名卷 `portal_data`，重建容器不丢）。但：**没人会收到提醒**、**得手动备份**、**用 SQL/后台都查不了**。代码里已支持 `LEAD_WEBHOOK_URL`（填上就转发），正式做法应改成写库或 webhook。见 [8.8](#88-门户的留资线索leadsjsonl备份必看) |
| 9 | 留资落盘失败时**接口照样返回成功** | 代码里落盘是 try/catch 包住的（「不影响本次提交」），所以**可能会在不知情的情况下丢线索**。只靠日志里那行 `[LEAD] 落盘失败` 才能发现。见 [9.8](#98-门户提交留资失败500或线索没落盘) |
| 10 | 门户和外贸站共用一台机器、一个 Caddy | 两个站点块的域名**绝对不能重叠**（根域名归门户，子域名归外贸站）。重叠时 Caddy 会**直接报错起不来**，排查见 Caddyfile 顶部「域名撞车怎么查」和 [9.7](#97--门户和外贸站搞混了根域名打开成了外贸站) |

> 第 1 条有用户可见影响（客户会以为网站做坏了），**建议优先做掉**。
> 第 6、7 条是「第一次上线时必须现场确认」的两件事，**提前一天在测试机上走一遍**最稳。
> 第 8、9 条是**门户侧数据安全的隐患**，正式对外收线索之前务必处理掉。

---

## 附：常用命令速查

```bash
cd /srv/shangbangbang/deploy

docker compose ps                       # 看状态（应该有 4 个服务）
docker compose logs -f site             # 看外贸站日志
docker compose logs -f portal           # 看门户日志（留资线索是 [LEAD] 开头）
docker compose up -d                    # 起/更新
docker compose build site               # 只重新构建外贸站镜像
docker compose build portal             # 只重新构建门户镜像
docker compose up -d --build            # 构建并替换（等于 build + up，两个应用都动）
docker compose restart caddy            # 改完 Caddyfile 重启反代
docker compose exec site sh             # 进外贸站容器
docker compose exec portal sh           # 进门户容器
docker compose exec db psql -U sbb_app -d shangbangbang   # 进数据库

# 手动跑迁移（外贸站专有）
docker compose exec site sh -c "cd /app/full && node node_modules/payload/bin.js migrate"

# 备份数据库
docker compose exec -T db pg_dump -U sbb_app -d shangbangbang -F c > /srv/backups/db-$(date +%F-%H%M).dump

# 看一眼门户的留资线索（最后 20 条）
docker run --rm -v deploy_portal_data:/data alpine tail -20 /data/leads.jsonl
```

> ⚠️ 上面几条命令里的卷名、库名、用户名都要按你 `.env` 里的实际值来
> （`deploy_portal_data` / `sbb_app` / `shangbangbang` 只是 `.env.example` 的默认值）。
> 卷名不确定就先 `docker volume ls`。

---

## 附：两个应用的对照速查

给已经熟悉这套东西的人看的。**改错了应用是这个部署方式最容易犯的错**。

| | 门户 | 外贸站 |
|---|---|---|
| 目录 | `apps/portal` | `apps/foreign-site` |
| compose 服务名 | `portal` | `site` |
| 容器名 | `sbb-portal` | `sbb-site` |
| 镜像 | `shangbangbang/portal:${PORTAL_IMAGE_TAG}` | `shangbangbang/foreign-site:${SITE_IMAGE_TAG}` |
| Dockerfile | `apps/portal/Dockerfile` | `apps/foreign-site/Dockerfile` |
| 启动脚本 | 无（直接 `node server.js`） | `entrypoint.sh`（可选先跑迁移） |
| 技术栈 | Next.js 15.5.x + Tailwind v4 | Next.js 15.4.11 + Payload 3.90.2 + PostgreSQL 16 |
| 域名 | `{$PORTAL_DOMAIN}`、`www.{$PORTAL_DOMAIN}` | `*.{$ROOT_DOMAIN}`、客户自定义域名 |
| Caddy 片段 | `portal_common` + `proxy_to_portal` | `site_common` + `proxy_to_site` |
| 目标端口 | 容器内 3000 | 容器内 3000 |
| 要数据库吗 | 不要 | 要（`db` 服务） |
| 要跑迁移吗 | 不要 | 要（`RUN_MIGRATIONS` / 手动） |
| 数据卷 | `portal_data` → `/app/data`（留资线索） | `media` → `/app/public/media`、`pgdata`（数据库） |
| 构建期变量 | `PORTAL_SITE_URL`（内联进页面） | `NEXT_PUBLIC_ROOT_DOMAIN`、`DEFAULT_SITE`、`DATABASE_URL` |
| 运行时变量 | （选填）`LEAD_WEBHOOK_URL` | `DATABASE_URL`、`PAYLOAD_SECRET`、`NEXT_PUBLIC_ROOT_DOMAIN`、`DEFAULT_SITE`、`RUN_MIGRATIONS` |
| 后台 | **没有** | `/admin`（从子域名访问） |
| 健康检查 | `wget http://127.0.0.1:3000/` | `wget http://127.0.0.1:3000/` |
| 对外暴露端口 | 无 | 无 |

> ⚠️ **两个应用的 3000 端口不冲突**，因为它们在各自的容器里。
> 只有 `caddy` 有 `ports`。

---

**最后一句**：这套东西第一次部署大概要花半天到一天（主要是等 DNS、踩证书的坑）。
但**只有第一次**。以后加客户就是「DNS 不用动 + 后台点几下 + 重新构建一次」，
这才是「一套系统服务 N 个客户」的意义。
