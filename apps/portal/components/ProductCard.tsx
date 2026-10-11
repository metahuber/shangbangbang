import Link from "next/link";
import type { Product } from "@/content/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <span className="text-2xl">{product.emoji}</span>
        {product.isFree && (
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
            免费
          </span>
        )}
      </div>
      <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-brand-700">
        {product.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {product.summary}
      </p>
      <span className="mt-4 text-sm font-medium text-brand-600">
        了解详情 →
      </span>
    </Link>
  );
}
