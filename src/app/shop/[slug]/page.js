import Link from "next/link";
import { Header, Footer, NotFoundPopup } from "@/components";
import { getProductBySlug } from "@/lib/products";
import { ArrowRightIcon } from "@/components/icons";

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <Header />
        <main className="min-h-[60vh]" />
        <Footer />
        <NotFoundPopup
          title="Product not found"
          message="This product doesn't exist or has been removed."
          backHref="/#shop"
          backLabel="Back to shop"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
      <Header />
      <main className="mx-auto max-w-[1200px] px-6 py-8 md:py-12">
        <Link
          href="/#shop"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          <span className="rotate-180">
            <ArrowRightIcon className="h-4 w-4" />
          </span>
          Back to shop
        </Link>

        <article className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="w-full max-w-[380px] max-h-[420px] aspect-[3/4] overflow-hidden rounded-xl bg-[var(--card-hover)]">
            <div className="flex h-full w-full items-center justify-center text-[var(--muted)]/30">
              <span className="text-6xl" aria-hidden>
                ✦
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-start">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
              {product.category}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
              {product.title}
            </h1>
            <p className="mt-4 text-2xl font-medium text-[var(--foreground)]">
              {product.price}
            </p>
            <p className="mt-6 text-[15px] leading-relaxed text-[var(--muted)]">
              {product.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
              >
                Add to cart
              </button>
              <button
                type="button"
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--card-hover)]"
              >
                Save for later
              </button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
