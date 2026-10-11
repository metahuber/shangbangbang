import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import LeadForm from "@/components/LeadForm";
import { site, TBD } from "@/content/site";
import { contact } from "@/content/pages/contact";

/**
 * 微信二维码：图片存在就显示真图，不存在就显示占位块。
 *
 * 这样你只要把图片丢进 `apps/portal/public/images/wechat-qr.png` 就够了，
 * **不需要改任何代码**。构建期判断，不影响运行时性能。
 */
const wechatQrExists = existsSync(
  path.join(process.cwd(), "public/images/wechat-qr.png"),
);

export const metadata: Metadata = {
  title: "联系我们",
  description:
    "留下联系方式，商帮帮 24 小时内给你回一份初步方案。不收费、不推销。",
};

function isTbd(v: string) {
  return v === TBD;
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "首页" }, { label: "联系我们" }]}
        eyebrow={contact.hero.eyebrow}
        title={contact.hero.title}
        desc={contact.hero.desc}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          {/* 表单 */}
          <div>
            <h2 className="mb-5 text-xl font-bold text-slate-900">
              {contact.form.title}
            </h2>
            <LeadForm />
          </div>

          {/* 直接联系 */}
          <div>
            <h2 className="mb-5 text-xl font-bold text-slate-900">
              {contact.direct.title}
            </h2>

            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">
                  {contact.direct.wechat.label}
                </p>
                <div className="mt-3 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  {wechatQrExists ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/images/wechat-qr.png"
                      alt="商帮帮微信二维码"
                      width={140}
                      height={140}
                      className="shrink-0 rounded-lg border border-slate-200"
                    />
                  ) : (
                    <div className="flex h-[140px] w-[140px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-center">
                      <span className="text-2xl">📱</span>
                      <span className="text-[11px] leading-tight text-slate-500">
                        {contact.direct.wechat.qrHint}
                        <br />
                        {contact.direct.wechat.qrSubHint}
                      </span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed text-slate-600">
                    {contact.direct.wechat.note}
                    <br />
                    {contact.direct.wechat.note2}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">
                  {contact.direct.phone.label}
                </p>
                {isTbd(site.phone) ? (
                  <p className="mt-2 text-sm text-slate-400">
                    {contact.direct.phone.tbd}
                  </p>
                ) : (
                  <a
                    href={`tel:${site.phone}`}
                    className="mt-2 block text-lg font-bold text-brand-700 hover:underline"
                  >
                    {site.phone}
                  </a>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  {contact.direct.phone.hours}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">
                  {contact.direct.email.label}
                </p>
                {isTbd(site.email) ? (
                  <p className="mt-2 text-sm text-slate-400">
                    {contact.direct.email.tbd}
                  </p>
                ) : (
                  <a
                    href={`mailto:${site.email}`}
                    className="mt-2 block text-sm font-medium text-brand-700 hover:underline"
                  >
                    {site.email}
                  </a>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">
                  {contact.direct.promises.title}
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                  {contact.direct.promises.items.map((p) => (
                    <li key={p}>· {p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section bg="slate">
        <SectionHeading
          eyebrow={contact.after.eyebrow}
          title={contact.after.title}
        />
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          {contact.after.steps.map((s) => (
            <div
              key={s.t}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <p className="text-sm font-bold text-brand-700">{s.t}</p>
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
