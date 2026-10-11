import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, Container } from "@/components/Section";
import Photo from "@/components/Photo";
import InquiryForm from "@/components/InquiryForm";
import { getSite } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact our export team for a quotation, samples or a factory visit. We reply within 12 working hours.",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site: siteSlug } = await params;
  const site = await getSite(siteSlug);

  const channels = [
    {
      label: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
      note: "Best for detailed requirements",
    },
    {
      label: "Phone",
      value: site.phone,
      href: `tel:${site.phone}`,
      note: "Mon–Sat, 08:30–18:00 (GMT+8)",
    },
    {
      label: "WhatsApp",
      value: "Chat with our export team",
      href: `https://wa.me/${site.whatsapp}`,
      note: "Fastest for quick questions",
    },
  ];

  return (
    <>
      <section className="border-b border-slate-200 bg-brand-950">
        <Container className="py-12 sm:py-16">
          <nav className="mb-5 text-xs text-slate-400">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span className="mx-2 text-slate-600">/</span>
            <span className="text-slate-200">Contact</span>
          </nav>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Talk to the people who make the tools
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            Send us your requirement and we will reply within 12 working hours
            with a quotation, packing details and lead time.
          </p>
        </Container>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          {/* 联系信息 */}
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              How to reach us
            </h2>
            <div className="mt-6 space-y-4">
              {channels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noreferrer noopener" : undefined}
                  className="block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-sm"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    {c.label}
                  </p>
                  <p className="mt-1.5 text-base font-bold text-brand-800">
                    {c.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{c.note}</p>
                </a>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Factory address
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {site.address}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                45 min from Ningbo Lishe Airport (NGB) · 30 min from
                Ningbo-Zhoushan Port
              </p>
            </div>

            <Photo
              caption="Map · 1200×600"
              ratio="aspect-[2/1]"
              className="mt-6 rounded-lg border border-slate-200"
            />

            <div className="mt-6 flex flex-wrap gap-3">
              {site.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="rounded border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* 表单 */}
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Send us your requirement
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              The more detail you give, the more accurate our reply will be.
            </p>
            <div className="mt-6">
              <InquiryForm />
            </div>
          </div>
        </div>
      </Section>

      <Section bg="slate">
        <SectionHeading
          eyebrow="What Happens Next"
          title="Three steps from inquiry to quotation"
        />
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {[
            {
              t: "Within 12 hours",
              d: "Our export team reads your requirement and asks any clarifying questions.",
            },
            {
              t: "Within 1–2 days",
              d: "You receive a quotation with FOB price, packing details, lead time and payment terms.",
            },
            {
              t: "Then samples",
              d: "If the price works, we send samples so you can check quality before ordering.",
            },
          ].map((s, i) => (
            <div
              key={s.t}
              className="rounded-lg border border-slate-200 bg-white p-6"
            >
              <span className="text-sm font-black text-accent-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-base font-bold text-slate-900">{s.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
