/**
 * 首屏主视觉：用纯 CSS 画的「产品界面」示意。
 * 不用图库素材，也避免缺图。等有真实产品截图后可直接替换。
 */
export default function HeroMockup() {
  return (
    <div className="w-full">
      {/* 浏览器外框 */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-brand-900/10">
        {/* 顶部栏 */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <div className="ml-2 flex-1 rounded-md bg-white px-2.5 py-1 text-[10px] text-slate-400">
            www.your-factory.com/en
          </div>
        </div>

        {/* 站点主体 */}
        <div className="p-3">
          {/* 站内导航 */}
          <div className="flex items-center justify-between rounded-md bg-slate-900 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-accent-500" />
              <span className="h-2 w-14 rounded bg-white/70" />
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-6 rounded bg-white/40" />
              <span className="h-1.5 w-6 rounded bg-white/40" />
              <span className="h-1.5 w-6 rounded bg-white/40" />
              <span className="h-1.5 w-8 rounded bg-white/70" />
            </div>
          </div>

          {/* Hero 区 */}
          <div className="mt-2 grid grid-cols-5 gap-2 rounded-md bg-brand-50 p-3">
            <div className="col-span-3 space-y-1.5">
              <span className="block h-2.5 w-4/5 rounded bg-brand-800/80" />
              <span className="block h-2.5 w-3/5 rounded bg-brand-800/60" />
              <span className="block h-1.5 w-full rounded bg-brand-700/25" />
              <span className="block h-1.5 w-5/6 rounded bg-brand-700/25" />
              <div className="flex gap-1.5 pt-1">
                <span className="h-4 w-14 rounded bg-accent-500" />
                <span className="h-4 w-14 rounded border border-brand-300" />
              </div>
            </div>
            <div className="col-span-2 rounded bg-white/70" />
          </div>

          {/* 产品网格 */}
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-md border border-slate-200 p-2"
              >
                <div className="mb-1.5 h-8 rounded bg-slate-100" />
                <span className="block h-1.5 w-4/5 rounded bg-slate-300" />
                <span className="mt-1 block h-1.5 w-3/5 rounded bg-slate-200" />
              </div>
            ))}
          </div>

          {/* 询盘条 */}
          <div className="mt-2 flex items-center justify-between rounded-md bg-green-50 px-3 py-2">
            <span className="h-1.5 w-24 rounded bg-green-700/40" />
            <span className="h-3 w-12 rounded bg-green-600" />
          </div>
        </div>
      </div>

      {/* 浮层：询盘通知 */}
      <div className="mx-4 -mt-6 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-lg">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs">
          ✉️
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold text-slate-900">
            收到一条新询盘
          </p>
          <p className="truncate text-[10px] text-slate-500">
            Interested in your product list, please quote…
          </p>
        </div>
      </div>
    </div>
  );
}
