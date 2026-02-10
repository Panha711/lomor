export default function ProductCard({
  title = "Product name",
  price = "$0",
  category,
  imageSrc = "/image/1.webp",
  href = "#",
}) {
  return (
    <a
      href={href}
      className="group block rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-[border-color,background-color,transform] hover:border-[var(--muted)]/30 hover:bg-[var(--card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 active:scale-[0.99]"
    >
      <div className="aspect-[3/4] w-full overflow-hidden rounded-t-lg bg-[var(--card-hover)]">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--muted)]/40">
            <span className="text-4xl" aria-hidden>
              ✦
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        {category && (
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
            {category}
          </p>
        )}
        <h3 className="font-medium text-[var(--foreground)]">{title}</h3>
        <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
          {price}
        </p>
      </div>
    </a>
  );
}
