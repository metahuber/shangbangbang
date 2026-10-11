import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 ${className}`}>{children}</div>
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
  bg?: "white" | "slate" | "dark";
  id?: string;
}) {
  const map = {
    white: "bg-white",
    slate: "bg-slate-50",
    dark: "bg-brand-950 text-slate-300",
  } as const;
  return (
    <section id={id} className={`${map[bg]} py-16 sm:py-20 ${className}`}>
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
          className={`mb-3 text-xs font-bold uppercase tracking-[0.12em] ${
            invert ? "text-accent-400" : "text-accent-500"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-2xl font-bold sm:text-3xl ${
          invert ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {desc && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            invert ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {desc}
        </p>
      )}
    </div>
  );
}
