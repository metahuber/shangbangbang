/**
 * 外贸站领域类型
 *
 * 这些类型对应方案文档第四节的数据模型，
 * 也就是将来 Payload 后台的集合定义。先在这里定义，样板站点先用模拟数据。
 */

export type Locale = "en" | "zh" | "es" | "ar";

export type MediaRef = {
  url: string;
  alt: string;
};

export type Site = {
  slug: string;
  /** 公司全称（页脚、结构化数据用） */
  name: string;
  /** 品牌短名（页头用） */
  brand: string;
  domain: string;
  /** 首屏大标题 */
  tagline: string;
  /** SEO 描述 */
  description: string;
  email: string;
  phone: string;
  /** 纯数字，用于 wa.me 链接 */
  whatsapp: string;
  address: string;
  founded: number;
  locales: Locale[];
  defaultLocale: Locale;
  logo?: MediaRef | null;
  /** 可能为空数组（客户还没填社交账号），但类型上保证存在 */
  social: { label: string; href: string }[];
};

export type Category = {
  slug: string;
  name: string;
  summary: string;
  /** 图片占位说明，有真实照片后替换 */
  imageCaption: string;
  image?: MediaRef | null;
  order: number;
};

export type Spec = { label: string; value: string };

export type Product = {
  slug: string;
  sku: string;
  name: string;
  categorySlug: string;
  summary: string;
  description: string[];
  features: string[];
  specs: Spec[];
  moq: string;
  leadTime: string;
  imageCaption: string;
  image?: MediaRef | null;
  gallery?: MediaRef[];
  featured?: boolean;
  order: number;
};

export type Certificate = {
  name: string;
  issuer: string;
  note: string;
  image?: MediaRef | null;
};

export type Stat = { value: string; label: string };

export type Capability = {
  name: string;
  desc: string;
  imageCaption: string;
  image?: MediaRef | null;
};

export type Faq = { q: string; a: string };

export type Inquiry = {
  name: string;
  email: string;
  company?: string;
  country?: string;
  quantity?: string;
  message: string;
  /** 从哪个产品页发起的询盘 */
  productSlug?: string;
  at: string;
};
