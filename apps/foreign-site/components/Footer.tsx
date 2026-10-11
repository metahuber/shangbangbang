import Link from "next/link";
import type { Category, Site } from "@/lib/types";

export default function Footer({
  site,
  categories,
}: {
  site: Site;
  categories: Category[];
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-slate-400">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* 品牌 */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded bg-accent-500 text-sm font-black text-white">
                HX
              </span>
              <span className="text-base font-black tracking-tight text-white">
                {site.brand}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed">{site.name}</p>
            <p className="mt-3 text-sm leading-relaxed">{site.address}</p>
            <p className="mt-2 text-sm">Established {site.founded}</p>
          </div>

          {/* 产品 */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">
              Products
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/products?category=${c.slug}`}
                    className="transition hover:text-white"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 公司 */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ["/factory", "Our Factory"],
                ["/quality", "Quality & Certificates"],
                ["/contact", "Contact Us"],
                ["/products", "All Products"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="transition hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 联系 */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="transition hover:text-white"
                >
                  ✉ {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phone}`}
                  className="transition hover:text-white"
                >
                  ☎ {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded bg-green-600 px-3 py-1.5 font-semibold text-white transition hover:bg-green-700"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
            {(site.social ?? []).length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3 text-xs">
                {(site.social ?? []).map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="rounded border border-white/15 px-2.5 py-1 transition hover:border-white/40 hover:text-white"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms of Service
            </Link>
            <span className="text-slate-600">{site.domain}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
