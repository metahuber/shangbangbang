import Link from "next/link";
import { Section, SectionHeading, Container } from "@/components/Section";
import Photo from "@/components/Photo";
import ProductCard from "@/components/ProductCard";
import FaqList from "@/components/FaqList";
import InquiryForm from "@/components/InquiryForm";
import {
  getSite,
  getHeroPoints,
  getStats,
  getCategories,
  getCategoryCounts,
  getFeaturedProducts,
  getCapabilities,
  getCertificates,
  getWhyUs,
  getFaqs,
} from "@/lib/cms";

export default async function HomePage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site: siteSlug } = await params;
  const [
    site,
    heroPoints,
    stats,
    categories,
    counts,
    featured,
    capabilities,
    certificates,
    whyUs,
    faqs,
  ] = await Promise.all([
    getSite(siteSlug),
    getHeroPoints(siteSlug),
    getStats(siteSlug),
    getCategories(siteSlug),
    getCategoryCounts(siteSlug),
    getFeaturedProducts(siteSlug),
    getCapabilities(siteSlug),
    getCertificates(siteSlug),
    getWhyUs(siteSlug),
    getFaqs(siteSlug),
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ═══════════ 1. 首屏 ═══════════ */}
      <section className="relative overflow-hidden bg-brand-950">
        {/* 背景：工业感的网格纹理 */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-600/20 blur-3xl" />

        <Container className="relative py-16 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-accent-400">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                Manufacturer since {site.founded}
              </span>

              <h1 className="mt-6 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
                {site.tagline}
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                {site.description}
              </p>

              <ul className="mt-8 space-y-3">
                {heroPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500/15 text-[11px] font-bold text-accent-400">
                      ✓
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded bg-accent-500 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-accent-900/20 transition hover:bg-accent-600"
                >
                  Request a Quote
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded border border-white/25 px-7 py-3.5 text-base font-bold text-white transition hover:bg-white/10"
                >
                  Browse Products
                </Link>
              </div>
            </div>

            <div>
              <Photo
                caption="Workshop hero photo · 1600×1200"
                ratio="aspect-[4/3]"
                className="rounded-lg shadow-2xl ring-1 ring-white/10"
              />
              <div className="mt-4 grid grid-cols-3 gap-3">
                {["Forging", "CNC machining", "Assembly"].map((t) => (
                  <Photo
                    key={t}
                    caption={t}
                    ratio="aspect-[4/3]"
                    className="rounded ring-1 ring-white/10"
                  />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════ 2. 数据条 + 认证 ═══════════ */}
      <section className="border-b border-slate-200 bg-white">
        <Container>
          <div className="grid grid-cols-2 divide-slate-200 py-8 sm:grid-cols-4 sm:divide-x">
            {stats.map((s) => (
              <div key={s.label} className="px-4 py-3 text-center">
                <p className="text-3xl font-black text-brand-800">{s.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
        <div className="border-t border-slate-100 bg-slate-50">
          <Container>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Certified by
              </span>
              {certificates.map((c) => (
                <span
                  key={c.name}
                  className="text-sm font-bold text-slate-600"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </Container>
        </div>
      </section>

      {/* ═══════════ 3. 产品分类 ═══════════ */}
      <Section>
        <SectionHeading
          eyebrow="Product Range"
          title="Our product range"
          desc="Every item is produced in our own factory, so we control the process from raw material to packed carton."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/products?category=${c.slug}`}
              className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg"
            >
              <Photo
                caption={c.imageCaption}
                src={c.image?.url}
                alt={c.image?.alt || c.name}
                ratio="aspect-[4/3]"
                className="border-b border-slate-100"
              />
              <div className="p-5">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700">
                  {c.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {c.summary}
                </p>
                <p className="mt-3 text-xs font-semibold text-brand-600">
                  {counts[c.slug] ?? 0} items →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ═══════════ 4. 主推产品 ═══════════ */}
      <Section bg="slate">
        <SectionHeading
          eyebrow="Best Sellers"
          title="Items our buyers reorder most"
          desc="These are the models that keep coming back in repeat orders. Ask for a sample and check the quality yourself."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center rounded border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition hover:border-brand-400 hover:text-brand-700"
          >
            View all products
          </Link>
        </div>
      </Section>

      {/* ═══════════ 5. 工厂生产能力 ═══════════ */}
      <Section bg="dark">
        <SectionHeading
          eyebrow="Inside the Factory"
          title="From raw material to packed carton — all under one roof"
          desc="Buyers ask one question more than any other: are you a real factory? Here is what we run."
          invert
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap) => (
            <div
              key={cap.name}
              className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]"
            >
              <Photo
                caption={cap.imageCaption}
                src={cap.image?.url}
                alt={cap.name}
                ratio="aspect-[16/10]"
                className="opacity-90"
              />
              <div className="p-5">
                <h3 className="text-base font-bold text-white">{cap.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {cap.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/factory"
            className="inline-flex items-center rounded border border-white/25 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
          >
            Take a closer look at our factory
          </Link>
        </div>
      </Section>

      {/* ═══════════ 6. 为什么选我们 ═══════════ */}
      <Section>
        <SectionHeading
          eyebrow="Why Buyers Work With Us"
          title="Why buyers work with us"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((w, i) => (
            <div
              key={w.title}
              className="rounded-lg border border-slate-200 bg-white p-6"
            >
              <span className="text-sm font-black text-accent-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base font-bold text-slate-900">
                {w.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {w.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════ 7. 认证 ═══════════ */}
      <Section bg="slate">
        <SectionHeading
          eyebrow="Quality & Compliance"
          title="Certificates your customers will ask for"
          desc="Full documentation package provided with every shipment."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {certificates.map((c) => (
            <div
              key={c.name}
              className="rounded-lg border border-slate-200 bg-white p-5 text-center"
            >
              <Photo
                caption={`${c.name} certificate`}
                src={c.image?.url}
                alt={c.name}
                ratio="aspect-[4/3]"
                className="rounded border border-slate-100"
              />
              <h3 className="mt-3 text-sm font-bold text-slate-900">
                {c.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">{c.issuer}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/quality"
            className="text-sm font-bold text-brand-700 hover:underline"
          >
            See our full quality control process →
          </Link>
        </div>
      </Section>

      {/* ═══════════ 8. 常见问题 ═══════════ */}
      <Section>
        <SectionHeading
          eyebrow="Before You Ask"
          title="Questions buyers ask us every week"
        />
        <FaqList items={faqs} />
      </Section>

      {/* ═══════════ 9. 询盘 ═══════════ */}
      <Section bg="dark" id="inquiry">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-accent-400">
              Get in Touch
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Tell us what you need — we will reply within 12 hours
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-300">
              Send us the item, size, packaging and destination port. Our export
              team will come back with a quotation and lead time.
            </p>

            <div className="mt-8 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-accent-400">✉</span>
                <a
                  href={`mailto:${site.email}`}
                  className="text-slate-200 transition hover:text-white"
                >
                  {site.email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent-400">☎</span>
                <a
                  href={`tel:${site.phone}`}
                  className="text-slate-200 transition hover:text-white"
                >
                  {site.phone}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent-400">⌖</span>
                <span className="text-slate-300">{site.address}</span>
              </div>
            </div>
          </div>

          <InquiryForm />
        </div>
      </Section>
    </>
  );
}
