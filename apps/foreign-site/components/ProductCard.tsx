import Link from "next/link";
import Photo from "@/components/Photo";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg"
    >
      <Photo
        caption={product.imageCaption}
        src={product.image?.url}
        alt={product.image?.alt || product.name}
        ratio="aspect-[4/3]"
        className="border-b border-slate-100"
      />
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-500">
          {product.sku}
        </span>
        <h3 className="mt-1.5 text-base font-bold leading-snug text-slate-900 group-hover:text-brand-700">
          {product.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
          {product.summary}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>MOQ {product.moq}</span>
          <span className="font-semibold text-brand-600 group-hover:text-accent-500">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
