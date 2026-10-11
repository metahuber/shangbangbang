/**
 * 开站脚本 —— 新增一个客户站点
 *
 * ⚠️ 为什么用「环境变量」而不是命令行参数：
 *    Payload 的 `payload run` 不会把 --xxx 参数透传给脚本（process.argv 里
 *    只有 node 和 payload 的入口）。所以参数一律走环境变量。
 *
 * 用法（PowerShell）：
 *   $env:SITE_SLUG="acme-tools"; $env:SITE_NAME="Acme Tools Co., Ltd."
 *   $env:SITE_BRAND="ACME"; $env:SITE_DOMAIN="acmetools.com"
 *   npm run new-site
 *
 * 用法（bash / macOS / Linux / Docker）：
 *   SITE_SLUG=acme-tools SITE_NAME="Acme Tools Co., Ltd." \
 *   SITE_BRAND=ACME SITE_DOMAIN=acmetools.com npm run new-site
 *
 * 用法（什么都不给，在真终端里跑）：会逐步提问
 *
 * 它做四件事：
 *   1. 校验站点标识（格式 + 是否重名）
 *   2. 建站点记录（域名、品牌、联系方式）
 *   3. 建一份「站点设置」骨架，并在后台留下明显的「待填写」提示
 *   4. 重新生成域名映射表，打印接下来的操作清单
 *
 * ⚠️ 它**不会**替你编产品内容 —— 那些必须用客户真实的资料。
 */

import readline from "node:readline/promises";
import { getPayload } from "payload";
import config from "../payload.config";
import { writeDomainMap, ROOT_DOMAIN } from "./lib/domain-map";

const env = (k: string): string | undefined => {
  const v = process.env[k];
  return v && v.trim() ? v.trim() : undefined;
};

let slug = env("SITE_SLUG");
let name = env("SITE_NAME");
let brand = env("SITE_BRAND");
let tagline = env("SITE_TAGLINE");
let email = env("SITE_EMAIL");
let phone = env("SITE_PHONE");
let whatsapp = env("SITE_WHATSAPP");
let founded = env("SITE_FOUNDED");
let domain = env("SITE_DOMAIN");

const USAGE = `
新建客户站点

  ⚠️ 参数走环境变量（payload run 不透传命令行参数）

  PowerShell:
    $env:SITE_SLUG="acme-tools"; $env:SITE_NAME="Acme Tools Co., Ltd."
    $env:SITE_BRAND="ACME"; $env:SITE_DOMAIN="acmetools.com"
    npm run new-site

  bash:
    SITE_SLUG=acme-tools SITE_NAME="Acme Tools Co., Ltd." \\
    SITE_BRAND=ACME SITE_DOMAIN=acmetools.com npm run new-site

  环境变量清单：
    SITE_SLUG      必填  站点标识，英文小写 + 减号，例如 acme-tools
    SITE_NAME      必填  公司全称
    SITE_BRAND     选填  品牌短名，不填用公司全称
    SITE_TAGLINE   选填  首屏大标题
    SITE_DOMAIN    选填  客户自己的域名；不填就用 <站点标识>.${ROOT_DOMAIN}
    SITE_EMAIL     选填
    SITE_PHONE     选填
    SITE_WHATSAPP  选填  纯数字带国家码
    SITE_FOUNDED   选填  成立年份
`;

/* ── 缺必填项：能提问就提问，不能提问就给用法并退出 ── */
if (!slug || !name) {
  if (!process.stdin.isTTY) {
    console.error(USAGE);
    process.exit(1);
  }
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log("\n新建客户站点 —— 直接回车表示先留空，之后再在后台补。\n");
  if (!name) name = await rl.question("公司全称（例：Acme Tools Co., Ltd.）： ");
  if (!slug)
    slug = await rl.question("站点标识（英文小写、减号连接，例：acme-tools）： ");
  if (!brand) brand = await rl.question("品牌短名（例：ACME）： ");
  if (!tagline) tagline = await rl.question("首屏大标题： ");
  if (!domain) domain = await rl.question("客户自己的域名（没有就回车）： ");
  if (!email) email = await rl.question("邮箱： ");
  if (!phone) phone = await rl.question("电话： ");
  if (!whatsapp) whatsapp = await rl.question("WhatsApp（纯数字带国家码）： ");
  rl.close();
}

