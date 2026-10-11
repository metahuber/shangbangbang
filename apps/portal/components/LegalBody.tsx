import { site, TBD } from "@/content/site";
import type { LegalSection } from "@/content/pages/legal";

/**
 * 隐私政策 / 服务条款 的正文渲染。
 * 内容是数据，见 content/pages/legal.ts。
 */
export default function LegalBody({
  sections,
  draftNotice,
  reviewed,
}: {
  sections: LegalSection[];
  draftNotice: { title: string; desc: string };
  reviewed: boolean;
}) {
  const company = site.companyName === TBD ? "【公司全称待填写】" : site.companyName;

  return (
    <div className="mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-slate-700">
      {!reviewed && (
        <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-4 text-xs text-amber-900">
          <p className="font-semibold">{draftNotice.title}</p>
          <p className="mt-1">{draftNotice.desc}</p>
        </div>
      )}

      {sections.map((s) => (
        <section key={s.title}>
          <h2 className="text-base font-bold text-slate-900">{s.title}</h2>

          {s.paras?.map((p) => (
            <p key={p} className="mt-2">
              {p}
            </p>
          ))}

          {s.list && (
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              {s.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}

          {s.contact && (
            <p className="mt-2">
              运营主体：{company}
              <br />
              网站：{site.domain}
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
