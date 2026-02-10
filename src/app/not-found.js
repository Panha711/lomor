import Link from "next/link";
import { Header, Footer } from "@/components";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
      <Header />
      <main className="mx-auto max-w-[1200px] px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Page not found</h1>
        <p className="mt-2 text-[var(--muted)]">The page you’re looking for doesn’t exist.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Back to home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
