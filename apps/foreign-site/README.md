# 外贸站 —— 前台 + 后台

> ⚠️ 站点内容是一家**虚构的**工厂（恒信精密工具 / HX TOOLS），仅用于演示。
> 后台是**真的**：Payload CMS，能登录、能增删改查、改了前台立刻变。

---

## 启动

```bash
cd apps/foreign-site
npm install
npm run dev
```

| 地址 | 是什么 |
|---|---|
| http://localhost:3000/admin | **后台管理（中文）** |
| http://hengxin-tools.localhost:3000 | 客户一：恒信精密工具（五金工具，内容完整） |
| http://ruitai-machinery.localhost:3000 | 客户二：瑞泰包装机械（包装机械，内容完整） |
| http://acme-tools.localhost:3000 | 客户三：Acme Tools（**刚开通的空白站**，用来对比"开站时长什么样"） |

> 💡 **多租户就是靠域名区分的。** 现在有两个演示客户，用不同子域名访问会看到完全不同的网站。
> （`*.localhost` 浏览器会自动解析到 127.0.0.1，不用改 hosts 文件。）
>
> 如果 3000 端口被别的项目占用（比如门户的 dev server），Next.js 会自动换到
> **3001**。启动时终端会打印实际地址，照着那个打开即可。

### 后台账号

```
账号：admin@shangbangbang.com
密码：Shangbang2026!
```

> ⚠️ 这是本地开发账号。上线前必须改成复杂密码，并把 `PAYLOAD_SECRET` 换成随机长字符串。

---

## 数据库

本地用 **SQLite**（零配置，就是一个 `payload.db` 文件）。

重新灌一遍示例数据：

```bash
npx payload run seed.ts
```

正式部署换成 **Postgres**，只需改 `payload.config.ts` 里的一行：

```ts
import { postgresAdapter } from "@payloadcms/db-postgres";
db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL } }),
```

---

## 后台有什么

登录后左侧是这些菜单：

| 分组 | 内容 |
|---|---|
| **系统** | 站点（客户）、后台账号 |
| **内容** | 产品、产品分类、认证资质、媒体库、站点设置 |
| **询盘** | 询盘（含跟进状态、跟进记录） |

### 几个可以直接试的操作

1. **改一个产品** → 前台产品页立刻变（已实测）
2. **右上角切换站点** → 这是多租户，你以后管 N 个客户就在这里切
3. **上传一张图到媒体库** → 设成某个产品的产品图，前台就显示真图（没上传时是斜纹占位块）
4. **把产品的「首页推荐」勾上** → 它会出现在首页的 Best Sellers
5. **改「站点设置」里的数据条** → 首页顶部那四个数字跟着变

---

## 新增一个客户站点（开站）

一条命令：

```powershell
# PowerShell
$env:SITE_SLUG="acme-tools"; $env:SITE_NAME="Acme Tools Co., Ltd."
$env:SITE_BRAND="ACME"; $env:SITE_DOMAIN="acmetools.com"
npm run new-site
```

```bash
# bash / macOS / Linux / Docker
SITE_SLUG=acme-tools SITE_NAME="Acme Tools Co., Ltd." \
SITE_BRAND=ACME SITE_DOMAIN=acmetools.com npm run new-site
```

它自动做四件事：建站点记录 → 建站点设置骨架 → 重新生成域名映射 → 打印接下来的操作清单。

> ⚠️ **参数为什么走环境变量而不是 `--xxx`：**
> Payload 的 `payload run` 不会把命令行参数透传给脚本（`process.argv` 里只有 node 和 payload 入口）。
> 试了半天才确认，不是写法问题。
>
> 在**真终端**里直接 `npm run new-site` 也可以，它会逐步提问。

建完之后新站点会是这样：**能打开、能看，但内容是「待填写」**。
登录后台把产品、分类、认证、站点设置填上，就是客户看到的样子了。

**最后一定要 `npm run build`** —— 客户站点是静态生成的，不重新构建看不到新站点。

---

## 客户自定义域名

