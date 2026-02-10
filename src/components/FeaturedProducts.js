import { ArrowRightIcon } from "./icons";
import ProductCard from "./ProductCard";
import { products as defaultProducts } from "@/lib/products";

export default function FeaturedProducts({ products = defaultProducts.slice(0, 4) }) {
  return (
    <section id="shop" className="border-t border-[var(--border)] bg-[var(--surface)] px-6 py-10 md:py-14">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
              Featured
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Handpicked pieces for the season
            </p>
          </div>
          <a
            href="/#shop"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
          >
            View all
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              title={product.title}
              price={product.price}
              category={product.category}
              imageSrc={product.imageSrc}
              href={`/shop/${product.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
