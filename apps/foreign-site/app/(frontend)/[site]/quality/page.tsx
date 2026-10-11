import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, Container } from "@/components/Section";
import Photo from "@/components/Photo";
import { getCertificates } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Quality & Certificates",
  description:
    "Four-stage quality control, on-site testing laboratory, and ISO 9001, CE, GS, BSCI and RoHS certification. Third-party inspection welcome.",
};

const qcStages = [
  {
    code: "IQC",
    name: "Incoming material inspection",
    desc: "Steel bar certificates are checked against the order, and hardness plus chemical composition are verified before the material enters production.",
  },
  {
    code: "IPQC",
    name: "In-process inspection",
    desc: "First-article approval on every machine at every shift change, then hourly patrol checks on critical dimensions and hardness.",
  },
  {
    code: "FQC",
    name: "Final inspection",
    desc: "Full visual inspection, torque and hardness testing on a sampling basis, and a functional check on every air tool before packing.",
  },
  {
    code: "OQC",
    name: "Outgoing inspection",
    desc: "Packing, labelling, barcode and carton drop checks before the container is loaded. Inspection report filed against the order number.",
  },
];

const equipment = [
  "Rockwell and Vickers hardness testers",
  "Digital torque testers up to 1,000 N·m",
  "Salt spray chamber, 480-hour capability",
  "3D coordinate measuring machine",
  "Optical emission spectrometer for steel composition",
  "Drop tester and carton compression tester",
];

export default async function QualityPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site: siteSlug } = await params;
  const certificates = await getCertificates(siteSlug);

  return (
    <>
      <section className="border-b border-slate-200 bg-brand-950">
        <Container className="py-12 sm:py-16">
          <nav className="mb-5 text-xs text-slate-400">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span className="mx-2 text-slate-600">/</span>
            <span className="text-slate-200">Quality</span>
          </nav>
          <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl">
            Quality is checked four times before your carton is sealed
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            A claim from a customer costs far more than the inspection it would
            have prevented. This is how we keep claims close to zero.
          </p>
        </Container>
      </section>

      {/* 四道检验 */}
      <Section>
        <SectionHeading
          eyebrow="Quality Control"
          title="Four gates, no exceptions"
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {qcStages.map((s) => (
            <div
              key={s.code}
              className="rounded-lg border border-slate-200 bg-white p-6"
            >
              <div className="flex items-center gap-3">
                <span className="rounded bg-brand-800 px-2.5 py-1 text-xs font-black tracking-wide text-white">
                  {s.code}
                </span>
                <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* 检测设备 */}
      <Section bg="slate">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Testing Laboratory"
              title="We test in-house, not just at the end"
              desc="Our laboratory lets us catch a problem during production rather than after the container has sailed."
              center={false}
            />
            <ul className="space-y-3 text-sm text-slate-700">
              {equipment.map((e) => (
                <li key={e} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-bold text-brand-700">
                    ✓
                  </span>
                  {e}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Hardness tester", "Torque tester", "Salt spray chamber", "CMM"].map(
              (t) => (
                <Photo
                  key={t}
                  caption={`${t} · 800×600`}
                  ratio="aspect-[4/3]"
                  className="rounded-lg border border-slate-200"
                />
              ),
            )}
          </div>
        </div>
      </Section>

      {/* 认证 */}
      <Section>
        <SectionHeading
          eyebrow="Certificates"
          title="Documentation your customers will ask for"
          desc="Copies are provided with every shipment, and we can send them in advance for your tender or listing."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((c) => (
            <div
              key={c.name}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
              <Photo
                caption={`${c.name} certificate · 1000×750`}
                src={c.image?.url}
                alt={c.name}
                ratio="aspect-[4/3]"
                className="border-b border-slate-100"
              />
              <div className="p-5">
                <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Issued by {c.issuer}
                </p>
                <p className="mt-2 text-sm text-slate-600">{c.note}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 第三方验厂 */}
      <Section bg="dark">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Third-Party Inspection"
              title="Send your own QC team — we will not hide anything"
              desc="SGS, BV, TÜV, Intertek or your own inspector. We arrange access, provide the documentation and answer their questions on the spot."
              center={false}
              invert
            />
            <p className="text-sm leading-relaxed text-slate-300">
              We would rather you inspect and find nothing, than skip the
              inspection and find a problem when the goods arrive.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center rounded bg-accent-500 px-7 py-3.5 text-base font-bold text-white transition hover:bg-accent-600"
              >
                Book an inspection
              </Link>
            </div>
          </div>
          <Photo
            caption="Inspector in the QC lab · 1400×1050"
            ratio="aspect-[4/3]"
            className="rounded-lg ring-1 ring-white/10"
          />
        </div>
      </Section>
    </>
  );
}
