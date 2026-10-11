import Link from "next/link";
import { Container, CtaLink } from "@/components/Section";
import { CTA } from "@/content/site";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-6xl">🧭</p>
      <h1 className="mt-6 text-3xl font-bold text-slate-900">
        这个页面走丢了
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
        要不回首页看看，或者直接找我们问——不用自己找。
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <CtaLink href="/contact" size="lg">
          {CTA.primary}
        </CtaLink>
        <Link
          href="/"
          className="inline-flex items-center rounded-lg border border-slate-300 px-6 py-3.5 text-base font-semibold text-slate-800 hover:border-brand-400 hover:text-brand-700"
        >
          回首页
        </Link>
      </div>
    </Container>
  );
}
