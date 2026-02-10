import { ChevronRightIcon } from "./icons";

const defaultCategories = [
  { label: "Tops", hasArrow: true },
  { label: "Bottoms", hasArrow: true },
  { label: "Dresses", hasArrow: true },
  { label: "Outerwear", hasArrow: true },
  { label: "Shoes", hasArrow: false },
  { label: "Bags", hasArrow: false },
  { label: "Sale", hasArrow: false },
];

export default function CategorySidebar({ categories = defaultCategories }) {
  return (
    <aside
      className="w-full shrink-0 border-r border-[var(--border)] bg-[var(--surface)] py-8 pl-6 pr-6 md:w-[260px]"
      aria-label="Product categories"
    >
      <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
        Categories
      </h2>
      <ul className="space-y-0.5">
        {categories.map((cat) => (
          <li key={cat.label}>
            <a
              href="#"
              className="flex items-center justify-between py-3 text-[15px] font-normal text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
            >
              <span>{cat.label}</span>
              {cat.hasArrow && (
                <ChevronRightIcon className="h-4 w-4 shrink-0 text-[var(--muted)]" />
              )}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
