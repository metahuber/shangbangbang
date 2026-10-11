/**
 * 数据访问层
 *
 * ⭐ 所有函数第一个参数是 siteSlug —— 也就是「哪个客户的站点」。
 *    页面从路由参数拿到它（middleware 会把域名翻译成 /站点标识/...）。
 *
 * 为什么这样设计而不是读环境变量：
 *   一套系统要服务 N 个客户，页面必须能按访问的域名渲染不同内容，
 *   同时保持**静态生成**（每个客户一份静态页面，SEO 和速度都好）。
 */

import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import { DEFAULT_SITE } from "@/lib/tenant";
import type {
  Site,
  Category,
  Product,
  Certificate,
  Stat,
  Capability,
  Faq,
  MediaRef,
} from "@/lib/types";

const LOCALE = "en";

/* eslint-disable @typescript-eslint/no-explicit-any */

async function client() {
  return getPayload({ config });
}

function toMedia(value: any): MediaRef | null {
  if (!value || typeof value !== "object" || !value.url) return null;
  return { url: value.url as string, alt: (value.alt as string) ?? "" };
}

/** 站点（租户）—— 同一个请求内只查一次 */
export const getTenant = cache(async (siteSlug: string = DEFAULT_SITE) => {
  try {
    const payload = await client();
    const { docs } = await payload.find({
      collection: "tenants",
      where: { slug: { equals: siteSlug } },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    });
    return (docs[0] as any) ?? null;
  } catch (e) {
    console.warn(`[cms] 读取站点 "${siteSlug}" 失败`, e);
    return null;
  }
});

async function tenantIdOf(siteSlug: string): Promise<number | null> {
  const t = await getTenant(siteSlug);
  return t ? Number(t.id) : null;
}

/** 每个租户一份的站点设置 */
export const getSettings = cache(async (siteSlug: string) => {
  try {
    const payload = await client();
    const tid = await tenantIdOf(siteSlug);
    if (!tid) return null;
    const { docs } = await payload.find({
      collection: "site-settings",
      where: { tenant: { equals: tid } },
      limit: 1,
      depth: 1,
      locale: LOCALE,
      overrideAccess: true,
    });
    return (docs[0] as any) ?? null;
  } catch (e) {
    console.warn("[cms] 读取站点设置失败", e);
    return null;
  }
});

/* ─────────────── 构建时用：所有站点标识 ─────────────── */

export async function getAllSiteSlugs(): Promise<string[]> {
  try {
    const payload = await client();
    const { docs } = await payload.find({
      collection: "tenants",
      limit: 200,
      depth: 0,
      overrideAccess: true,
    });
    const slugs = (docs as any[])
      .filter((d) => d.status !== "expired")
      .map((d) => d.slug as string);
    return slugs.length > 0 ? slugs : [DEFAULT_SITE];
  } catch {
    return [DEFAULT_SITE];
  }
}

/* ─────────────── 站点 ─────────────── */

export async function getSite(siteSlug: string): Promise<Site> {
  const t = await getTenant(siteSlug);
  if (!t) {
    return {
      slug: siteSlug,
      name: "Site not configured",
      brand: "SITE",
      domain: "example.com",
      tagline: "This site has not been set up yet",
      description: "",
      email: "",
      phone: "",
      whatsapp: "",
      address: "",
      founded: new Date().getFullYear(),
      locales: ["en"],
      defaultLocale: "en",
      social: [],
    };
  }
  return {
    slug: t.slug,
    name: t.name,
    brand: t.brand ?? t.name,
    domain: (t.domains?.[0]?.domain as string) ?? `${t.slug}.shangbangbang.com`,
    tagline: t.tagline ?? "",
    description: t.description ?? "",
    email: t.email ?? "",
    phone: t.phone ?? "",
    whatsapp: t.whatsapp ?? "",
    address: t.address ?? "",
    founded: t.founded ?? new Date().getFullYear(),
    locales: (t.enabledLocales ?? ["en"]) as Site["locales"],
    defaultLocale: (t.defaultLocale ?? "en") as Site["defaultLocale"],
    logo: toMedia(t.logo),
    social: [],
  };
}

export async function getHeroPoints(siteSlug: string): Promise<string[]> {
  const s = await getSettings(siteSlug);
  return (s?.heroPoints ?? [])
    .map((p: any) => p.text)
    .filter((x: unknown): x is string => typeof x === "string");
}

/** 收款方式 —— 买家决定联系你之前会看这个 */
export async function getPaymentTerms(
  siteSlug: string,
): Promise<{ method: string; detail: string }[]> {
  const s = await getSettings(siteSlug);
  return (s?.paymentTerms ?? [])
    .map((p: any) => ({
      method: String(p.method ?? ""),
      detail: String(p.detail ?? ""),
    }))
    .filter((p: { method: string; detail: string }) => p.method && p.detail);
}

export async function getStats(siteSlug: string): Promise<Stat[]> {
  const s = await getSettings(siteSlug);
  return (s?.stats ?? []).map((x: any) => ({
    value: x.value,
    label: x.label,
  }));
}

export async function getCertificates(siteSlug: string): Promise<Certificate[]> {
  try {
    const payload = await client();
    const tid = await tenantIdOf(siteSlug);
    if (!tid) return [];
    const { docs } = await payload.find({
      collection: "certificates",
      where: { tenant: { equals: tid } },
      sort: "order",
      limit: 100,
      depth: 1,
      locale: LOCALE,
      overrideAccess: true,
    });
    return (docs as any[]).map((d) => ({
      name: d.name,
      issuer: d.issuer ?? "",
      note: d.note ?? "",
      image: toMedia(d.image),
    })) as Certificate[];
  } catch {
    return [];
  }
}

