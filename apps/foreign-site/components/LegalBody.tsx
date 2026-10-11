import { LEGAL_REVIEWED, type LegalSection } from "@/lib/legal";

/**
 * 法律文本正文渲染。
 *
 * ⚠️ 草稿提示只在**开发环境**显示 —— 它不该出现在给海外买家看的页面上。
 */
export default function LegalBody({ sections }: { sections: LegalSection[] }) {
  const showDraft = !LEGAL_REVIEWED && process.env.NODE_ENV !== "production";

  return (
    <div className="mx-auto max-w-3xl space-y-7 text-sm leading-relaxed text-slate-700">
      {showDraft && (
        <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-4 text-xs text-amber-900">
          <p className="font-semibold">
            ⚠️ DRAFT — this document is a template and must be reviewed by a
            qualified adviser before go-live.
          </p>
          <p className="mt-1">
            To hide this notice, set <code>LEGAL_REVIEWED = true</code> in{" "}
            <code>lib/legal.ts</code> after review.
          </p>
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
        </section>
      ))}
    </div>
  );
}
