import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section, SectionHeading, Container } from "@/components/Section";
import Photo from "@/components/Photo";
import ProductCard from "@/components/ProductCard";
import InquiryForm from "@/components/InquiryForm";
import {
  getProductBySlug,
  getProducts,
  getAllSiteSlugs,
  getRelatedProducts,
  getCategoryBySlug,
  getSite,
} from "@/lib/cms";

export async function generateStaticParams() {
  const slugs = await getAllSiteSlugs();
  const perSite = await Promise.all(
    slugs.map(async (site) => {
      const list = await getProducts(site);
      return list.map((p) => ({ site, slug: p.slug }));
    }),
  );
  return perSite.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ site: string; slug: string }>;
}): Promise<Metadata> {
  const { site: siteSlug, slug } = await params;
  const [product, site] = await Promise.all([
    getProductBySlug(siteSlug, slug),
    getSite(siteSlug),
  ]);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | ${site.brand}`,
      description: product.summary,
      url: `https://${site.domain}/products/${product.slug}`,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ site: string; slug: string }>;
}) {
  const { site: siteSlug, slug } = await params;
  const [product, site] = await Promise.all([
    getProductBySlug(siteSlug, slug),
    getSite(siteSlug),
  ]);
  if (!product) notFound();

  const [category, related] = await Promise.all([
    getCategoryBySlug(siteSlug, product.categorySlug),
    getRelatedProducts(siteSlug, product, 3),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.summary,
    category: category?.name,
    brand: { "@type": "Brand", name: site.brand },
    manufacturer: { "@type": "Organization", name: site.name },
    additionalProperty: product.specs.map((s) => ({
      "@type": "PropertyValue",
      name: s.label,
      value: s.value,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `https://${site.domain}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `https://${site.domain}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://${site.domain}/products/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* 面包屑 */}
      <div className="border-b border-slate-200 bg-slate-50">
        <Container>
          <nav className="py-3.5 text-xs text-slate-500">
            <Link href="/" className="transition hover:text-brand-700">
              Home
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <Link href="/products" className="transition hover:text-brand-700">
              Products
            </Link>
            {category && (
              <>
                <span className="mx-2 text-slate-300">/</span>
                <Link
                  href={`/products?category=${category.slug}`}
                  className="transition hover:text-brand-700"
                >
                  {category.name}
                </Link>
              </>
            )}
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-700">{product.name}</span>
          </nav>
        </Container>
      </div>

      {/* 主信息 */}
      <Section className="py-10! sm:py-14!">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* 图 */}
          <div>
            <Photo
              caption={product.imageCaption}
              src={product.image?.url}
              alt={product.image?.alt || product.name}
              ratio="aspect-[4/3]"
              className="rounded-lg border border-slate-200"
            />
            <div className="mt-4 grid grid-cols-4 gap-3">
              {(product.gallery && product.gallery.length > 0
                ? product.gallery.slice(1, 5)
                : ["Detail view", "Handle close-up", "Packaging", "In use"].map(
                    (t) => ({ url: null as string | null, alt: t }),
                  )
              ).map((g, i) => (
                <Photo
                  key={`${g.alt}-${i}`}
                  caption={g.alt}
                  src={g.url ?? undefined}
                  alt={g.alt}
                  ratio="aspect-square"
                  className="rounded border border-slate-200"
                />
              ))}
            </div>
          </div>

          {/* 信息 */}
          <div>
            {category && (
              <Link
                href={`/products?category=${category.slug}`}
                className="text-xs font-bold uppercase tracking-wide text-brand-500 hover:text-brand-700"
              >
                {category.name}
              </Link>
            )}
            <h1 className="mt-2 text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-400">
              Item No. {product.sku}
            </p>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              {product.summary}
            </p>

            <ul className="mt-6 space-y-2.5">
              {product.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-sm text-slate-700"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-bold text-brand-700">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {/* 关键信息 */}
            <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 text-sm">
              <div className="bg-white px-4 py-3">
                <dt className="text-xs text-slate-500">MOQ</dt>
                <dd className="mt-0.5 font-bold text-slate-900">
                  {product.moq}
                </dd>
              </div>
              <div className="bg-white px-4 py-3">
                <dt className="text-xs text-slate-500">Lead time</dt>
                <dd className="mt-0.5 font-bold text-slate-900">
                  {product.leadTime}
                </dd>
              </div>
            </dl>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#inquiry"
                className="inline-flex items-center justify-center rounded bg-accent-500 px-7 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-accent-600"
              >
                Send Inquiry
              </a>
              <a
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
                  `Hello, I am interested in ${product.name} (${product.sku}).`,
                )}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center rounded bg-green-600 px-7 py-3.5 text-base font-bold text-white transition hover:bg-green-700"
              >
                WhatsApp
              </a>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Free samples available — you only cover the courier cost, refunded
              on your first order.
            </p>
          </div>
        </div>
      </Section>

      {/* 描述 */}
      <Section bg="slate">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-900">
              Product description
            </h2>
            <div className="mt-5 space-y-4">
              {product.description.map((p) => (
                <p key={p} className="text-sm leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
            </div>

            <h2 className="mt-10 text-xl font-bold text-slate-900">
              OEM &amp; ODM options
            </h2>
            <ul className="mt-5 space-y-2.5 text-sm text-slate-600">
              {[
                "Laser marking or pad printing with your logo",
                "Custom colour to your RAL number",
                "Retail packaging design — blister, colour box, blow case, display carton",
                "Barcode and hang tab for retail channels",
                "Custom size range or piece count in a set",
              ].map((o) => (
                <li key={o} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                  {o}
                </li>
              ))}
            </ul>
          </div>

          {/* 规格表 */}
          <div>
            <div className="rounded-lg border border-slate-200 bg-white">
              <h2 className="border-b border-slate-200 px-5 py-4 text-base font-bold text-slate-900">
                Specifications
              </h2>
              <dl className="divide-y divide-slate-100">
                {product.specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex justify-between gap-4 px-5 py-3 text-sm"
                  >
                    <dt className="text-slate-500">{s.label}</dt>
                    <dd className="text-right font-medium text-slate-900">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-5 rounded-lg border border-brand-100 bg-brand-50 p-5">
              <p className="text-sm font-bold text-brand-900">
                Need a datasheet?
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-800/80">
                We can send a full PDF datasheet with dimensions, packing
                details and test reports.
              </p>
              <a
                href="#inquiry"
                className="mt-3 inline-block text-sm font-bold text-brand-700 hover:underline"
              >
                Request datasheet →
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* 询盘 */}
      <Section id="inquiry">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Get a Quotation"
              title="Tell us your quantity and destination port"
              desc="We will come back with an FOB price, packing details and lead time — usually within 12 working hours."
              center={false}
            />
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <p className="font-bold text-slate-900">Helpful to include:</p>
              <ul className="mt-3 space-y-2">
                {[
                  "Item number and size range",
                  "Quantity per size",
                  "Packaging preference",
                  "Destination port",
                  "Whether you need your logo on the product",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <InquiryForm productName={product.name} productSlug={product.slug} />
        </div>
      </Section>

      {/* 相关产品 */}
      {related.length > 0 && (
        <Section bg="slate">
          <SectionHeading
            eyebrow="More in this range"
            title={`Other ${category?.name ?? "products"}`}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
