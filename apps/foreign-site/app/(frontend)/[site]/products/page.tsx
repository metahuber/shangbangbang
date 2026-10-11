import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, Container } from "@/components/Section";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts, getCategoryBySlug } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Hand tools, tool sets, air tools and storage solutions manufactured in our own factory in Ningbo, China. OEM & ODM available.",
};

export default async function ProductsPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ category?: string }>;
  params: Promise<{ site: string }>;
}) {
  const { category } = await searchParams;
  const { site: siteSlug } = await params;
  const [categories, products, activeCategory] = await Promise.all([
    getCategories(siteSlug),
    getProducts(siteSlug, category),
    category ? getCategoryBySlug(siteSlug, category) : Promise.resolve(null),
  ]);

  return (
    <>
      {/* 页头 */}
      <section className="border-b border-slate-200 bg-brand-950">
        <Container className="py-12 sm:py-16">
          <nav className="mb-5 text-xs text-slate-400">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span className="mx-2 text-slate-600">/</span>
            <Link href="/products" className="transition hover:text-white">
              Products
            </Link>
            {activeCategory && (
              <>
                <span className="mx-2 text-slate-600">/</span>
                <span className="text-slate-200">{activeCategory.name}</span>
              </>
            )}
          </nav>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            {activeCategory ? activeCategory.name : "All Products"}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            {activeCategory
              ? activeCategory.summary
              : "Every item below is produced in our own factory. Ask for a sample and check the quality before you commit to a container."}
          </p>
        </Container>
      </section>

      {/* 分类筛选 */}
      <div className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <Container>
          <div className="flex gap-2 overflow-x-auto py-3">
            <Link
              href="/products"
              className={`shrink-0 rounded px-4 py-2 text-sm font-semibold transition ${
                !category
                  ? "bg-brand-800 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                className={`shrink-0 rounded px-4 py-2 text-sm font-semibold transition ${
                  category === c.slug
                    ? "bg-brand-800 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </Container>
      </div>

      <Section>
        {products.length === 0 ? (
          <p className="py-16 text-center text-slate-500">
            No products in this category yet.
          </p>
        ) : (
          <>
            <p className="mb-6 text-sm text-slate-500">
              {products.length} product{products.length > 1 ? "s" : ""}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </>
        )}
      </Section>

      <Section bg="slate">
        <SectionHeading
          eyebrow="Cannot find what you need?"
          title="We also develop new items from your drawing"
          desc="Send us a sample, a drawing or even a photo. Our engineers will tell you whether we can make it, at what MOQ and at what cost."
        />
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center rounded bg-accent-500 px-7 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-accent-600"
          >
            Send your requirement
          </Link>
        </div>
      </Section>
    </>
  );
}
