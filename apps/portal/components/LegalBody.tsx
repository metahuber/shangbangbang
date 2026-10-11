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
  // 公司全称还没填时，显示品牌名而不是「待填写」——那是给内部看的，不该给客户看
  const company = site.companyName === TBD ? site.name : site.companyName;

  /**
   * ⚠️ 草稿提示只在**开发环境**显示。
   *
   * 它是写给我们自己看的开发提醒，绝不能出现在给客户看的线上页面里。
   * 上线后怎么不忘这件事？——构建日志里的「内容检查」会一直提醒：
   *     隐私政策 —— 还是初稿，审核通过后把 reviewed 改成 true
   * 那才是它该待的地方。
   */
  const showDraftNotice =
    !reviewed && process.env.NODE_ENV !== "production";

  return (
    <div className="mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-slate-700">
      {showDraftNotice && (
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
