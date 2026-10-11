import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading, CtaLink } from "@/components/Section";
import { sortedCases } from "@/content/cases";
import { getProduct } from "@/content/products";
import { CTA } from "@/content/site";

export const metadata: Metadata = {
  title: "客户案例",
  description:
    "外贸工厂、本地商铺、产业带工厂的真实需求与做法。首批客户上线后将替换为真实案例与真实数据。",
};

export default function CasesPage() {
  const cases = sortedCases();
  const hasSample = cases.some((c) => c.isSample);

  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "首页" }, { label: "客户案例" }]}
        eyebrow="不吹牛，看结果"
        title="客户案例"
        desc="这里展示的是我们怎么做、交付什么。首批客户上线后会替换成真实案例与真实数据。"
      >
        <div className="mt-7">
          <CtaLink href="/contact" size="lg">
            {CTA.primary}
          </CtaLink>
        </div>
      </PageHero>

      {hasSample && (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="mx-auto max-w-6xl px-4 py-3 text-sm text-amber-800">
            ⚠️ 我们刚开始做，下面标注「样板案例」的是展示做法的样例，
            不是真实客户。等真实客户上线后，这里会换成他们的真实数据和评价。
          </div>
        </div>
      )}

      <Section>
        <div className="space-y-8">
          {cases.map((c) => {
            const related = c.productSlugs
              .map((s) => getProduct(s))
              .filter((p): p is NonNullable<typeof p> => Boolean(p));

            return (
              <article
                key={c.slug}
                className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                    {c.industry}
                  </span>
                  <span className="text-xs text-slate-500">{c.location}</span>
                  {c.isSample && (
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                      样板案例
                    </span>
                  )}
                </div>

                <h2 className="mt-3 text-xl font-bold text-slate-900">
                  {c.client}
                </h2>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      原来的问题
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {c.problem}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      我们做了什么
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-800">
                      {c.solution}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 border-y border-slate-100 py-4">
                  {c.metrics.map((m) => (
                    <div key={m.label}>
                      <p className="text-lg font-bold text-brand-700">
                        {m.value}
                      </p>
                      <p className="text-xs text-slate-500">{m.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500">用到的产品：</span>
                  {related.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/products/${p.slug}`}
                      className="rounded-full border border-slate-200 px-2.5 py-0.5 text-xs text-slate-700 hover:border-brand-300 hover:text-brand-700"
                    >
                      {p.emoji} {p.name}
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      <Section bg="slate">
        <SectionHeading
          eyebrow="想成为下一个案例？"
          title="先聊十分钟，不收费"
          desc="把你的行业和现在遇到的问题告诉我们，我们给你一份初步方案。"
        />
        <div className="text-center">
          <CtaLink href="/contact" size="lg">
            {CTA.primary}
          </CtaLink>
        </div>
      </Section>
    </>
  );
}
