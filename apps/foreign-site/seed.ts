/**
 * 种子数据
 *
 * 运行：npx payload run seed.ts
 *
 * 会建**两个客户站点**，用来验证多租户：
 *   1. hengxin-tools     恒信精密工具（五金工具，站点一，内容来自 lib/sample）
 *   2. ruitai-machinery  瑞泰包装机械（包装机械，站点二，内容内联在下面）
 *
 * 两个站点的产品、分类、认证、询盘互相看不到 —— 这就是数据隔离。
 *
 * ⚠️ 里面的账号密码只用于本地开发，上线前必须改掉。
 */

import { getPayload } from "payload";
import config from "./payload.config";

import {
  site as hengxinSite,
  stats as hengxinStats,
  certificates as hengxinCerts,
  capabilities as hengxinCaps,
  whyUs as hengxinWhy,
  faqs as hengxinFaqs,
} from "./lib/sample/site";
import {
  categories as hengxinCategories,
  products as hengxinProducts,
} from "./lib/sample/products";

const DEV_EMAIL = "admin@shangbangbang.com";
const DEV_PASSWORD = "Shangbang2026!";

/* ─────────────────────────────────────────────
   站点二：瑞泰包装机械（内联定义，用于验证隔离）
   ───────────────────────────────────────────── */

