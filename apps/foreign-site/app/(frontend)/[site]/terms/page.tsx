import type { Metadata } from "next";
import Link from "next/link";
import { Section, Container } from "@/components/Section";
import LegalBody from "@/components/LegalBody";
import { getSite } from "@/lib/cms";
import { termsSections } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply when you use this website, request a quotation or place an order.",
  robots: { index: true, follow: true },
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site: siteSlug } = await params;
  const site = await getSite(siteSlug);

  const sections = termsSections({
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
            <span className="text-slate-200">Terms of Service</span>
          </nav>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            The rules that apply to enquiries, quotations, orders and delivery.
          </p>
        </Container>
      </section>

      <Section>
        <LegalBody sections={sections} />
      </Section>
    </>
  );
}
