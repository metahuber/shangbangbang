import Link from "next/link";
import { Container } from "@/components/Section";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-6xl font-black text-brand-200">404</p>
      <h1 className="mt-6 text-3xl font-bold text-slate-900">
        This page could not be found
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
        The product may have been renamed or discontinued. Browse the full
        range, or send us an inquiry and we will find the right item for you.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/products"
          className="inline-flex items-center rounded bg-accent-500 px-7 py-3.5 text-base font-bold text-white transition hover:bg-accent-600"
        >
          Browse products
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center rounded border border-slate-300 px-7 py-3.5 text-base font-bold text-slate-800 transition hover:border-brand-400 hover:text-brand-700"
        >
          Contact us
        </Link>
      </div>
    </Container>
  );
}
