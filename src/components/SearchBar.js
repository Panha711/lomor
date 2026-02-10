import { SearchIcon } from "./icons";

export default function SearchBar({
  placeholder = "What are you looking for?",
}) {
  return (
    <div className="relative hidden w-full max-w-sm sm:block">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
      <input
        type="search"
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--border)] bg-white py-3 pl-9 pr-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:ring-1 focus:ring-[var(--accent)]/10"
      />
    </div>
  );
}
