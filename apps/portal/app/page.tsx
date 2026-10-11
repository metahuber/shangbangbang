import Link from "next/link";
import { Section, SectionHeading, CtaLink } from "@/components/Section";
import ProductCard from "@/components/ProductCard";
import SolutionCard from "@/components/SolutionCard";
import FaqList from "@/components/FaqList";
import HeroMockup from "@/components/HeroMockup";
import LeadForm from "@/components/LeadForm";
import { site, CTA } from "@/content/site";
import { home } from "@/content/pages/home";
import { sortedProducts } from "@/content/products";
import { sortedSolutions } from "@/content/solutions";
import { homepageFaqs } from "@/content/faqs";
import { processSteps, websiteTiers, priceNotes } from "@/content/pricing";
import { sortedCases } from "@/content/cases";

export default function HomePage() {
  const products = sortedProducts();
  const solutions = sortedSolutions();
  const cases = sortedCases();

  return (
    <>
      {/* ========== 1. 首屏 ========== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold text-brand-700">
              {home.hero.badge}
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              {site.tagline}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {site.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink href="/contact" size="lg">
                {CTA.primary}
              </CtaLink>
              <CtaLink href="/cases" variant="secondary" size="lg">
                {CTA.secondary}
              </CtaLink>
            </div>

            <p className="mt-4 text-sm text-slate-500">{home.hero.note}</p>
          </div>

          <div className="lg:pl-4">
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* ========== 2. 信任条 ========== */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-slate-200 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {site.stats.map((s) => (
            <div key={s.label} className="px-4 py-6 text-center">
              <p className="text-2xl font-bold text-brand-700">{s.value}</p>
              <p className="mt-1 text-sm text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== 3. 痛点共鸣 ========== */}
      <Section bg="slate">
        <SectionHeading eyebrow={home.pains.eyebrow} title={home.pains.title} />
        <div className="grid gap-6 md:grid-cols-3">
          {home.pains.items.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <span className="text-2xl">{p.icon}</span>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-lg font-semibold text-slate-800">
          {home.pains.closing}
        </p>
      </Section>

      {/* ========== 4. 产品矩阵 ========== */}
      <Section>
        <SectionHeading
          eyebrow={home.products.eyebrow}
          title={home.products.title}
          desc={home.products.desc}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <CtaLink href="/products" variant="secondary">
            {home.products.more}
          </CtaLink>
        </div>
      </Section>

      {/* ========== 5. 解决方案入口 ========== */}
      <Section bg="slate">
        <SectionHeading
          eyebrow={home.solutions.eyebrow}
          title={home.solutions.title}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {solutions.map((s) => (
            <SolutionCard key={s.slug} solution={s} />
          ))}
        </div>
      </Section>

      {/* ========== 6. 交付流程 ========== */}
      <Section>
        <SectionHeading
          eyebrow={home.process.eyebrow}
          title={home.process.title}
        />
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">步骤</th>
                <th className="px-4 py-3 font-semibold">做什么</th>
                <th className="px-4 py-3 font-semibold">你拿到什么</th>
                <th className="px-4 py-3 font-semibold">用时</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {processSteps.map((s) => (
                <tr key={s.step} className="bg-white">
                  <td className="px-4 py-3 font-semibold text-brand-700">
                    {s.step}
                  </td>
                  <td className="px-4 py-3 text-slate-800">{s.title}</td>
                  <td className="px-4 py-3 text-slate-600">{s.deliverable}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {s.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-center text-base font-semibold text-slate-800">
          {home.process.closing}
        </p>
      </Section>

      {/* ========== 7. 案例 ========== */}
      <Section bg="slate">
        <SectionHeading
          eyebrow={home.cases.eyebrow}
          title={home.cases.title}
          desc={home.cases.desc}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {cases.map((c) => (
            <div
              key={c.slug}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-6"
            >
              <div className="flex items-center gap-2">
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
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                {c.solution}
              </p>
              <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                {c.location}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <CtaLink href="/cases" variant="secondary">
            {home.cases.more}
          </CtaLink>
        </div>
      </Section>

      {/* ========== 8. 价格 ========== */}
      <Section>
        <SectionHeading
          eyebrow={home.pricing.eyebrow}
          title={home.pricing.title}
          desc={home.pricing.desc}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {websiteTiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-xl border p-6 ${
                t.highlight
                  ? "border-brand-400 bg-brand-50/50 shadow-md"
                  : "border-slate-200 bg-white"
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-0.5 text-xs font-semibold text-white">
                  最受欢迎
                </span>
              )}
              <h3 className="text-lg font-bold text-slate-900">{t.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{t.forWho}</p>
              <p className="mt-5 text-2xl font-bold text-slate-900">
                {t.price}
                <span className="ml-1 text-sm font-normal text-slate-500">
                  {t.unit}
                </span>
              </p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-600">
                {t.features.slice(0, 6).map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-brand-600">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <CtaLink
                href="/pricing"
                className="mt-6 w-full"
                variant={t.highlight ? "primary" : "secondary"}
              >
                {home.pricing.cta}
              </CtaLink>
            </div>
          ))}
        </div>
        <ul className="mx-auto mt-8 max-w-3xl space-y-1.5 text-center text-xs text-slate-500">
          {priceNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </Section>

      {/* ========== 9. 为什么选商帮帮 ========== */}
      <Section bg="slate">
        <SectionHeading eyebrow={home.why.eyebrow} title={home.why.title} />
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700"></th>
                {home.why.columns.map((col, i) => (
                  <th
                    key={col}
                    className={`px-4 py-3 font-semibold ${
                      i === home.why.columns.length - 1
                        ? "text-brand-700"
                        : "text-slate-700"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {home.why.rows.map((row) => (
                <tr key={row.label}>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {row.label}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.self}</td>
                  <td className="px-4 py-3 text-slate-600">{row.outsource}</td>
                  <td className="px-4 py-3 text-slate-600">{row.platform}</td>
                  <td className="bg-brand-50/60 px-4 py-3 font-semibold text-brand-800">
                    {row.us}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ========== 10. 常见问题 ========== */}
      <Section>
        <SectionHeading eyebrow={home.faq.eyebrow} title={home.faq.title} />
        <FaqList items={homepageFaqs} />
        <div className="mt-8 text-center">
          <Link
            href="/faq"
            className="text-sm font-semibold text-brand-700 hover:underline"
          >
            {home.faq.more}
          </Link>
        </div>
      </Section>

      {/* ========== 11. 底部 CTA ========== */}
      <Section bg="brand" id="contact-cta">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {home.cta.title}
            </h2>
            <p className="mt-4 text-base text-slate-300">{home.cta.desc}</p>

            <div className="mt-8 space-y-3 text-sm text-slate-200">
              <p>{home.cta.line1}</p>
              <p className="text-slate-400">{home.cta.line2}</p>
            </div>
          </div>

          <LeadForm />
        </div>
      </Section>
    </>
  );
}
