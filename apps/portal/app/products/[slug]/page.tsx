import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading, CtaLink } from "@/components/Section";
import FaqList from "@/components/FaqList";
import LeadForm from "@/components/LeadForm";
import { products, getProduct } from "@/content/products";
import { cases } from "@/content/cases";
import { site, CTA } from "@/content/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "产品未找到" };
  return {
    title: product.name,
    description: product.tagline,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name}｜${site.name}`,
      description: product.tagline,
      url: `${site.url}/products/${product.slug}`,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const relatedCases = cases.filter((c) =>
    c.productSlugs.includes(product.slug),
  );
  const otherProducts = products.filter((p) => p.slug !== product.slug);

  const faqJsonLd = product.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: product.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: product.name,
    description: product.tagline,
    serviceType: product.name,
    provider: { "@type": "Organization", name: site.name, url: site.url },
    audience: { "@type": "Audience", audienceType: product.audience },
    areaServed: "CN",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <PageHero
        crumbs={[
          { href: "/", label: "首页" },
          { href: "/products", label: "产品" },
          { label: product.name },
        ]}
        eyebrow={`${product.emoji} ${product.isFree ? "免费产品" : "产品"}`}
        title={product.name}
        desc={product.tagline}
      >
        <div className="mt-7 flex flex-wrap gap-3">
          <CtaLink href="/contact" size="lg">
            {CTA.product}
          </CtaLink>
          <CtaLink href="/pricing" variant="secondary" size="lg">
            查看价格档位
          </CtaLink>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          适用对象：{product.audience}
        </p>
      </PageHero>

      {/* 你现在的困扰 */}
      <Section>
        <SectionHeading eyebrow="先看看是不是你" title="你现在的困扰" />
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
          {product.pains.map((p) => (
            <div
              key={p}
              className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-700"
            >
              {p}
            </div>
          ))}
        </div>
      </Section>

      {/* 功能清单 */}
      <Section bg="slate">
        <SectionHeading eyebrow="能做什么" title="功能清单" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {product.featureGroups.map((g) => (
            <div
              key={g.group}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <h3 className="text-sm font-bold text-brand-700">{g.group}</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {g.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className="text-brand-500">✓</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* 交付物 */}
      <Section>
        <SectionHeading eyebrow="你会拿到什么" title="交付物清单" />
        <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6">
          <ul className="space-y-3 text-sm text-slate-700">
            {product.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs text-green-700">
                  ✓
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-sm text-slate-600">
              价格：<span className="font-semibold text-slate-900">{product.priceNote}</span>
              {!product.isFree && (
                <>
                  {" "}
                  ·{" "}
                  <Link
                    href="/pricing"
                    className="font-medium text-brand-700 hover:underline"
                  >
                    查看完整档位 →
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </Section>

      {/* 相关案例 */}
      {relatedCases.length > 0 && (
        <Section bg="slate">
          <SectionHeading eyebrow="实际怎么用的" title="相关案例" />
          <div className="grid gap-6 md:grid-cols-2">
            {relatedCases.map((c) => (
              <div
                key={c.slug}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                    {c.industry}
                  </span>
                  {c.isSample && (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      样板案例
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-base font-bold text-slate-900">
                  {c.client}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {c.problem}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-800">
                  {c.solution}
                </p>
                <Link
                  href="/cases"
                  className="mt-4 inline-block text-sm font-medium text-brand-700 hover:underline"
                >
                  查看案例 →
                </Link>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* FAQ */}
      {product.faqs.length > 0 && (
        <Section>
          <SectionHeading eyebrow="你可能想问" title="常见问题" />
          <FaqList items={product.faqs} />
        </Section>
      )}

      {/* 其他产品 */}
      <Section bg="slate">
        <SectionHeading eyebrow="还可以看看" title="其他产品" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {otherProducts.slice(0, 6).map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-4 text-sm hover:border-brand-300"
            >
              <span className="mr-2">{p.emoji}</span>
              <span className="font-medium text-slate-900">{p.name}</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section bg="brand">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              想先聊聊你的情况？
            </h2>
            <p className="mt-4 text-base text-slate-300">
              不收费、不推销。留下联系方式，我们 24 小时内回你一份初步方案。
            </p>
          </div>
          <LeadForm compact />
        </div>
      </Section>
    </>
  );
}
