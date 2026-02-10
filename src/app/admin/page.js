import Link from "next/link";
import { Header, Footer } from "@/components";
import { products } from "@/lib/products";
import { ArrowRightIcon } from "@/components/icons";

const lowStockThreshold = 10;

export default function AdminPage() {
  const totalItems = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock ?? 0), 0);
  const lowStockCount = products.filter((p) => (p.stock ?? 0) < lowStockThreshold).length;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
      <Header />

      <main className="mx-auto max-w-[1200px] px-6 py-8 md:py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              Inventory
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Manage and monitor your clothing stock
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            <span className="rotate-180">
              <ArrowRightIcon className="h-4 w-4" />
            </span>
            Back to store
          </Link>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Products
            </p>
            <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">{totalItems}</p>
            <p className="mt-0.5 text-sm text-[var(--muted)]">clothing items</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Total stock
            </p>
            <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">{totalStock}</p>
            <p className="mt-0.5 text-sm text-[var(--muted)]">units</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Low stock
            </p>
            <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">{lowStockCount}</p>
            <p className="mt-0.5 text-sm text-[var(--muted)]">
              below {lowStockThreshold} units
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--card-hover)]">
                  <th className="px-4 py-3 font-semibold text-[var(--muted)]">Product</th>
                  <th className="px-4 py-3 font-semibold text-[var(--muted)]">Category</th>
                  <th className="px-4 py-3 font-semibold text-[var(--muted)]">Size</th>
                  <th className="px-4 py-3 font-semibold text-[var(--muted)]">SKU</th>
                  <th className="px-4 py-3 font-semibold text-[var(--muted)]">Price</th>
                  <th className="px-4 py-3 font-semibold text-[var(--muted)]">Stock</th>
                  <th className="px-4 py-3 font-semibold text-[var(--muted)]"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const isLowStock = (product.stock ?? 0) < lowStockThreshold;
                  return (
                    <tr
                      key={product.slug}
                      className="border-b border-[var(--border)] last:border-b-0 transition-colors hover:bg-[var(--card-hover)]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[var(--card-hover)] flex items-center justify-center text-[var(--muted)]/40">
                            <span className="text-lg">✦</span>
                          </div>
                          <span className="font-medium text-[var(--foreground)]">
                            {product.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)]">{product.category}</td>
                      <td className="px-4 py-3 text-[var(--muted)]">
                        {product.sizes ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)] font-mono text-xs">
                        {product.sku ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                        {product.price}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            isLowStock
                              ? "font-medium text-[var(--accent)]"
                              : "text-[var(--foreground)]"
                          }
                        >
                          {product.stock ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/shop/${product.slug}`}
                          className="inline-flex items-center gap-1 text-[var(--accent)] font-medium hover:text-[var(--accent-hover)]"
                        >
                          View
                          <ArrowRightIcon className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
