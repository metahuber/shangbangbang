import type { Faq } from "@/lib/types";

export default function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
      {items.map((f, i) => (
        <details key={i} className="group px-6 py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            <span className="text-base font-bold text-slate-900">{f.q}</span>
            <span className="shrink-0 text-lg text-brand-400 transition group-open:rotate-45">
              ＋
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
