import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/content/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyMobileCta from "@/components/StickyMobileCta";
import ContentCheckBanner from "@/components/ContentCheckBanner";
import { reportToConsoleOnce } from "@/lib/validate";

// 构建时在终端打印「还有哪些内容没填」
reportToConsoleOnce();

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}｜${site.tagline}`,
    template: `%s｜${site.name}`,
  },
  description: site.description,
  keywords: [
    "外贸网站建设",
    "工厂外贸官网",
    "外贸独立站",
    "多语言网站",
    "商铺小程序开发",
    "门店小程序制作",
    "商帮帮",
  ],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: site.url,
    siteName: site.name,
    title: `${site.name}｜${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: site.nameEn,
  url: site.url,
  description: site.description,
  slogan: site.slogan,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyMobileCta />
        <ContentCheckBanner />
      </body>
    </html>
  );
}
