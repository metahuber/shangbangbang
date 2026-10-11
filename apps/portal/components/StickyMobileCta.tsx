import Link from "next/link";
import { CTA } from "@/content/site";

/**
 * 移动端底部常驻 CTA。
 * 门户的唯一 KPI 是留资——手机上任何时候都能一键进入。
 */
export default function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur sm:hidden">
      <Link
        href="/contact"
        className="block rounded-lg bg-accent-500 px-4 py-3 text-center text-sm font-semibold text-white"
      >
        {CTA.primary}
      </Link>
    </div>
  );
}
