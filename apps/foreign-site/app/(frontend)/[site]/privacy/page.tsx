import type { Metadata } from "next";
import Link from "next/link";
import { Section, Container } from "@/components/Section";
import LegalBody from "@/components/LegalBody";
import { getSite } from "@/lib/cms";
import { privacySections } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How we collect, use and protect the information you send us through this website.",
  robots: { index: true, follow: true },
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site: siteSlug } = await params;
  const site = await getSite(siteSlug);

  const sections = privacySections({
    company: site.name,
    site: site.domain,
    email: site.email,
  });

  return (
    <>
      <section className="border-b border-slate-200 bg-brand-950">
        <Container className="py-12 sm:py-16">
          <nav className="mb-5 text-xs text-slate-400">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span className="mx-2 text-slate-600">/</span>
            <span className="text-slate-200">Privacy Policy</span>
          </nav>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            What we collect when you contact us, why we collect it, and what you
            can ask us to do about it.
          </p>
        </Container>
      </section>

      <Section>
        <LegalBody sections={sections} />
      </Section>
    </>
  );
}