客户不想用 `客户名.shangbangbang.com`，要绑自己的 `factory-a.com`：

1. 后台 → 站点 → 域名与状态 → 加一条 `factory-a.com`
2. 跑 `npm run domains`（重新生成域名映射表）
3. 重新构建 `npm run build`
4. 客户把域名 A 记录解析到你的服务器（这一步在客户那边）
5. 按 `deploy/Caddyfile` 第 4 段，给这个域名加一段反代配置

**为什么需要「域名映射表」这个步骤**：中间件跑在 Edge 运行时，**不能查数据库**。
而 `factory-a.com` 这个名字看不出对应哪个站点，所以必须有一张构建前生成好的表
（`lib/domains.generated.json`）。`npm run dev` 和 `npm run build` 之前会**自动**跑一次。

已支持：`factory-a.com`、`www.factory-a.com`、`客户名.shangbangbang.com`、`www.客户名.shangbangbang.com`。

---

## 架构：一套系统服务 N 个客户

```
  hengxin-tools.shangbangbang.com  ┐
  ruitai-machinery.shangbangbang.com ├→ 同一个 Next.js 应用 → 同一个数据库
  客户自己的域名（factory-a.com）    ┘   （按 tenant 字段隔离数据）
```

### 域名是怎么变成站点的

```
访客访问   hengxin-tools.shangbangbang.com/products
              ↓  middleware.ts 读 Host，算出站点标识 = hengxin-tools
内部重写   /hengxin-tools/products
              ↓  路由 app/(frontend)/[site]/...
渲染       恒信精密工具的页面（数据只查 tenant=1）
```

**关键点：访客看到的网址是干净的（没有 /hengxin-tools 这一段）。**
重写只发生在服务器内部。

**而且每个客户站点是静态生成的** —— 构建时 `generateStaticParams` 列出所有租户，
每个租户一套 HTML。这样 SEO 和速度都好，不需要每次请求都查数据库。

> ⚠️ 代价：**新增客户后需要重新构建**才能看到新站点的静态页面。
> 以后的优化方向是按需重新验证（on-demand revalidation），那时加客户就能即时生效。

### 隔离靠三层

| 层 | 做什么 |
|---|---|
| **中间件** | 从域名算出站点标识（`lib/tenant.ts`，纯函数，不查库） |
| **数据访问层** | 每个查询强制带 `tenant` 过滤（`lib/cms.ts`） |
| **Payload 插件** | `@payloadcms/plugin-multi-tenant` 给每个集合加 `tenant` 字段 + 后台站点切换器 |

**权限**：`super-admin`（你）看所有客户；`tenant-admin`（客户老板）只看自己被分配的站点。

**多语言**：字段已标记 `localized`，目前只开英文（`payload.config.ts` 里加一条就开小语种）。

### 目录

```
apps/foreign-site/
├─ middleware.ts              ← ⭐ 按域名把请求分发到对应客户站点
├─ payload.config.ts          ← 后台总配置（集合、数据库、插件）
├─ payload/
│  ├─ access.ts               ← 权限规则
│  └─ collections/            ← ⭐ 后台的表单定义，都在这
│     ├─ Tenants.ts           站点（客户）
│     ├─ Users.ts             后台账号
│     ├─ Products.ts          产品
│     ├─ Categories.ts        产品分类
│     ├─ Certificates.ts      认证资质
│     ├─ Inquiries.ts         询盘
│     ├─ SiteSettings.ts      站点设置（首屏要点/数据条/生产能力/FAQ）
│     └─ Media.ts             媒体库
├─ seed.ts                    ← 示例数据（两个客户站点）
├─ app/
│  ├─ (frontend)/[site]/      ← 前台页面，[site] 是站点标识
│  └─ (payload)/              ← 后台界面（Payload 官方样板，不用改）
├─ lib/
│  ├─ tenant.ts               ← ⭐ 从域名算出站点标识
│  ├─ cms.ts                  ← ⭐ 数据访问层（前台只通过它读数据）
│  ├─ types.ts                ← 领域类型
│  └─ sample/                 ← 只给 seed 用的原始数据
└─ payload.db                 ← SQLite 数据库文件（已 gitignore）
```