const ruitai = {
  tenant: {
    name: "Ruitai Packaging Machinery Co., Ltd.",
    slug: "ruitai-machinery",
    brand: "RUITAI",
    tagline: "Flexible Packaging Machines, Engineered to Run",
    description:
      "Ruitai manufactures vertical form fill seal machines, filling lines and complete packaging solutions from our factory in Suzhou, China. 14 years of experience serving food and daily chemical brands.",
    founded: 2012,
    domain: "ruitai-machinery.shangbangbang.com",
    primaryColor: "#0f5257",
    email: "sales@ruitai-example.com",
    phone: "+86 512 6666 8800",
    whatsapp: "8613900001234",
    address: "No. 66 Xinhe Road, Suzhou Industrial Park, Jiangsu, China",
  },
  categories: [
    {
      slug: "vffs-machines",
      name: "VFFS Machines",
      summary:
        "Vertical form fill seal machines for powder, granule and liquid.",
      order: 1,
    },
    {
      slug: "filling-lines",
      name: "Filling Lines",
      summary: "Automatic filling and capping lines for bottles and pouches.",
      order: 2,
    },
  ],
  products: [
    {
      slug: "vffs-420-powder",
      sku: "RT-VF-420",
      name: "VFFS-420 Powder Packaging Machine",
      categorySlug: "vffs-machines",
      summary:
        "420 mm film width, 20–60 bags/min, servo-driven with a stainless steel frame.",
      description:
        "Built around a 420 mm film width, this is the workhorse model for milk powder, coffee and spice producers who need reliable output without a full-line investment.\n\nAll product-contact parts are 304 stainless steel and the whole frame can be washed down, which matters for food plants going through audits.",
      features: [
        "Servo-driven film pulling, ±1 mm bag length accuracy",
        "304 stainless steel product contact parts",
        "10-inch touch screen, recipe memory for 50 products",
        "Schneider / Omron electrical components",
        "CE certified",
      ],
      specs: [
        { label: "Film width", value: "420 mm" },
        { label: "Bag size", value: "L 80–300 mm × W 80–200 mm" },
        { label: "Speed", value: "20–60 bags/min" },
        { label: "Filling range", value: "10–1,000 g" },
        { label: "Power", value: "4.5 kW, 380 V / 50 Hz" },
        { label: "Machine size", value: "1,650 × 1,150 × 2,300 mm" },
      ],
      moq: "1 unit",
      leadTime: "45–60 days",
      order: 1,
      featured: true,
    },
    {
      slug: "vffs-520-granule",
      sku: "RT-VF-520",
      name: "VFFS-520 Granule Packaging Machine",
      categorySlug: "vffs-machines",
      summary:
        "Larger 520 mm format for snack and nuts producers. 15–50 bags/min.",
      description:
        "A wider format for snack producers running pillow bags with high product density. The auger and cup filler can be swapped on the same frame.",
      features: [
        "520 mm film width",
        "Swap between cup filler and auger for different products",
        "Gas flush option for extended shelf life",
        "CE certified",
      ],
      specs: [
        { label: "Film width", value: "520 mm" },
        { label: "Speed", value: "15–50 bags/min" },
        { label: "Filling range", value: "50–2,000 g" },
        { label: "Power", value: "5.5 kW, 380 V / 50 Hz" },
      ],
      moq: "1 unit",
      leadTime: "45–60 days",
      order: 2,
    },
    {
      slug: "filling-line-6-head",
      sku: "RT-FL-600",
      name: "6-Head Automatic Filling Line",
      categorySlug: "filling-lines",
      summary:
        "Linear filling, capping and labelling line for 30–50 bottles per minute.",
      description:
        "A complete linear line for liquid and cream products: unscrambling, filling, capping and labelling in one skid-mounted unit that fits a normal workshop bay.",
      features: [
        "6-head piston filler, ±0.5% accuracy",
        "Servo capping with torque control",
        "Quick changeover between bottle sizes, under 30 minutes",
        "CE certified",
      ],
      specs: [
        { label: "Output", value: "30–50 bottles/min" },
        { label: "Bottle size", value: "50–1,000 ml" },
        { label: "Filling accuracy", value: "±0.5%" },
        { label: "Power", value: "7.5 kW, 380 V / 50 Hz" },
      ],
      moq: "1 unit",
      leadTime: "60–75 days",
      order: 3,
      featured: true,
    },
    {
      slug: "pouch-packing-line",
      sku: "RT-PL-300",
      name: "Semi-Automatic Pouch Packing Line",
      categorySlug: "filling-lines",
      summary:
        "Entry-level line for workshops starting out. 15–25 pouches per minute.",
      description:
        "Designed for producers moving from manual packing to a semi-automatic line, with a lower investment and a shorter learning curve.",
      features: [
        "Low investment entry point",
        "Simple controls, operator trained in one day",
        "Upgradeable to fully automatic later",
      ],
      specs: [
        { label: "Output", value: "15–25 pouches/min" },
        { label: "Pouch width", value: "100–250 mm" },
        { label: "Power", value: "3.0 kW, 380 V / 50 Hz" },
      ],
      moq: "1 unit",
      leadTime: "40–50 days",
      order: 4,
    },
  ],
  settings: {
    paymentTerms: [
      { method: "T/T", detail: "30% deposit before production, 70% before shipment." },
      { method: "L/C", detail: "Irrevocable L/C at sight." },
      { method: "Western Union", detail: "For sample payments only." },
    ],
    heroPoints: [
      { text: "72-hour trial run on your own product before shipment" },
      { text: "One engineer on site for installation and operator training" },
      { text: "Spare parts stocked for 10 years after delivery" },
    ],
    stats: [
      { value: "14", label: "Years of manufacturing" },
      { value: "120", label: "Employees" },
      { value: "15,000 m²", label: "Factory area" },
      { value: "31", label: "Export countries" },
    ],
    capabilities: [
      {
        name: "Machining",
        desc: "18 CNC centres machining frames, cams and shafts in-house to keep tolerances tight.",
      },
      {
        name: "Assembly & Testing",
        desc: "Every machine runs a 72-hour trial production with the customer's own product before shipment.",
      },
    ],
    whyUs: [
      {
        title: "72-hour trial run before shipment",
        desc: "We run your product on the machine and send you the video before it leaves the factory.",
      },
      {
        title: "Engineer on site for installation",
        desc: "One engineer travels to your plant for commissioning and operator training.",
      },
      {
        title: "Spare parts for 10 years",
        desc: "We keep wearing parts in stock for a decade after delivery.",
      },
    ],
    faqs: [
      {
        q: "Do you provide installation overseas?",
        a: "Yes. One engineer travels to your plant for commissioning and training. You cover flights, visa and accommodation.",
      },
      {
        q: "Can we test our product before buying?",
        a: "Yes. Send us 5–10 kg of your product and we will run it on the machine and send you the video and samples.",
      },
      {
        q: "What is the warranty?",
        a: "12 months on the whole machine, 24 months on the servo and control system.",
      },
    ],
  },
  inquiry: {
    name: "Priya Nair",
    email: "priya@snackfoods.in",
    company: "Snack Foods India Pvt Ltd",
    country: "India",
    quantity: "1 unit",
    message:
      "We need a VFFS machine for 200 g namkeen pouches. Please quote with gas flush option, CIF Nhava Sheva.",
    status: "new" as const,
  },
};

