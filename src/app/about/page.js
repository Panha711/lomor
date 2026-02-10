import { Header, Footer } from "@/components";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
      <Header />

      <main className="mx-auto max-w-[720px] px-6 py-12 md:py-20">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
          About Lomor
        </h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
          Our story
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-[var(--muted)]">
          <p>
            Lomor started with a simple idea: clothing should be well-made, easy to wear, and
            honest in price. We focus on everyday pieces—tops, bottoms, outerwear, and
            accessories—that fit into your wardrobe and your life.
          </p>
          <p>
            We work with trusted makers and choose materials that last. Every piece is selected
            with care so you can wear it often and feel good in it.
          </p>
        </div>

        <section className="mt-16 border-t border-[var(--border)] pt-12">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
            What we care about
          </h2>
          <ul className="mt-6 space-y-4">
            {[
              "Quality materials and construction",
              "Timeless, versatile design",
              "Transparent pricing",
              "Clothing that works for everyday",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-[15px] text-[var(--muted)]"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-16 text-sm text-[var(--muted)]">
          Thank you for being here. We’re a small team and we’re glad you’re part of Lomor.
        </p>
      </main>

      <Footer />
    </div>
  );
}
