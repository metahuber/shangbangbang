import Link from "next/link";
import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 ${className}`}>{children}</div>
  );
}

export function Section({
  children,
  className = "",
  bg = "white",
  id,
}: {
  children: ReactNode;
  className?: string;
  bg?: "white" | "slate" | "brand";
  id?: string;
}) {
  const bgClass =
    bg === "slate"
      ? "bg-slate-50"
      : bg === "brand"
        ? "bg-brand-950 text-white"
        : "bg-white";
  return (
    <section id={id} className={`${bgClass} py-14 sm:py-20 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  desc,
  center = true,
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  center?: boolean;
  invert?: boolean;
}) {
  return (
    <div className={`${center ? "mx-auto max-w-3xl text-center" : ""} mb-10`}>
      {eyebrow && (
        <p
          className={`mb-2 text-sm font-semibold ${invert ? "text-accent-400" : "text-brand-600"}`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-2xl font-bold sm:text-3xl ${invert ? "text-white" : "text-slate-900"}`}
      >
        {title}
      </h2>
      {desc && (
        <p
          className={`mt-3 text-base ${invert ? "text-slate-300" : "text-slate-600"}`}
        >
          {desc}
        </p>
      )}
    </div>
  );
}

type BtnProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
};

export function CtaLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: BtnProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-semibold transition";
  const sizes = size === "lg" ? "px-6 py-3.5 text-base" : "px-5 py-2.5 text-sm";
  const variants = {
    primary: "bg-accent-500 text-white shadow-sm hover:bg-accent-600",
    secondary:
      "border border-slate-300 bg-white text-slate-800 hover:border-brand-400 hover:text-brand-700",
    ghost: "border border-white/30 text-white hover:bg-white/10",
  }[variant];

  return (
    <Link href={href} className={`${base} ${sizes} ${variants} ${className}`}>
      {children}
    </Link>
  );
}
