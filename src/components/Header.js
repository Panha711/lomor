"use client";

import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";
import { HeartIcon, CartIcon, ProfileIcon } from "./icons";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/admin", label: "Admin" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-6 py-4">
        <a
          href="/"
          className="text-xl font-semibold tracking-tight text-[var(--foreground)] transition-opacity hover:opacity-80"
        >
          Lomor
        </a>

        <nav className="hidden items-center gap-8 sm:flex" aria-label="Main">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(item.href + "/");
            return (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  isActive
                    ? "font-bold text-[var(--foreground)]"
                    : "font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2 sm:max-w-md sm:flex-initial sm:gap-1">
          <SearchBar />
          <div className="flex items-center gap-0.1">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--foreground)] transition-colors hover:bg-[var(--card-hover)]"
              aria-label="Wishlist"
            >
              <HeartIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--foreground)] transition-colors hover:bg-[var(--card-hover)]"
              aria-label="Cart"
            >
              <CartIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--foreground)] transition-colors hover:bg-[var(--card-hover)]"
              aria-label="Profile"
            >
              <ProfileIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
