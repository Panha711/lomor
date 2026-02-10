import { ArrowRightIcon } from "./icons";

export default function HeroBanner({
  subtitle = "Spring 2025",
  title = "New Arrivals",
  description = "Curated pieces for your everyday style.",
  ctaLabel = "Shop the collection",
  ctaHref = "#shop",
  carouselCount = 4,
  activeIndex = 0,
}) {
  return (
    <section className="relative flex-1 overflow-hidden rounded-xl bg-[var(--foreground)] mx-4 my-6 md:mx-6 md:my-8">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--foreground)] via-[#2d2a26] to-[#1c1b19]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      <div className="relative flex min-h-[380px] items-center justify-between gap-10 px-8 py-12 md:min-h-[420px] md:px-12">
        <div className="max-w-md">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/70">
            {subtitle}
          </p>
          <h1 className="mb-3 text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            {title}
          </h1>
          <p className="mb-6 text-[15px] leading-relaxed text-white/80">
            {description}
          </p>
          <a
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            {ctaLabel}
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        </div>
        <div className="hidden aspect-[4/5] max-h-[320px] w-[200px] shrink-0 overflow-hidden rounded-lg bg-white/5 md:block">
          <div className="h-full w-full bg-gradient-to-br from-[var(--accent)]/20 to-transparent" />
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {Array.from({ length: carouselCount }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              i === activeIndex ? "bg-white" : "bg-white/40"
            }`}
            aria-hidden
          />
        ))}
      </div>
    </section>
  );
}
