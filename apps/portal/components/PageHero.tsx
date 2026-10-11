import Link from "next/link";
import type { ReactNode } from "react";
import { CtaLink } from "@/components/Section";

export type Crumb = { href?: string; label: string };

export default function PageHero({
  crumbs,
  eyebrow,
  title,
  desc,
  actions,
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  desc?: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <nav
          aria-label="面包屑"
          className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500"
        >
          {crumbs.map((c, i) => (
            <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-slate-300">/</span>}
              {c.href ? (
                <Link href={c.href} className="hover:text-brand-700">
                  {c.label}
                </Link>
              ) : (
                <span className="text-slate-700">{c.label}</span>
              )}
            </span>
          ))}
        </nav>

        {eyebrow && (
          <p className="mb-2 text-sm font-semibold text-brand-600">{eyebrow}</p>
        )}
        <h1 className="max-w-3xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        {desc && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            {desc}
          </p>
        )}

        {actions && <div className="mt-7 flex flex-wrap gap-3">{actions}</div>}
        {children}
      </div>
    </section>
  );
}

/** 内页常用的「主 CTA + 次 CTA」组合 */
export function HeroActions({
  primaryHref = "/contact",
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  primaryHref?: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <>
      <CtaLink href={primaryHref} size="lg">
        {primaryLabel}
      </CtaLink>
      {secondaryHref && secondaryLabel && (
        <CtaLink href={secondaryHref} variant="secondary" size="lg">
          {secondaryLabel}
        </CtaLink>
      )}
    </>
  );
}
