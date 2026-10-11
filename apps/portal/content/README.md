# 改内容看这里

## 一条规则

> **改内容 = 只打开 `content/` 目录。**
> `app/` 和 `components/` 是页面骨架，一般不用动。

---

## 我想改什么 → 打开哪个文件

| 我想改… | 打开 | 找什么 |
|---|---|---|
| 公司全称、电话、邮箱、备案号 | `content/site.ts` | `companyName` `phone` `email` `icp` |
| 网站主标题「工厂做外贸，商铺做私域」 | `content/site.ts` | `tagline` |
| 网站介绍、分享给微信时的描述 | `content/site.ts` | `description` |
| 品牌口号「你懂生意，技术交给我们」 | `content/site.ts` | `slogan` |
| 首页信任条三格 | `content/site.ts` | `stats` |
| 按钮文字（免费获取方案…） | `content/site.ts` | `CTA` |
| **产品（加/删/改）** | `content/products.ts` | `products` 数组 |
| 解决方案（我是外贸工厂…） | `content/solutions.ts` | `solutions` 数组 |
| **价格档位** | `content/pricing.ts` | `websiteTiers` `miniappTiers` |
| 交付流程六步 | `content/pricing.ts` | `processSteps` |
| 价格页底部小字 | `content/pricing.ts` | `priceNotes` |
| **客户案例** | `content/cases.ts` | `cases` 数组 |
| 常见问题 8 条 | `content/faqs.ts` | `faqs` 数组 |
| 首页所有文案（痛点、对比表…） | `content/pages/home.ts` | |
| 关于我们（含你要写的故事） | `content/pages/about.ts` | |
| 联系我们 | `content/pages/contact.ts` | |
| 价格页文案 | `content/pages/pricing.ts` | |
| 留资表单的提示文字 | `content/leadForm.ts` | |
| 隐私政策 / 服务条款 | `content/pages/legal.ts` | |

---

## 最常见的四件事（照着做就行）

### 1️⃣ 加一个新产品

1. 打开 `content/products.ts`
2. 复制一整块已有产品（从 `{` 到 `},`）
3. 改这几个字段：
   - `slug` —— 英文小写、用减号连接、**不能和已有的重复**（它是网址的一部分）
   - `name` `emoji` `tagline` `summary`
   - `order` —— 决定排序位置
4. 保存

**产品列表、详情页、顶部导航、页脚、sitemap 全部自动更新。你不用碰任何页面文件。**

### 2️⃣ 改价格

打开 `content/pricing.ts`，把

```ts
price: PRICE_TBD,
```

改成

```ts
price: "6,800",
```

`unit` 是 `"/年"`，一般不用动。三个档位是 `体验版 / 标准版 / 品牌版`。

### 3️⃣ 把样板案例换成真实案例

1. 打开 `content/cases.ts`
2. 改 `client`（客户名）、`metrics`（真实数据）、`problem` `solution`
3. ⚠️ **把 `isSample: true` 改成 `false`**

第 3 步最容易忘。不改的话，页面上会一直标着「样板案例」，而且内容检查也会一直报它。

### 4️⃣ 上传微信二维码

1. 把图片放到 `public/images/wechat-qr.png`
2. 打开 `app/contact/page.tsx`，按里面的注释把那块占位符换掉

> 这是**唯一**需要动 `content/` 以外的地方——因为图片不是文字。

---

## 怎么知道还有哪里没填？

两个地方都会告诉你：

| 什么时候 | 你会看到 |
|---|---|
| `npm run dev` 打开网站 | 左下角一个黄色提示条，点开是待办清单 |
| `npm run build` | 终端里打印一份完整清单 |

两处用的是同一套校验，代码在 `lib/validate.ts`（一般不用改）。

**判定规则**：内容里出现 `待填写`、`待补充`、`待上传`、`待替换`、`待定` 或 `【` 这几个字眼，就会被列为待办。所以你把它们改掉，提示就消失了。

---

## 几个「开关」

有些内容写完需要手动翻一个开关，告诉网站「这个不是草稿了」：

| 文件 | 开关 | 改成 | 效果 |
|---|---|---|---|
| `content/pages/about.ts` | `why.draftMode` | `false` | 显示你写的故事，隐藏提示块 |
| `content/pages/about.ts` | `team.draftMode` | `false` | 同上 |
| `content/pages/legal.ts` | `privacy.reviewed` | `true` | 隐藏「本文为初稿」的黄色警告 |
| `content/pages/legal.ts` | `terms.reviewed` | `true` | 同上 |
| `content/cases.ts` | 每个案例的 `isSample` | `false` | 去掉「样板案例」标签 |

> 法律文本的 `reviewed` **必须等专业顾问审核通过后再改**。

---

## 为什么这么设计

`content/` 里只有数据，页面只负责把它画出来。

好处有两个：

1. **加产品不用改代码** —— 以后上 20 个产品，也只是在数组里加 20 条
2. **以后接后台管理时，这一层数据结构可以原样搬过去** —— 也就是说，这里现在定义的字段，就是你将来那个 SaaS 后台的表单字段

## 一个已经帮你避免的坑：同一件事只写一遍

有些内容本来很容易被存两遍，已经改成「只写一处」：

| 内容 | 只写在哪 | 其他地方怎么来的 |
|---|---|---|
| 产品名、产品价格 | `content/products.ts` | 价格页的「增值与配套」表格、留资表单的下拉选项，都自动从产品列表生成 |
| 交付流程六步 | `content/pricing.ts` | 首页和关于我们页共用同一份 |
| 常见问题 | `content/faqs.ts` | 首页显示前 6 条，FAQ 页显示全部 |
| 品牌口号、主标题 | `content/site.ts` | 页脚、关于我们页分别引用 |

所以**改一次就够了，不会出现两个地方不一致**。

---

## 目录速览

```
content/
├─ README.md          ← 你正在看的这份
├─ site.ts            ← 站点设置（公司信息、电话、按钮文字）
├─ products.ts        ← 产品
├─ solutions.ts       ← 解决方案
├─ pricing.ts         ← 价格与交付流程
├─ cases.ts           ← 客户案例
├─ faqs.ts            ← 常见问题
├─ leadForm.ts        ← 留资表单的提示文字
└─ pages/
   ├─ home.ts         ← 首页文案
   ├─ about.ts        ← 关于我们
   ├─ contact.ts      ← 联系我们
   ├─ pricing.ts      ← 价格页文案
   └─ legal.ts        ← 隐私政策 / 服务条款
```
