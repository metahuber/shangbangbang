import type { MetadataRoute } from "next";
import { getSite } from "@/lib/cms";
import { DEFAULT_SITE } from "@/lib/tenant";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSite(DEFAULT_SITE);
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `https://${site.domain}/sitemap.xml`,
    host: `https://${site.domain}`,
  };
}
