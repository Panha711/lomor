const footerLinks = {
  Shop: [
    { label: "Tops", href: "/shop" },
    { label: "Bottoms", href: "/shop" },
    { label: "Dresses", href: "/shop" },
    { label: "Outerwear", href: "/shop" },
    { label: "Sale", href: "/shop" },
  ],
  Company: [
    { label: "Admin", href: "/admin" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card-hover)]">
      <div className="mx-auto max-w-[1200px] px-6 py-12 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="/" className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
              Lomor
            </a>
            <p className="mt-3 max-w-xs text-sm text-[var(--muted)]">
              Quality clothing for everyday wear. Curated for your wardrobe.
            </p>
          </div>
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                {heading}
              </h3>
              <ul className="mt-4 space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row">
          <p className="text-sm text-[var(--muted)]">
            © {new Date().getFullYear()} Lomor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
