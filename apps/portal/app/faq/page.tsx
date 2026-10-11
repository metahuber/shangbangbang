import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading, CtaLink } from "@/components/Section";
import FaqList from "@/components/FaqList";
import { faqs } from "@/content/faqs";
import { CTA, site } from "@/content/site";

export const metadata: Metadata = {
  title: "常见问题",
  description:
    "关于建站、小程序、交付时间、后期维护、费用与发票的常见问题解答。",
};

export default function FaqPage() {
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

      <PageHero
        crumbs={[{ href: "/", label: "首页" }, { label: "常见问题" }]}
        eyebrow="你可能想问"
        title="常见问题"
        desc="这里没找到答案的，直接来问我们，不用客气。"
      />

      <Section>
        <FaqList items={faqs} />
      </Section>

      <Section bg="slate">
        <SectionHeading
          eyebrow="还有问题？"
          title="直接问就行"
          desc="不用先想好怎么问，把情况说清楚，我们给你判断。"
        />
        <div className="text-center">
          <CtaLink href="/contact" size="lg">
            {CTA.primary}
          </CtaLink>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          也可以直接访问 {site.domain}
        </p>
      </Section>
    </>
  );
}
