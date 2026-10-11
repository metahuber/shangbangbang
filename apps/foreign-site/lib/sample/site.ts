/**
 * 样板站点数据（虚构样例）
 *
 * ⚠️ 这是一家**虚构的**工厂，用于展示模板效果。
 *    正式上线前，这些数据会由 Payload 后台提供，页面代码不用改。
 *
 * 工厂设定：浙江宁波的五金工具制造厂，2008 年成立，主要做 OEM/ODM 出口。
 */

import type { Site, Certificate, Stat, Capability, Faq, Category } from "@/lib/types";

export const site: Site = {
  slug: "hengxin-tools",
  name: "Hengxin Precision Tools Co., Ltd.",
  brand: "HX TOOLS",
  domain: "www.hx-tools-example.com",
  tagline: "Precision Hand Tools, Built for Professionals",
  description:
    "Hengxin Precision Tools is a China-based manufacturer of hand tools, tool sets, air tools and storage solutions. 18 years of OEM/ODM experience, exporting to 46 countries. ISO 9001, CE, GS and BSCI certified.",
  email: "sales@hx-tools-example.com",
  phone: "+86 574 8888 6600",
  whatsapp: "8613857001234",
  address: "No. 18 Zhongsan Road, Beilun District, Ningbo, Zhejiang, China",
  founded: 2008,
  locales: ["en"],
  defaultLocale: "en",
  social: [
    { label: "LinkedIn", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "Facebook", href: "#" },
  ],
};

export const stats: Stat[] = [
  { value: "18", label: "Years of manufacturing" },
  { value: "260", label: "Employees" },
  { value: "28,000 m²", label: "Factory area" },
  { value: "46", label: "Export countries" },
];

export const certificates: Certificate[] = [
  {
    name: "ISO 9001:2015",
    issuer: "SGS",
    note: "Quality management system",
  },
  {
    name: "CE",
    issuer: "TÜV Rheinland",
    note: "European conformity for hand tools",
  },
  {
    name: "GS",
    issuer: "TÜV Rheinland",
    note: "Tested safety mark",
  },
  {
    name: "BSCI",
    issuer: "amfori",
    note: "Social compliance audit",
  },
  {
    name: "RoHS",
    issuer: "Intertek",
    note: "Restricted substances compliance",
  },
];

/** 生产能力 —— 客户最关心「你到底是不是真工厂」 */
export const capabilities: Capability[] = [
  {
    name: "Forging",
    desc: "6 hot-forging lines producing wrench and plier blanks in-house, 12 million pieces per year.",
    imageCaption: "Forging workshop · 1600×1000",
  },
  {
    name: "CNC Machining",
    desc: "48 CNC machining centers with tolerances held to ±0.02 mm on critical dimensions.",
    imageCaption: "CNC machining center · 1600×1000",
  },
  {
    name: "Heat Treatment",
    desc: "Continuous quenching and tempering lines with hardness verified batch by batch.",
    imageCaption: "Heat treatment line · 1600×1000",
  },
  {
    name: "Surface Finishing",
    desc: "Chrome plating, black oxide, nickel plating and powder coating, all RoHS compliant.",
    imageCaption: "Plating line · 1600×1000",
  },
  {
    name: "Assembly & Packing",
    desc: "9 assembly lines supporting blister, color box, blow case and custom retail packaging.",
    imageCaption: "Assembly line · 1600×1000",
  },
  {
    name: "Quality Lab",
    desc: "Hardness testers, torque testers, salt spray chamber and 3D measuring equipment on site.",
    imageCaption: "Testing laboratory · 1600×1000",
  },
];

/** 为什么选我们 */
export const whyUs: { title: string; desc: string }[] = [
  {
    title: "Direct from the factory",
    desc: "No trading company in between. You talk to the people who actually run the machines.",
  },
  {
    title: "Full OEM & ODM support",
    desc: "Your logo, your packaging, your color. Or let our engineers develop a new item from your drawing.",
  },
  {
    title: "Samples in 7 days",
    desc: "Standard samples ship within 7 working days so you can check quality before committing to a container.",
  },
  {
    title: "Third-party inspection welcome",
    desc: "SGS, BV, TÜV or your own QC team — we are open to any inspection you arrange.",
  },
  {
    title: "Small trial orders accepted",
    desc: "Start with a mixed trial order to test the market. Volume pricing applies from the second order.",
  },
  {
    title: "Response within 12 hours",
    desc: "Our export team answers technical questions within 12 working hours, in English or Spanish.",
  },
];

export const faqs: Faq[] = [
  {
    q: "Are you a factory or a trading company?",
    a: "We are a manufacturer. Our factory is in Beilun District, Ningbo, covering 28,000 m² with 260 employees. You are welcome to visit or arrange a video tour.",
  },
  {
    q: "What is your MOQ?",
    a: "For most items the MOQ is 500–1,000 pieces per size. Trial orders with mixed items are accepted so you can test the market first.",
  },
  {
    q: "Can you print our logo on the products and packaging?",
    a: "Yes. We offer full OEM service including logo marking, custom colors, and retail packaging design (blister, color box, blow case, display carton).",
  },
  {
    q: "How long is the lead time?",
    a: "Samples ship in about 7 working days. Mass production is normally 25–35 days after artwork and deposit confirmation, depending on quantity.",
  },
  {
    q: "What payment terms do you accept?",
    a: "T/T with 30% deposit and 70% against B/L copy is standard. L/C at sight and Trade Assurance are also accepted.",
  },
  {
    q: "Can you send samples before we place an order?",
    a: "Yes. We provide free samples for most items; you only cover the courier cost, which is refunded on your first order.",
  },
];

export const categoriesSummary =
  "Four product lines, one quality standard. Every item is produced in our own factory in Ningbo.";
