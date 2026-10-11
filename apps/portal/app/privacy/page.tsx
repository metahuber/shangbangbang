import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Section } from "@/components/Section";
import LegalBody from "@/components/LegalBody";
import { privacy } from "@/content/pages/legal";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "商帮帮如何收集、使用和保护你提交的信息。",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "首页" }, { label: privacy.title }]}
        title={privacy.title}
        desc={`最近更新：${new Date().getFullYear()} 年`}
      />

      <Section>
        <LegalBody
          sections={privacy.sections}
          draftNotice={privacy.draftNotice}
          reviewed={privacy.reviewed}
        />
      </Section>
    </>
  );
}