/* ── 校验站点标识 ── */
const cleanSlug = String(slug).trim().toLowerCase();
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(cleanSlug)) {
  console.error(
    `\n✗ 站点标识不合法："${cleanSlug}"\n  只能用英文小写字母、数字和减号，例如 acme-tools\n`,
  );
  process.exit(1);
}

const payload = await getPayload({ config });

const existing = await payload.find({
  collection: "tenants",
  where: { slug: { equals: cleanSlug } },
  limit: 1,
  overrideAccess: true,
});
if (existing.docs.length > 0) {
  console.error(`\n✗ 站点标识 "${cleanSlug}" 已被占用，换一个。\n`);
  process.exit(1);
}

/* ── 域名 ── */
const defaultSubdomain = `${cleanSlug}.${ROOT_DOMAIN}`;
const customDomain = domain?.trim().toLowerCase() || undefined;
const domains: { domain: string }[] = [];
if (customDomain && customDomain !== defaultSubdomain) {
  domains.push({ domain: customDomain });
}
// 始终保留默认子域名，方便你自己进去看
domains.push({ domain: defaultSubdomain });

/* ── 建站点 ── */
console.log(`\n→ 创建站点：${name}（${cleanSlug}）`);
const tenant = await payload.create({
  collection: "tenants",
  data: {
    name: name!,
    slug: cleanSlug,
    brand: brand || name!,
    tagline: tagline || "",
    description: "",
    founded: founded ? Number(founded) : undefined,
    status: "trial",
    email: email || undefined,
    phone: phone || undefined,
    whatsapp: whatsapp || undefined,
    primaryColor: "#1e425f",
    defaultLocale: "en",
    enabledLocales: ["en"],
    domains,
  },
  overrideAccess: true,
});
const tenantId = Number(tenant.id);

/* ── 站点设置骨架（避免首页开天窗）── */
console.log("→ 创建站点设置骨架…");
await payload.create({
  collection: "site-settings",
  data: {
    heroPoints: [
      { text: "待填写：一条最能让买家放心的优势（例：自有工厂，无中间商）" },
      { text: "待填写：一条关于交期或认证的优势" },
      { text: "待填写：一条关于定制或售后服务的优势" },
    ],
    stats: [
      { value: "—", label: "待填写：成立年数" },
      { value: "—", label: "待填写：员工人数" },
      { value: "—", label: "待填写：厂房面积" },
      { value: "—", label: "待填写：出口国家数" },
    ],
    whyUs: [
      {
        title: "待填写：为什么选我们",
        desc: "在后台「站点设置」里改成真实的理由，通常写 3–6 条。",
      },
    ],
    faqs: [
      {
        q: "待填写：买家最常问的问题",
        a: "待填写答案。常见的有 MOQ、交期、能不能贴牌、付款方式。",
      },
    ],
    tenant: tenantId,
  },
  overrideAccess: true,
});

/* ── 重新生成域名映射 ── */
console.log("→ 重新生成域名映射表…");
const map = await writeDomainMap(payload);
const hosts = Object.entries(map)
  .filter(([, s]) => s === cleanSlug)
  .map(([h]) => h);

console.log(`
✅ 站点已创建：${name}

   站点 ID：${tenantId}
   后台：    http://localhost:3001/admin   （右上角切换到这个站点）
   预览：    http://${cleanSlug}.localhost:3001
${customDomain ? `   自定义域名：${customDomain}（DNS 解析好以后可访问）` : ""}

   已登记的域名：
${hosts.map((h) => `     · ${h}`).join("\n")}

   ┌── 接下来做什么 ──────────────────────────────────────────────┐
   │ 1. 进后台，右上角站点选择器切到这个站点                       │
   │ 2. 录内容：产品分类 → 产品 → 认证资质                         │
   │ 3. 改「站点设置」里那几条「待填写」                            │
   │ 4. 「站点 > 外观」上传 Logo、改主色                            │
   │ 5. 绑客户自己的域名（站点 > 域名与状态）                       │
   │    改完域名后再跑一次：npm run domains                        │
   │ 6. 重新构建：npm run build                                    │
   │ 7. 生产环境按 deploy/README.md 配 DNS 和 Caddy                │
   └───────────────────────────────────────────────────────────────┘

   ⚠️ 第 6 步不能省：客户站点是静态生成的，不重新构建看不到新站点。
`);

process.exit(0);
