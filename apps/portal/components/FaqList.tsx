import type { Faq } from "@/content/faqs";

export default function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
      {items.map((f, i) => (
        <details key={i} className="group px-5 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            <span className="text-base font-semibold text-slate-900">
              {f.q}
            </span>
            <span className="shrink-0 text-slate-400 transition group-open:rotate-45">
              ＋
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