async function seed() {
  const payload = await getPayload({ config });

  console.log("→ 清空旧数据…");

  // ⚠️ 必须先解除账号与站点的关联，否则删站点会撞外键约束
  //    （用户表里的 tenants 数组引用了 tenants.id）
  const allUsers = await payload.find({
    collection: "users",
    limit: 100,
    depth: 0,
    overrideAccess: true,
  });
  for (const u of allUsers.docs as Array<{ id: number | string }>) {
    await payload.update({
      collection: "users",
      id: u.id,
      data: { tenants: [] },
      overrideAccess: true,
    });
  }

  for (const collection of [
    "inquiries",
    "products",
    "categories",
    "certificates",
    "site-settings",
    "media",
    "tenants",
  ] as const) {
    await payload.delete({ collection, where: { id: { exists: true } } });
  }

  /* ── 站点一 ── */
  console.log("\n→ 站点一：恒信精密工具 (hengxin-tools)");
  const t1 = await payload.create({
    collection: "tenants",
    data: {
      name: hengxinSite.name,
      slug: hengxinSite.slug,
      brand: hengxinSite.brand,
      tagline: hengxinSite.tagline,
      description: hengxinSite.description,
      founded: hengxinSite.founded,
      status: "active",
      email: hengxinSite.email,
      phone: hengxinSite.phone,
      whatsapp: hengxinSite.whatsapp,
      address: hengxinSite.address,
      primaryColor: "#1e425f",
      defaultLocale: "en",
      enabledLocales: ["en"],
      domains: [
        { domain: "hengxin-tools.shangbangbang.com" },
        // 这个客户还绑了自己的域名 —— 用来演示「客户自定义域名」
        { domain: "hx-tools-example.com" },
      ],
    },
  });
  const id1 = Number(t1.id);

  const cat1: Record<string, number> = {};
  for (const c of hengxinCategories) {
    const d = await payload.create({
      collection: "categories",
      data: {
        name: c.name,
        slug: c.slug,
        summary: c.summary,
        order: c.order,
        tenant: id1,
      },
    });
    cat1[c.slug] = Number(d.id);
  }

  for (const p of hengxinProducts) {
    await payload.create({
      collection: "products",
      data: {
        name: p.name,
        sku: p.sku,
        slug: p.slug,
        category: cat1[p.categorySlug],
        summary: p.summary,
        description: p.description.join("\n\n"),
        features: p.features.map((text) => ({ text })),
        specs: p.specs.map((s) => ({ label: s.label, value: s.value })),
        moq: p.moq,
        leadTime: p.leadTime,
        order: p.order,
        featured: p.featured ?? false,
        status: "published",
        tenant: id1,
      },
    });
  }

  for (const [i, c] of hengxinCerts.entries()) {
    await payload.create({
      collection: "certificates",
      data: {
        name: c.name,
        issuer: c.issuer,
        note: c.note,
        order: i,
        tenant: id1,
      },
    });
  }

  await payload.create({
    collection: "site-settings",
    data: {
      paymentTerms: [
        { method: "T/T", detail: "30% deposit, 70% against B/L copy. Standard for all orders." },
        { method: "L/C", detail: "L/C at sight accepted for orders above USD 50,000." },
        { method: "PayPal", detail: "For samples and orders under USD 500." },
      ],
      heroPoints: [
        { text: "Direct from the factory — no trading company in between" },
        { text: "Samples ready in 7 working days" },
        { text: "ISO 9001, CE, GS and BSCI certified" },
      ],
      stats: hengxinStats.map((s) => ({ value: s.value, label: s.label })),
      capabilities: hengxinCaps.map((c) => ({ name: c.name, desc: c.desc })),
      whyUs: hengxinWhy.map((w) => ({ title: w.title, desc: w.desc })),
      faqs: hengxinFaqs.map((f) => ({ q: f.q, a: f.a })),
      tenant: id1,
    },
  });

  const hengxinProductList = await payload.find({
    collection: "products",
    where: { tenant: { equals: id1 } },
    limit: 3,
  });
  const hengxinDemos = [
    {
      name: "Hans Mueller",
      email: "hans@abc-trading.de",
      company: "ABC Trading GmbH",
      country: "Germany",
      quantity: "2,000 sets",
      message:
        "Please quote the 8-piece combination wrench set, FOB Hamburg. We also need your CE certificate copy.",
      status: "new" as const,
    },
    {
      name: "Carlos Ribeiro",
      email: "carlos@ferramentas.com.br",
      company: "Ferramentas Ribeiro Ltda",
      country: "Brazil",
      quantity: "1 x 20ft container",
      message:
        "We are interested in air tools. Could you send your full catalogue and best FOB Santos price?",
      status: "following" as const,
    },
  ];
  for (const [i, d] of hengxinDemos.entries()) {
    await payload.create({
      collection: "inquiries",
      data: {
        ...d,
        product: hengxinProductList.docs[i]
          ? Number(hengxinProductList.docs[i].id)
          : undefined,
        tenant: id1,
      },
    });
  }
  console.log(
    `   ${hengxinCategories.length} 分类 / ${hengxinProducts.length} 产品 / ${hengxinCerts.length} 认证 / ${hengxinDemos.length} 询盘`,
  );

  /* ── 站点二 ── */
  console.log("\n→ 站点二：瑞泰包装机械 (ruitai-machinery)");
  const t2 = await payload.create({
    collection: "tenants",
    data: {
      name: ruitai.tenant.name,
      slug: ruitai.tenant.slug,
      brand: ruitai.tenant.brand,
      tagline: ruitai.tenant.tagline,
      description: ruitai.tenant.description,
      founded: ruitai.tenant.founded,
      status: "active",
      email: ruitai.tenant.email,
      phone: ruitai.tenant.phone,
      whatsapp: ruitai.tenant.whatsapp,
      address: ruitai.tenant.address,
      primaryColor: ruitai.tenant.primaryColor,
      defaultLocale: "en",
      enabledLocales: ["en"],
      domains: [{ domain: ruitai.tenant.domain }],
    },
  });
  const id2 = Number(t2.id);

  const cat2: Record<string, number> = {};
  for (const c of ruitai.categories) {
    const d = await payload.create({
      collection: "categories",
      data: {
        name: c.name,
        slug: c.slug,
        summary: c.summary,
        order: c.order,
        tenant: id2,
      },
    });
    cat2[c.slug] = Number(d.id);
  }

  for (const p of ruitai.products) {
    await payload.create({
      collection: "products",
      data: {
        name: p.name,
        sku: p.sku,
        slug: p.slug,
        category: cat2[p.categorySlug],
        summary: p.summary,
        description: p.description,
        features: p.features.map((text) => ({ text })),
        specs: p.specs.map((s) => ({ label: s.label, value: s.value })),
        moq: p.moq,
        leadTime: p.leadTime,
        order: p.order,
        featured: p.featured ?? false,
        status: "published",
        tenant: id2,
      },
    });
  }

  await payload.create({
    collection: "site-settings",
    data: {
      paymentTerms: ruitai.settings.paymentTerms,
      heroPoints: ruitai.settings.heroPoints,
      stats: ruitai.settings.stats,
      capabilities: ruitai.settings.capabilities,
      whyUs: ruitai.settings.whyUs,
      faqs: ruitai.settings.faqs,
      tenant: id2,
    },
  });

  const ruitaiProducts = await payload.find({
    collection: "products",
    where: { tenant: { equals: id2 } },
    limit: 1,
  });
  await payload.create({
    collection: "inquiries",
    data: {
      ...ruitai.inquiry,
      product: ruitaiProducts.docs[0]
        ? Number(ruitaiProducts.docs[0].id)
        : undefined,
      tenant: id2,
    },
  });
  console.log(
    `   ${ruitai.categories.length} 分类 / ${ruitai.products.length} 产品 / 1 询盘`,
  );

  /* ── 管理员 ── */
  console.log("\n→ 后台账号…");
  const existingUsers = await payload.find({
    collection: "users",
    where: { email: { equals: DEV_EMAIL } },
    limit: 1,
  });
  const userData = {
    email: DEV_EMAIL,
    name: "商帮帮管理员",
    roles: ["super-admin"] as ("super-admin" | "editor" | "tenant-admin")[],
    tenants: [{ tenant: id1 }, { tenant: id2 }],
  };
  if (existingUsers.docs.length === 0) {
    await payload.create({
      collection: "users",
      data: { ...userData, password: DEV_PASSWORD },
    });
    console.log(`   已创建：${DEV_EMAIL} / ${DEV_PASSWORD}`);
  } else {
    await payload.update({
      collection: "users",
      id: existingUsers.docs[0].id,
      data: userData,
      overrideAccess: true,
    });
    console.log("   已存在，已把两个站点挂到该账号下");
  }

  console.log("\n✅ 完成。");
  console.log("   后台：      http://localhost:3001/admin");
  console.log("   站点一：    http://hengxin-tools.localhost:3001");
  console.log("   站点二：    http://ruitai-machinery.localhost:3001");
  console.log(`   账号：      ${DEV_EMAIL}`);
  console.log(`   密码：      ${DEV_PASSWORD}`);
  process.exit(0);
}

await seed();
