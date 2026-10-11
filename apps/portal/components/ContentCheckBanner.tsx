import { collectIssues } from "@/lib/validate";

/**
 * 开发环境专用的内容待办提示。
 *
 * 只在 npm run dev 时出现，生产环境完全不可见。
 * 目的：你打开网站就能看到「还有哪些没填」，不用自己去记。
 */
export default function ContentCheckBanner() {
  if (process.env.NODE_ENV === "production") return null;

  const issues = collectIssues();
  if (issues.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-3 z-50 max-w-xs sm:bottom-3">
      <details className="group rounded-lg border border-amber-300 bg-amber-50 shadow-lg">
        <summary className="cursor-pointer list-none px-3 py-2 text-xs font-semibold text-amber-900">
          🛠 开发提示：还有 {issues.length} 处内容没填
          <span className="ml-1 text-amber-600 group-open:hidden">▸</span>
        </summary>
        <div className="max-h-72 overflow-y-auto border-t border-amber-200 px-3 py-2">
          <ol className="space-y-1.5 text-[11px] leading-snug text-amber-900">
            {issues.map((i, n) => (
              <li key={`${i.where}-${i.what}-${n}`}>
                <span className="font-semibold">{i.where}</span>
                <span className="text-amber-700"> —— {i.what}</span>
              </li>
            ))}
          </ol>
          <p className="mt-2 border-t border-amber-200 pt-2 text-[10px] text-amber-700">
            改哪里：只看 content/ 目录。详见 content/README.md
          </p>
        </div>
      </details>
    </div>
  );
}
