import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading, CtaLink } from "@/components/Section";
import { site, CTA, TBD } from "@/content/site";
import { processSteps } from "@/content/pricing";
import { about } from "@/content/pages/about";

export const metadata: Metadata = {
  title: "关于我们",
  description:
    "商帮帮只做一件事：帮工厂和商铺把生意搬到线上。我们怎么做事、我们不做的事。",
};

export default function AboutPage() {
  const companyKnown = site.companyName !== TBD;

  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "首页" }, { label: "关于我们" }]}
        eyebrow={about.hero.eyebrow}
        title={about.hero.title}
        desc={site.slogan}
      >
        <div className="mt-7">
          <CtaLink href="/contact" size="lg">
            {CTA.primary}
          </CtaLink>
        </div>
      </PageHero>

      {/* ===== 为什么做商帮帮 ===== */}
      <Section>
        <div className="mx-auto max-w-3xl space-y-6 text-base leading-relaxed text-slate-700">
          <h2 className="text-xl font-bold text-slate-900">{about.why.title}</h2>

          {about.why.draftMode ? (
            <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-6 text-sm text-amber-900">
              <p className="font-semibold">{about.why.draftTitle}</p>
              <p className="mt-2">{about.why.draftDesc}</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                {about.why.draftQuestions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
              <p className="mt-3">{about.why.draftFooter}</p>
            </div>
          ) : (
            about.why.paragraphs.map((p) => <p key={p}>{p}</p>)
          )}
        </div>
      </Section>

      {/* ===== 团队 ===== */}
      <Section bg="slate">
        <SectionHeading eyebrow={about.team.eyebrow} title={about.team.title} />
        <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-700">
          {about.team.draftMode ? (
            <>
              <p>{about.team.draftPlaceholder}</p>
              <p className="mt-3 text-slate-500">{about.team.draftHint}</p>
            </>
          ) : (
            about.team.paragraphs.map((p) => (
              <p key={p} className="mt-2 first:mt-0">
                {p}
              </p>
            ))
          )}
        </div>
      </Section>

      {/* ===== 我们怎么做事 ===== */}
      <Section>
        <SectionHeading
          eyebrow={about.principles.eyebrow}
          title={about.principles.title}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          {about.principles.items.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== 我们不做的事 ===== */}
      <Section bg="slate">
        <SectionHeading
          eyebrow={about.weDont.eyebrow}
          title={about.weDont.title}
        />
        <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6">
          <ul className="space-y-3 text-sm text-slate-700">
            {about.weDont.items.map((w) => (
              <li key={w} className="flex items-start gap-3">
                <span className="mt-0.5 text-slate-400">—</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ===== 交付流程 ===== */}
      <Section>
        <SectionHeading
          eyebrow={about.process.eyebrow}
          title={about.process.title}
        />
        <div className="mx-auto max-w-3xl space-y-3">
          {processSteps.map((s) => (
            <div
              key={s.step}
              className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-5 py-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {s.step}
              </span>
              <span className="flex-1 text-sm font-medium text-slate-900">
                {s.title}
              </span>
              <span className="hidden text-sm text-slate-600 sm:block">
                {s.deliverable}
              </span>
              <span className="whitespace-nowrap text-xs text-slate-500">
                {s.duration}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== CTA ===== */}
      <Section bg="brand">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {about.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300">
            {about.cta.desc}
          </p>
          <div className="mt-8">
            <CtaLink href="/contact" size="lg">
              {CTA.primary}
            </CtaLink>
          </div>
          {companyKnown && (
            <p className="mt-6 text-xs text-slate-400">
              运营主体：{site.companyName}
            </p>
          )}
        </div>
      </Section>
    </>
  );
}
