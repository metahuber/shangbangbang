import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading, CtaLink } from "@/components/Section";
import FaqList from "@/components/FaqList";
import LeadForm from "@/components/LeadForm";
import type { PriceTier } from "@/content/pricing";
import { websiteTiers, miniappTiers, priceNotes } from "@/content/pricing";
import { pricingPage } from "@/content/pages/pricing";
import { getProduct } from "@/content/products";
import { CTA } from "@/content/site";

export const metadata: Metadata = {
  title: "价格",
  description:
    "商帮帮产品价格：外贸网站与门店小程序的档位与包含内容。明码标价，第三方费用按实收不加价。",
};

function TierCards({ tiers }: { tiers: PriceTier[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {tiers.map((t) => (
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
          <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-700">
            {t.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-brand-600">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <CtaLink
            href="/contact"
            className="mt-6 w-full"
            variant={t.highlight ? "primary" : "secondary"}
          >
            {CTA.pricing}
          </CtaLink>
        </div>
      ))}
    </div>
  );
}

export default function PricingPage() {
  // 增值与配套表格：产品名和价格都来自 content/products.ts，这里不重复维护
  const extraRows = pricingPage.extra.productSlugs
    .map((slug) => getProduct(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ name: p.name, price: p.isFree ? "免费" : p.priceNote }));

  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "首页" }, { label: "价格" }]}
        eyebrow={pricingPage.hero.eyebrow}
        title={pricingPage.hero.title}
        desc={pricingPage.hero.desc}
      >
        <div className="mt-7">
          <CtaLink href="/contact" size="lg">
            {CTA.primary}
          </CtaLink>
        </div>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow={pricingPage.website.eyebrow}
          title={pricingPage.website.title}
          desc={pricingPage.website.desc}
        />
        <TierCards tiers={websiteTiers} />
      </Section>

      <Section bg="slate">
        <SectionHeading
          eyebrow={pricingPage.miniapp.eyebrow}
          title={pricingPage.miniapp.title}
          desc={pricingPage.miniapp.desc}
        />
        <TierCards tiers={miniappTiers} />
      </Section>

      <Section>
        <SectionHeading
          eyebrow={pricingPage.extra.eyebrow}
          title={pricingPage.extra.title}
        />
        <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-5 py-3 font-semibold">产品</th>
                <th className="px-5 py-3 font-semibold">价格</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {extraRows.map((r) => (
                <tr key={r.name} className="bg-white">
                  <td className="px-5 py-3 text-slate-800">{r.name}</td>
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {r.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="mx-auto mt-8 max-w-3xl space-y-1.5 text-center text-xs text-slate-500">
          {priceNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </Section>

      <Section bg="slate">
        <SectionHeading
          eyebrow={pricingPage.faq.eyebrow}
          title={pricingPage.faq.title}
        />
        <FaqList items={pricingPage.faq.items} />
      </Section>

      <Section>
        <SectionHeading
          eyebrow={pricingPage.cta.eyebrow}
          title={pricingPage.cta.title}
          desc={pricingPage.cta.desc}
        />
        <div className="mx-auto max-w-xl">
          <LeadForm compact />
        </div>
      </Section>
    </>
  );
}
