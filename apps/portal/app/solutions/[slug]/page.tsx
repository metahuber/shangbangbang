import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading, CtaLink } from "@/components/Section";
import LeadForm from "@/components/LeadForm";
import { solutions, getSolution } from "@/content/solutions";
import { getProduct } from "@/content/products";
import { site } from "@/content/site";

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return { title: "解决方案未找到" };
  return {
    title: solution.name,
    description: solution.heroTitle,
    alternates: { canonical: `/solutions/${solution.slug}` },
    openGraph: {
      title: `${solution.name}｜${site.name}`,
      description: solution.heroTitle,
      url: `${site.url}/solutions/${solution.slug}`,
    },
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  const relatedProducts = solution.productSlugs
    .map((s) => getProduct(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "首页" },
          { href: "/solutions", label: "解决方案" },
          { label: solution.name },
        ]}
        eyebrow={`${solution.emoji} ${solution.name}`}
        title={solution.heroTitle}
        desc={solution.shortDesc}
      >
        <div className="mt-7">
          <CtaLink href="/contact" size="lg">
            {solution.cta}
          </CtaLink>
        </div>
      </PageHero>

      {/* 痛点 */}
      <Section>
        <SectionHeading eyebrow="你现在的情况" title="这些情况你中了几条？" />
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {solution.pains.map((p) => (
            <div
              key={p}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-700"
            >
              <span className="mt-0.5 text-slate-400">✕</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 方案四步 */}
      <Section bg="slate">
        <SectionHeading eyebrow="我们怎么做" title="分四步，一步步来" />
        <div className="mx-auto max-w-3xl space-y-4">
          {solution.plan.map((step, i) => (
            <div
              key={step.title}
              className="flex gap-5 rounded-xl border border-slate-200 bg-white p-6"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 交付物 */}
      <Section>
        <SectionHeading eyebrow="你会拿到什么" title="交付物清单" />
        <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6">
          <ul className="space-y-3 text-sm text-slate-700">
            {solution.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs text-green-700">
                  ✓
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 用到的产品 */}
      <Section bg="slate">
        <SectionHeading eyebrow="用到哪些产品" title="这套方案用到的产品" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {relatedProducts.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-md"
            >
              <span className="text-2xl">{p.emoji}</span>
              <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-brand-700">
                {p.name}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{p.summary}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section bg="brand">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {solution.cta}
            </h2>
            <p className="mt-4 text-base text-slate-300">
              留下联系方式，我们 24 小时内给你回一份初步方案。不收费、不推销。
            </p>
          </div>
          <LeadForm compact />
        </div>
      </Section>
    </>
  );
}
