import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading, CtaLink } from "@/components/Section";
import ProductCard from "@/components/ProductCard";
import { sortedProducts } from "@/content/products";
import { CTA } from "@/content/site";

export const metadata: Metadata = {
  title: "产品",
  description:
    "商帮帮的产品线：通用版外贸网站、门店小程序、电子名片与数字展厅、AI 营销素材、多语言本地化、询盘管理 CRM、域名邮箱托管。",
};

export default function ProductsPage() {
  const products = sortedProducts();

  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "首页" }, { label: "产品" }]}
        eyebrow="产品总览"
        title="从建站到获客，你要的东西都在这里"
        desc="我们不做一次性项目，做的是能长期用的工具。每个产品都可以单独用，也可以组合起来用。"
      >
        <div className="mt-7">
          <CtaLink href="/contact" size="lg">
            {CTA.primary}
          </CtaLink>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Section>

      <Section bg="slate">
        <SectionHeading
          eyebrow="不知道选哪个？"
          title="直接说你的情况，我们帮你判断"
          desc="不用自己研究产品，把行业和现在遇到的问题告诉我们，我们给你一份初步方案。"
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
