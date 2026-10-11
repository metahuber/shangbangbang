"use client";

import Link from "next/link";
import { useState } from "react";
import { products } from "@/content/products";
import { solutions } from "@/content/solutions";
import { site, CTA, TBD } from "@/content/site";

function isTbd(v: string) {
  return v === TBD;
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-lg font-bold text-white">
            商
          </span>
          <span className="text-lg font-bold text-slate-900">{site.name}</span>
        </Link>

        {/* 桌面导航 */}
        <nav className="hidden items-center gap-1 lg:flex">
          {/* 产品 */}
          <div className="group relative">
            <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700">
              产品
              <span className="text-[10px] text-slate-400">▾</span>
            </button>
            <div className="invisible absolute left-0 top-full w-72 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
              {products.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="flex items-start gap-3 rounded-lg px-3 py-2 hover:bg-slate-50"
                >
                  <span className="text-lg leading-none">{p.emoji}</span>
                  <span>
                    <span className="block text-sm font-medium text-slate-900">
                      {p.name}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {p.summary}
                    </span>
                  </span>
                </Link>
              ))}
              <Link
                href="/products"
                className="mt-1 block rounded-lg px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
              >
                查看全部产品 →
              </Link>
            </div>
          </div>

          {/* 解决方案 */}
          <div className="group relative">
            <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700">
              解决方案
              <span className="text-[10px] text-slate-400">▾</span>
            </button>
            <div className="invisible absolute left-0 top-full w-72 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
              {solutions.map((s) => (
                <Link
                  key={s.slug}
                  href={`/solutions/${s.slug}`}
                  className="flex items-start gap-3 rounded-lg px-3 py-2 hover:bg-slate-50"
                >
                  <span className="text-lg leading-none">{s.emoji}</span>
                  <span>
                    <span className="block text-sm font-medium text-slate-900">
                      {s.name}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {s.shortDesc}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/cases"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700"
          >
            案例
          </Link>
          <Link
            href="/pricing"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700"
          >
            价格
          </Link>
          <Link
            href="/faq"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700"
          >
            常见问题
          </Link>
          <Link
            href="/about"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700"
          >
            关于我们
          </Link>
        </nav>

        {/* 右侧 CTA */}
        <div className="flex items-center gap-3">
          {!isTbd(site.phone) && (
            <a
              href={`tel:${site.phone}`}
              className="hidden text-sm font-medium text-slate-600 hover:text-brand-700 xl:block"
            >
              📞 {site.phone}
            </a>
          )}
          <Link
            href="/contact"
            className="hidden rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600 sm:block"
          >
            {CTA.primary}
          </Link>

          {/* 移动端菜单按钮 */}
          <button
            type="button"
            aria-label="打开菜单"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 lg:hidden"
          >
            <span className="text-lg">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* 移动端面板 */}
      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto max-w-6xl space-y-4 px-4 py-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                产品
              </p>
              <div className="grid grid-cols-1 gap-1">
                {products.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {p.emoji} {p.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                解决方案
              </p>
              <div className="grid grid-cols-1 gap-1">
                {solutions.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/solutions/${s.slug}`}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {s.emoji} {s.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 border-t border-slate-100 pt-3">
              {[
                ["/cases", "客户案例"],
                ["/pricing", "价格"],
                ["/faq", "常见问题"],
                ["/about", "关于我们"],
                ["/contact", "联系我们"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {label}
                </Link>
              ))}
            </div>

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block rounded-lg bg-accent-500 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              {CTA.primary}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
