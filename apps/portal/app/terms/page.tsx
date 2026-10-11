import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Section } from "@/components/Section";
import LegalBody from "@/components/LegalBody";
import { terms } from "@/content/pages/legal";

export const metadata: Metadata = {
  title: "服务条款",
  description: "商帮帮提供服务的条款说明。",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "首页" }, { label: terms.title }]}
        title={terms.title}
        desc={`最近更新：${new Date().getFullYear()} 年`}
      />

      <Section>
        <LegalBody
          sections={terms.sections}
          draftNotice={terms.draftNotice}
          reviewed={terms.reviewed}
        />
      </Section>
    </>
  );
}
