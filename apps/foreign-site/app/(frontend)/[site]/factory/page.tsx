import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, Container } from "@/components/Section";
import Photo from "@/components/Photo";
import { getSite, getStats, getCapabilities } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Our Factory",
  description:
    "28,000 m² manufacturing facility in Ningbo, China. Hot forging, CNC machining, heat treatment, plating, assembly and an on-site quality lab.",
};

export default async function FactoryPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site: siteSlug } = await params;
  const [site, stats, capabilities] = await Promise.all([
    getSite(siteSlug),
    getStats(siteSlug),
    getCapabilities(siteSlug),
  ]);

  return (
    <>
      <section className="border-b border-slate-200 bg-brand-950">
        <Container className="py-12 sm:py-16">
          <nav className="mb-5 text-xs text-slate-400">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span className="mx-2 text-slate-600">/</span>
            <span className="text-slate-200">Our Factory</span>
          </nav>
          <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl">
            A real factory, not a trading office
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            {site.name} was founded in {site.founded} in Beilun District,
            Ningbo. Everything you see on this website is made here — from
            forging the blank to packing the finished carton.
          </p>
        </Container>
      </section>

      {/* 数据 */}
      <section className="border-b border-slate-200 bg-white">
        <Container>
          <div className="grid grid-cols-2 divide-slate-200 py-8 sm:grid-cols-4 sm:divide-x">
            {stats.map((s) => (
              <div key={s.label} className="px-4 py-3 text-center">
                <p className="text-3xl font-black text-brand-800">{s.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 工厂全景 */}
      <Section>
        <Photo
          caption="Aerial view of the factory · 2000×1000"
          ratio="aspect-[2/1]"
          className="rounded-lg border border-slate-200"
        />
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {["Workshop A", "Warehouse", "Office", "Loading bay"].map((t) => (
            <Photo
              key={t}
              caption={t}
              ratio="aspect-[4/3]"
              className="rounded border border-slate-200"
            />
          ))}
        </div>
      </Section>

      {/* 生产环节 */}
      <Section bg="slate">
        <SectionHeading
          eyebrow="Production Process"
          title="Six stages, all in-house"
          desc="Because every stage happens under our own roof, we can trace a defect back to the machine and the shift that produced it."
        />
        <div className="space-y-8">
          {capabilities.map((cap, i) => (
            <div
              key={cap.name}
              className={`grid items-center gap-8 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <Photo
                caption={cap.imageCaption}
                src={cap.image?.url}
                alt={cap.name}
                ratio="aspect-[16/10]"
                className="rounded-lg border border-slate-200"
              />
              <div>
                <span className="text-xs font-black text-accent-500">
                  STAGE {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  {cap.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {cap.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 参观 */}
      <Section bg="dark">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Come and See"
              title="Visit us, or take a video tour"
              desc="Most of our long-term buyers visited the factory before their first order. If you cannot travel, we will walk you through the workshop on a live video call."
              center={false}
              invert
            />
            <ul className="space-y-3 text-sm text-slate-300">
              {[
                "Nearest airport: Ningbo Lishe (NGB), 45 minutes by car",
                "Nearest port: Ningbo-Zhoushan, 30 minutes",
                "We can arrange pickup and an interpreter",
                "Live video tour available on WhatsApp or Zoom",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500/15 text-[11px] font-bold text-accent-400">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center rounded bg-accent-500 px-7 py-3.5 text-base font-bold text-white transition hover:bg-accent-600"
              >
                Arrange a visit
              </Link>
            </div>
          </div>

          <Photo
            caption="Factory entrance / reception · 1400×1050"
            ratio="aspect-[4/3]"
            className="rounded-lg ring-1 ring-white/10"
          />
        </div>
      </Section>
    </>
  );
}
