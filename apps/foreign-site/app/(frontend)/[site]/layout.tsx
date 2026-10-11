import type { Metadata } from "next";
import "../../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getSite, getCategories, getAllSiteSlugs } from "@/lib/cms";

/**
 * 客户站点的根布局
 *
 * 路由参数 [site] 是站点标识，由 middleware 从访问的域名翻译过来：
 *   hx-tools.shangbangbang.com  →  /hx-tools/...
 *   localhost:3001              →  /hengxin-tools/...
 *
 * generateStaticParams 列出所有租户，所以每个客户的站点是**静态生成**的。
 * 新增客户后需要重新构建（部署脚本会做这件事）。
 */

type Params = { site: string };

export async function generateStaticParams() {
  const slugs = await getAllSiteSlugs();
  return slugs.map((site) => ({ site }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { site: siteSlug } = await params;
  const site = await getSite(siteSlug);

  return {
    metadataBase: new URL(`https://${site.domain}`),
    title: {
      default: `${site.brand} — ${site.tagline}`,
      template: `%s | ${site.brand}`,
    },
    description: site.description,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: `https://${site.domain}`,
      siteName: site.name,
      title: `${site.brand} — ${site.tagline}`,
      description: site.description,
    },
    alternates: {
      canonical: "/",
      // 接入多语言后，这里会按 site.locales 生成 hreflang 互指
    },
    robots: { index: true, follow: true },
  };
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { site: siteSlug } = await params;
  const [site, categories] = await Promise.all([
    getSite(siteSlug),
    getCategories(siteSlug),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    alternateName: site.brand,
    url: `https://${site.domain}`,
    description: site.description,
    foundingDate: String(site.founded),
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressCountry: "CN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.email,
      telephone: site.phone,
      availableLanguage: site.locales,
    },
  };

  return (
    <html lang={site.defaultLocale}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header
          brand={site.brand}
          categories={categories}
          email={site.email}
          phone={site.phone}
        />
        <main className="flex-1">{children}</main>
        <Footer site={site} categories={categories} />
        {site.whatsapp && <WhatsAppButton number={site.whatsapp} />}
      </body>
    </html>
  );
}