---

## 一个设计上值得说的点

`lib/cms.ts` 里的函数**从第一天就是 async 的**，当时读的是本地模拟数据：

```ts
export async function getProducts(categorySlug?: string) { ... }
```

现在换成真的从 Payload 读，**页面代码一行都没改**。

这就是为什么值得一开始多写那几个 `async`。

---

## 已验证（都是真跑过的，不是"应该能"）

| 项 | 结果 |
|---|---|
| 生产构建 | ✅ 36 个页面静态生成（3 个客户站点），无类型错误 |
| 三个客户站点渲染 | ✅ 标题、大标题、产品、认证全部各是各的 |
| **数据隔离（双向）** | ✅ 站点之间内容不串 |
| **跨租户访问产品** | ✅ 返回 404（拿别家的产品网址打不开） |
| **询盘归属** | ✅ 从哪个站点提交就进哪个客户 |
| **客户自定义域名** | ✅ `hx-tools-example.com` 和 `www.` 版本都正确指向对应客户 |
| **开站脚本** | ✅ 一条命令建出站点三，域名、内容骨架、映射表全部就位 |
| 新站点不含别家内容 | ✅ 只有自己的品牌和「待填写」占位 |
| 后台 `/admin` | ✅ 中文界面可登录，有站点切换器 |
| 后台改 → 前台变 | ✅ 闭环打通 |

---

## 现在还没做的（下一步）

| 缺什么 | 说明 | 优先级 |
|---|---|---|
| **部署到海外服务器** | Dockerfile / docker-compose / Caddyfile 已备好，见 `deploy/README.md`。**没实测过**（本机没跑 Docker） | 高 |
| **生产用 Postgres** | 现在本地是 SQLite，生产要换 Postgres（改一行适配器） | 高 |
| **开站点点鼠标版** | 现在是命令行脚本。以后做成后台里一个「新建站点」向导页 | 中 |
| **邮件/微信通知** | 现在新询盘只写控制台 | 中 |
| **首页区块编排** | 现在首页区块顺序写在代码里；以后做成后台可拖的 Blocks | 中 |
| **图片上传进前台** | 管道已通（`Photo` 支持 `src`），但还没有真实图片素材 | 中 |
| **新增客户即时生效** | 现在要重新构建；以后用按需重新验证就不用了 | 中 |
| **SEO 体检** | 告诉客户「哪几个产品没写描述、哪几张图没填 ALT」 | 低 |

---

## ⚠️ 三个已知风险

1. **反代必须传 `X-Forwarded-Host`，否则所有域名会打开同一个站。**
   这是**只在生产环境才会踩、开发时完全看不出来**的坑：

   > Next.js 的 dev 服务器会把客户端 `Host` 头原样传给中间件；
   > 但 **production（`next start` / standalone）会把 Host 覆盖成自己的监听地址**
   > （比如 `localhost:3000`）。中间件于是拿不到访客真正访问的域名，
   > 结果**所有客户域名都落到默认站点**。

   代码已经处理：`lib/tenant.ts` 的 `hostFromHeaders()` **优先读 `x-forwarded-host`**。
   所以反代（Caddy / Nginx / 任何 CDN）必须带上这个头。Caddy 配置里已经显式写了。

   **排查用这两个响应头**：

   ```bash
   curl -sI https://客户域名/ | grep x-site
   # x-site-host: 中间件实际拿到的域名
   # x-site-slug: 解析出来的站点标识
   ```
   Host 对、slug 不对 → 域名映射表没生成或没重新构建。

2. **陌生域名会显示默认站点**。无法识别的域名回退到 `DEFAULT_SITE`。
   部署时建议按 `deploy/Caddyfile` 里的说明加一个兜底响应。

3. **删客户站点前必须先解除账号关联**。用户表里的 `tenants` 数组引用了站点，
   直接删会撞外键约束（`seed.ts` 里已处理）。
