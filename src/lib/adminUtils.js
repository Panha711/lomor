/**
 * Pure helpers for the admin inventory page.
 * Kept separate so bugs in filtering/sorting/display logic are easy to locate.
 */

export function parsePriceNum(str) {
  if (str == null || str === "" || str === "—") return 0;
  const num = String(str).replace(/[^0-9.]/g, "");
  return Number(num) || 0;
}

export function getEffectiveStock(product, overrides) {
  if (overrides[product.slug] !== undefined) {
    return overrides[product.slug];
  }
  return product.stock ?? 0;
}

export function isOutOfStock(qty) {
  return qty <= 0;
}

export function getRowClassName(product) {
  const stock = product.effectiveStock;
  if (isOutOfStock(stock)) return "bg-red-500/5";
  return "";
}

export function getStockTextClassName(stock) {
  if (isOutOfStock(stock)) return "font-medium text-red-600 dark:text-red-400";
  return "text-[var(--foreground)]";
}

export const SIZE_ORDER = ["XS", "S", "M", "L", "XL"];
