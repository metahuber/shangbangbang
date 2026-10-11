import type { MetadataRoute } from "next";
import { getSite, getProducts, getCategories, getAllSiteSlugs } from "@/lib/cms";

/**
 * 每个客户站点一份 sitemap。
 * 注意：/sitemap.xml 这个地址会把所有客户站点的条目都列出来。
 * 以后可以为每个站点单独提供 /站点标识/sitemap.xml（下一步细化）。
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllSiteSlugs();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const siteSlug of slugs) {
    const [site, products, categories] = await Promise.all([
      getSite(siteSlug),
      getProducts(siteSlug),
      getCategories(siteSlug),
    ]);
    const base = `https://${site.domain}`;

    entries.push(
      ...[
        { path: "", priority: 1 },
        { path: "/products", priority: 0.9 },
        { path: "/factory", priority: 0.8 },
        { path: "/quality", priority: 0.7 },
        { path: "/contact", priority: 0.9 },
      ].map((r) => ({
        url: `${base}${r.path}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: r.priority,
      })),
    );

    entries.push(
      ...categories.map((c) => ({
        url: `${base}/products?category=${c.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    );

    entries.push(
      ...products.map((p) => ({
        url: `${base}/products/${p.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    );
  }

  return entries;
}
