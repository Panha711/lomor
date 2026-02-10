import { Header, CategorySidebar, Footer } from "@/components";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
      <Header />

      <main className="mx-auto flex max-w-[1200px] flex-col md:flex-row">
        <CategorySidebar />
        <div className="min-w-0 flex-1 border-t border-[var(--border)] md:border-t-0 md:border-l-0">
          <div className="px-6 py-8 md:py-10">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                Shop
              </h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {products.length} items
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
