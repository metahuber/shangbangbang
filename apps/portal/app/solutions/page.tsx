import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading, CtaLink } from "@/components/Section";
import SolutionCard from "@/components/SolutionCard";
import { sortedSolutions } from "@/content/solutions";
import { CTA } from "@/content/site";

export const metadata: Metadata = {
  title: "解决方案",
  description:
    "按你的生意类型给方案：外贸工厂、本地商铺、连锁品牌、产业带工厂。",
};

export default function SolutionsPage() {
  const solutions = sortedSolutions();

  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "首页" }, { label: "解决方案" }]}
        eyebrow="按你的情况看"
        title="你是什么生意？我们按你的情况给方案"
        desc="同一套产品，不同的生意用法不一样。先说你是什么生意，我们再说怎么用。"
      >
        <div className="mt-7">
          <CtaLink href="/contact" size="lg">
            {CTA.primary}
          </CtaLink>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          {solutions.map((s) => (
            <SolutionCard key={s.slug} solution={s} />
          ))}
        </div>
      </Section>

      <Section bg="slate">
        <SectionHeading
          eyebrow="没找到你的情况？"
          title="说出来就行，不用对号入座"
          desc="你的生意可能不属于上面任何一类，没关系。把情况讲清楚，我们照样能给方案。"
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
