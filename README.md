# 商帮帮

面向**外贸工厂**和**本地商铺**的线上生意工具供应商。

> **工厂做外贸，商铺做私域。**
> 你懂生意，技术交给我们。

---

## 目录结构

```
shangbangbang_newwork/
├─ docs/                      ← 研究与方案文档（先看这里）
│  ├─ 01-项目定位与产品线讨论稿.md
│  ├─ 02-门户网站方案-v0.1.md
│  ├─ 03-关键路径与总路线图-v0.1.md
│  ├─ 04-门户全站文案草稿-v0.1.md
│  └─ 05-证照与合规办理清单.md
└─ apps/
   ├─ portal/                 ← 门户网站（Next.js）
      ├─ content/             ← ⭐ 所有内容都在这里（改内容只看这个目录）
      │  ├─ README.md         ← 「改哪里」对照表，先看这份
      │  ├─ site.ts           ← 站点设置
      │  ├─ products.ts       ← 产品
      │  ├─ solutions.ts      ← 解决方案
      │  ├─ pricing.ts        ← 价格与交付流程
      │  ├─ cases.ts          ← 客户案例
      │  ├─ faqs.ts           ← 常见问题
      │  ├─ leadForm.ts       ← 留资表单文案
      │  └─ pages/            ← 各页面文案
      ├─ app/                 ← 页面骨架（一般不用动）
      ├─ components/          ← 组件（一般不用动）
      ├─ lib/                 ← 内容校验等代码
      └─ public/images/       ← 图片素材（微信二维码等）
   └─ foreign-site/           ← 外贸站样板（模板，虚构的工厂）
      ├─ lib/cms.ts           ← ⭐ 数据访问层（将来换成读 Payload，页面不用改）
      ├─ lib/sample/          ← 模拟数据（将来换成人后台的数据）
      ├─ components/          ← 前台组件
      └─ app/                 ← 首页 / 产品 / 工厂实力 / 质量 / 联系
```

---

## 门户网站

### 技术栈

- **Next.js 15**（App Router）— 静态生成，SEO 友好
- **TypeScript**
- **Tailwind CSS v4**

选这套的唯一理由：**门户的技术栈必须和后面的通用版外贸站一致**，
否则门户做完等于白做一遍。组件与数据结构以后可以直接复用。

### 本地运行

```bash
cd apps/portal
npm install          # 首次
npm run dev          # 开发模式 → http://localhost:3000
npm run build        # 生产构建
npm run start        # 启动生产服务
```

### 页面清单（已全部实现）

| 路由 | 页面 |
|---|---|
| `/` | 首页（11 屏） |
| `/products` | 产品总览 |
| `/products/[slug]` | 产品详情（模板渲染，7 个产品） |
| `/solutions` | 解决方案总览 |
| `/solutions/[slug]` | 解决方案详情（4 类客户） |
| `/cases` | 客户案例 |
| `/pricing` | 价格 |
| `/faq` | 常见问题 |
| `/about` | 关于我们 |
| `/contact` | 联系我们（留资表单） |
| `/privacy` `/terms` | 隐私政策 / 服务条款 |
| `/api/lead` | 留资提交接口 |
| `/sitemap.xml` `/robots.txt` | SEO |

### ⭐ 改内容只看 `content/` 目录

**一条规则：改内容 = 只打开 `content/` 目录。** 完整「改哪里」对照表见
[`apps/portal/content/README.md`](apps/portal/content/README.md)。

加一个新产品 = 在 `content/products.ts` 里加一条数据。
产品列表、详情页、导航、页脚、留资表单下拉、sitemap **全部自动更新**，不用改任何页面代码。

这就是后面通用版外贸站的雏形。

### 内容检查：不用自己记着哪里还没填

| 什么时候 | 你会看到 |
|---|---|
| `npm run dev` | 页面左下角一个黄色提示条，点开是待办清单 |
| `npm run build` | 终端打印完整清单 |

校验逻辑在 [`apps/portal/lib/validate.ts`](apps/portal/lib/validate.ts)。

---

## ⚠️ 上线前必须替换的占位内容

站点信息集中在 [`apps/portal/content/site.ts`](apps/portal/content/site.ts)：

| 占位项 | 说明 |
|---|---|
| `companyName` | 公司全称（执照下来后填） |
| `icp` / `police` | ICP 备案号 / 公安联网备案号 |
| `phone` / `email` | 联系电话与邮箱 |

**其他待补（打开网站看左下角提示条，会全部列出来）：**

1. **价格** — `content/pricing.ts` 里全是「价格待定」，需老板拍板
2. **微信二维码** — 放到 `public/images/wechat-qr.png`，替换方式见该目录 README
3. **关于我们的创业故事** — `content/pages/about.ts`，写好后把 `draftMode` 改成 `false`
4. **真实案例** — `content/cases.ts`，现在标着「样板案例」；有真实客户后把 `isSample` 改成 `false`
5. **隐私政策 / 服务条款** — 现在是初稿，**必须经专业顾问审核**后才能把 `reviewed` 改成 `true`

### 留资接口

`app/api/lead/route.ts` 当前：控制台日志 + 落盘 `data/leads.jsonl`。

上线前**必须**换成可靠通道，任选其一：

1. 写入数据库（推荐，后续做多租户 SaaS 时顺手就有）
2. 配置 `LEAD_WEBHOOK_URL` 环境变量，转发到企业微信机器人 / 飞书（代码已支持）
3. 邮件服务 API

> ⚠️ 部署到 Serverless 平台时本地文件不持久，必须换方案。

---

## 上线前置条件（证照）

**公司主体是总闸门。** 没有它，备案、商标、小程序、微信支付全部动不了。

```
公司注册 → 域名过户到公司 → 内地服务器 → ICP 备案 → 上线
```

**但开发不等证照** —— 门户可以现在开发、本地预览，备案通过直接上线。

详细清单见 [`docs/05-证照与合规办理清单.md`](docs/05-证照与合规办理清单.md)。

---

## 已知待办

- [ ] 注册有限责任公司
- [ ] 商标检索 + 提交 35 类 / 42 类申请
- [ ] `shangbangbang.com` 过户到公司名下
- [ ] 购买内地服务器（包年包月 > 3 个月）
- [ ] 提交 ICP 备案
- [ ] 替换全部占位内容
- [ ] 拍摄 / 整理真实产品截图替换首屏 CSS 示意图
- [ ] 留资接入可靠通道（数据库或 webhook）
- [ ] 第二期：通用版外贸网站（多租户 + 后台）
- [ ] 第三期：门店小程序通用版
