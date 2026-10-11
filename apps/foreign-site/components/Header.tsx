"use client";

import Link from "next/link";
import { useState } from "react";
import type { Category } from "@/lib/types";

export default function Header({
  brand,
  categories,
  email,
  phone,
}: {
  brand: string;
  categories: Category[];
  email: string;
  phone: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* 顶部信息条 —— 外贸站的惯例：把联系方式和询盘入口放在最上面 */}
      <div className="hidden bg-brand-950 text-slate-300 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2 text-xs">
          <div className="flex items-center gap-5">
            <a
              href={`mailto:${email}`}
              className="transition hover:text-white"
            >
              ✉ {email}
            </a>
            <a href={`tel:${phone}`} className="transition hover:text-white">
              ☎ {phone}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">English</span>
            <Link
              href="/contact"
              className="font-semibold text-accent-400 transition hover:text-accent-500"
            >
              Get a Quote →
            </Link>
          </div>
        </div>
      </div>

      {/* 主导航 */}
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded bg-brand-800 text-sm font-black tracking-tight text-white">
              HX
            </span>
            <span className="text-lg font-black tracking-tight text-brand-900">
              {brand}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="/"
              className="rounded px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-brand-700"
            >
              Home
            </Link>

            <div className="group relative">
              <button className="flex items-center gap-1 rounded px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-brand-700">
                Products
                <span className="text-[10px] text-slate-400">▾</span>
              </button>
              <div className="invisible absolute left-0 top-full w-72 rounded-lg border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/products?category=${c.slug}`}
                    className="block rounded px-3 py-2 hover:bg-slate-50"
                  >
                    <span className="block text-sm font-semibold text-slate-900">
                      {c.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {c.summary}
                    </span>
                  </Link>
                ))}
                <Link
                  href="/products"
                  className="mt-1 block rounded px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-slate-50"
                >
                  View all products →
                </Link>
              </div>
            </div>

            <Link
              href="/factory"
              className="rounded px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-brand-700"
            >
              Our Factory
            </Link>
            <Link
              href="/quality"
              className="rounded px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-brand-700"
            >
              Quality
            </Link>
            <Link
              href="/contact"
              className="rounded px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-brand-700"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden rounded bg-accent-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-accent-600 sm:block"
            >
              Request a Quote
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded border border-slate-200 text-slate-700 lg:hidden"
            >
              <span className="text-lg">{open ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {open && (
        <div className="border-b border-slate-200 bg-white lg:hidden">
          <div className="mx-auto max-w-6xl space-y-4 px-5 py-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block rounded px-2 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Home
            </Link>
            <div>
              <p className="mb-1 px-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                Products
              </p>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products?category=${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="block rounded px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {c.name}
                </Link>
              ))}
              <Link
                href="/products"
                onClick={() => setOpen(false)}
                className="block rounded px-2 py-2 text-sm font-semibold text-brand-700 hover:bg-slate-50"
              >
                View all products
              </Link>
            </div>
            {[
              ["/factory", "Our Factory"],
              ["/quality", "Quality"],
              ["/contact", "Contact"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block rounded px-2 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block rounded bg-accent-500 px-4 py-3 text-center text-sm font-bold text-white"
            >
              Request a Quote
            </Link>
            <div className="border-t border-slate-100 pt-3 text-xs text-slate-500">
              <a href={`mailto:${email}`} className="block py-1">
                ✉ {email}
              </a>
              <a href={`tel:${phone}`} className="block py-1">
                ☎ {phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
