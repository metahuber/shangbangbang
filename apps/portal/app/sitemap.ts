import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { products } from "@/content/products";
import { solutions } from "@/content/solutions";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/products", priority: 0.9 },
    { path: "/solutions", priority: 0.9 },
    { path: "/cases", priority: 0.8 },
    { path: "/pricing", priority: 0.9 },
    { path: "/faq", priority: 0.7 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.9 },
  ].map((r) => ({
    url: `${site.url}${r.path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: r.priority,
  }));

  const productRoutes = products.map((p) => ({
    url: `${site.url}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const solutionRoutes = solutions.map((s) => ({
    url: `${site.url}/solutions/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes, ...solutionRoutes];
}