export async function getCapabilities(siteSlug: string): Promise<Capability[]> {
  const s = await getSettings(siteSlug);
  return (s?.capabilities ?? []).map((c: any) => ({
    name: c.name,
    desc: c.desc ?? "",
    imageCaption: `${c.name} · 1600×1000`,
    image: toMedia(c.image),
  }));
}

export async function getWhyUs(
  siteSlug: string,
): Promise<{ title: string; desc: string }[]> {
  const s = await getSettings(siteSlug);
  return (s?.whyUs ?? []).map((w: any) => ({
    title: w.title,
    desc: w.desc ?? "",
  }));
}

export async function getFaqs(siteSlug: string): Promise<Faq[]> {
  const s = await getSettings(siteSlug);
  return (s?.faqs ?? []).map((f: any) => ({ q: f.q, a: f.a }));
}

/* ─────────────── 分类 ─────────────── */

function toCategory(d: any): Category {
  return {
    slug: d.slug,
    name: d.name,
    summary: d.summary ?? "",
    imageCaption: `${d.name} · 1200×900`,
    image: toMedia(d.image),
    order: d.order ?? 0,
  };
}

export async function getCategories(siteSlug: string): Promise<Category[]> {
  try {
    const payload = await client();
    const tid = await tenantIdOf(siteSlug);
    if (!tid) return [];
    const { docs } = await payload.find({
      collection: "categories",
      where: { tenant: { equals: tid } },
      sort: "order",
      limit: 100,
      depth: 1,
      locale: LOCALE,
      overrideAccess: true,
    });
    return (docs as any[]).map(toCategory);
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(
  siteSlug: string,
  slug: string,
): Promise<Category | null> {
  const all = await getCategories(siteSlug);
  return all.find((c) => c.slug === slug) ?? null;
}

/* ─────────────── 产品 ─────────────── */

function toProduct(d: any): Product {
  const gallery = Array.isArray(d.gallery)
    ? (d.gallery.map(toMedia).filter(Boolean) as MediaRef[])
    : [];
  return {
    slug: d.slug,
    sku: d.sku,
    name: d.name,
    categorySlug: typeof d.category === "object" ? (d.category?.slug ?? "") : "",
    summary: d.summary ?? "",
    description: String(d.description ?? "")
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .filter(Boolean),
    features: (d.features ?? [])
      .map((f: any) => f.text)
      .filter((x: unknown): x is string => typeof x === "string"),
    specs: (d.specs ?? []).map((s: any) => ({
      label: s.label,
      value: s.value,
    })),
    moq: d.moq ?? "",
    leadTime: d.leadTime ?? "",
    imageCaption: `${d.name} · 1400×1050`,
    image: gallery[0] ?? null,
    gallery,
    featured: Boolean(d.featured),
    order: d.order ?? 0,
  };
}

export async function getProducts(
  siteSlug: string,
  categorySlug?: string,
): Promise<Product[]> {
  try {
    const payload = await client();
    const tid = await tenantIdOf(siteSlug);
    if (!tid) return [];

    const and: any[] = [
      { tenant: { equals: tid } },
      { status: { equals: "published" } },
    ];

    if (categorySlug) {
      const { docs: cats } = await payload.find({
        collection: "categories",
        where: {
          and: [{ tenant: { equals: tid } }, { slug: { equals: categorySlug } }],
        },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });
      const cat = cats[0] as any;
      if (!cat) return [];
      and.push({ category: { equals: cat.id } });
    }

    const { docs } = await payload.find({
      collection: "products",
      where: { and },
      sort: "order",
      limit: 500,
      depth: 1,
      locale: LOCALE,
      overrideAccess: true,
    });
    return (docs as any[]).map(toProduct);
  } catch (e) {
    console.warn("[cms] 读取产品失败", e);
    return [];
  }
}

export async function getFeaturedProducts(siteSlug: string): Promise<Product[]> {
  const all = await getProducts(siteSlug);
  return all.filter((p) => p.featured);
}

export async function getProductBySlug(
  siteSlug: string,
  slug: string,
): Promise<Product | null> {
  try {
    const payload = await client();
    const tid = await tenantIdOf(siteSlug);
    if (!tid) return null;
    const { docs } = await payload.find({
      collection: "products",
      where: {
        and: [{ tenant: { equals: tid } }, { slug: { equals: slug } }],
      },
      limit: 1,
      depth: 1,
      locale: LOCALE,
      overrideAccess: true,
    });
    return docs[0] ? toProduct(docs[0] as any) : null;
  } catch {
    return null;
  }
}

export async function getRelatedProducts(
  siteSlug: string,
  product: Product,
  limit = 3,
): Promise<Product[]> {
  const all = await getProducts(siteSlug, product.categorySlug);
  return all.filter((p) => p.slug !== product.slug).slice(0, limit);
}

export async function getCategoryCounts(
  siteSlug: string,
): Promise<Record<string, number>> {
  const all = await getProducts(siteSlug);
  return all.reduce<Record<string, number>>((acc, p) => {
    acc[p.categorySlug] = (acc[p.categorySlug] ?? 0) + 1;
    return acc;
  }, {});
}
