"use client";

import { useMemo, useState, useEffect } from "react";
import { Header, Footer } from "@/components";
import {
  products as initialProducts,
  DEFAULT_SIZES,
  getAllStockFromStorage,
  setStockInStorage,
  getSizesList,
  productHasSize,
  getCustomProducts,
  saveCustomProducts,
  slugify,
} from "@/lib/products";
import {
  PlusIcon,
  SearchIcon,
  PackageIcon,
  ExclamationIcon,
} from "@/components/icons";
import CreatePopUp from "@/components/CreatePopUp";
import EditItem from "@/components/EditPopUp";
import DeletePopUp from "@/components/DeletePopUp";

const LOW_STOCK_THRESHOLD = 10;
const SIZE_ORDER = ["XS", "S", "M", "L", "XL"];
const INPUT_CLASS =
  "rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

function parsePriceNum(str) {
  if (str == null || str === "" || str === "—") return 0;
  const num = String(str).replace(/[^0-9.]/g, "");
  return Number(num) || 0;
}

function getEffectiveStock(product, overrides) {
  if (overrides[product.slug] !== undefined) {
    return overrides[product.slug];
  }
  return product.stock ?? 0;
}

function isLowStock(qty) {
  return qty < LOW_STOCK_THRESHOLD && qty >= 0;
}

function isOutOfStock(qty) {
  return qty <= 0;
}

function getRowClassName(product) {
  const stock = product.effectiveStock;
  if (isOutOfStock(stock)) return "bg-red-500/5";
  if (isLowStock(stock)) return "bg-[var(--accent)]/5";
  return "";
}

function getStockTextClassName(stock) {
  if (isOutOfStock(stock)) return "font-medium text-red-600 dark:text-red-400";
  if (isLowStock(stock)) return "font-medium text-[var(--accent)]";
  return "text-[var(--foreground)]";
}

const emptyForm = {
  title: "",
  category: "",
  sizes: DEFAULT_SIZES,
  priceStore: "",
  priceCustomer: "",
  stock: 0,
  description: "",
  imageSrc: "",
};

function SortableTh({ column, label, sortColumn, sortDirection, onSort }) {
  const active = sortColumn === column;
  return (
    <th className="px-4 py-3 font-semibold text-[var(--muted)]">
      <button
        type="button"
        onClick={() => onSort(column)}
        className="inline-flex items-center gap-1 whitespace-nowrap text-left hover:text-[var(--foreground)]"
      >
        {label}
        {active && (
          <span aria-hidden>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
        )}
      </button>
    </th>
  );
}

export default function AdminPage() {
  const [stockOverrides, setStockOverrides] = useState({});
  const [customProducts, setCustomProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [sortColumn, setSortColumn] = useState("effectiveStock");
  const [sortDirection, setSortDirection] = useState("asc");
  const [hydrated, setHydrated] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [createError, setCreateError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editError, setEditError] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const stored = getAllStockFromStorage();
    setStockOverrides(stored);
    setCustomProducts(getCustomProducts());
    setHydrated(true);
  }, []);

  const allProducts = useMemo(
    () => [...initialProducts, ...customProducts],
    [customProducts],
  );

  const categories = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.category));
    return Array.from(set).filter(Boolean).sort();
  }, [allProducts]);

  const sizeOptions = useMemo(() => {
    const set = new Set();
    allProducts.forEach((p) =>
      getSizesList(p).forEach((s) => {
        if (s !== "One size") set.add(s);
      }),
    );
    return Array.from(set).sort((a, b) => {
      const ia = SIZE_ORDER.indexOf(a);
      const ib = SIZE_ORDER.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [allProducts]);

  const { filteredProducts, stats } = useMemo(() => {
    if (!hydrated) {
      return {
        filteredProducts: [],
        stats: { total: 0, lowStock: 0, outOfStock: 0 },
      };
    }
    const q = search.trim().toLowerCase();
    const cat = categoryFilter.trim();
    const size = sizeFilter.trim();
    let list = allProducts.map((p) => ({
      ...p,
      effectiveStock: getEffectiveStock(p, stockOverrides),
    }));

    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.price && String(p.price).toLowerCase().includes(q)) ||
          (p.priceStore && String(p.priceStore).toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q),
      );
    }
    if (cat) {
      list = list.filter((p) => p.category === cat);
    }
    if (size) {
      list = list.filter((p) => productHasSize(p, size));
    }

    list = [...list].sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      if (sortColumn === "title") {
        return dir * a.title.localeCompare(b.title);
      }
      if (sortColumn === "category") {
        return (
          dir *
          (a.category.localeCompare(b.category) ||
            a.title.localeCompare(b.title))
        );
      }
      if (sortColumn === "priceStore") {
        return (
          dir * (parsePriceNum(a.priceStore) - parsePriceNum(b.priceStore))
        );
      }
      if (sortColumn === "price") {
        return dir * (parsePriceNum(a.price) - parsePriceNum(b.price));
      }
      if (sortColumn === "effectiveStock") {
        return dir * (a.effectiveStock - b.effectiveStock);
      }
      return 0;
    });

    const allWithStock = allProducts.map((p) => ({
      ...p,
      effectiveStock: getEffectiveStock(p, stockOverrides),
    }));
    const lowStock = allWithStock.filter((p) =>
      isLowStock(p.effectiveStock),
    ).length;
    const outOfStock = allWithStock.filter((p) =>
      isOutOfStock(p.effectiveStock),
    ).length;

    return {
      filteredProducts: list,
      stats: {
        total: allProducts.length,
        lowStock,
        outOfStock,
      },
    };
  }, [
    hydrated,
    search,
    categoryFilter,
    sizeFilter,
    sortColumn,
    sortDirection,
    stockOverrides,
    allProducts,
  ]);

  console.log(filteredProducts);

  const openCreateModal = () => {
    setCreateForm(emptyForm);
    setCreateError("");
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateError("");
  };

  const handleSortHeader = (column) => {
    if (sortColumn === column) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setCreateError("");
    const title = createForm.title.trim();
    const category = createForm.category.trim();
    const priceStore = createForm.priceStore.trim();
    const priceCustomer = createForm.priceCustomer.trim();
    if (!title) {
      setCreateError("Title is required.");
      return;
    }
    if (!category) {
      setCreateError("Category is required.");
      return;
    }
    const baseSlug = slugify(title) || "item";
    const existingSlugs = new Set(allProducts.map((p) => p.slug));
    let slug = baseSlug;
    let n = 1;
    while (existingSlugs.has(slug)) {
      slug = `${baseSlug}-${n}`;
      n += 1;
    }
    const stock = Math.max(0, Math.floor(Number(createForm.stock)) || 0);
    const newProduct = {
      slug,
      title,
      category,
      sizes: createForm.sizes.trim() || DEFAULT_SIZES,
      sku: `CUS-${Date.now().toString(36).toUpperCase()}`,
      priceStore: priceStore || "—",
      price: priceCustomer || "¥0",
      stock,
      description: createForm.description.trim() || "",
      imageSrc: createForm.imageSrc?.trim() || undefined,
    };
    const nextCustom = [...customProducts, newProduct];
    setCustomProducts(nextCustom);
    saveCustomProducts(nextCustom);
    setStockInStorage(slug, stock);
    setStockOverrides((prev) => ({ ...prev, [slug]: stock }));
    closeCreateModal();
  };

  const openEditModal = (product) => {
    const stock = getEffectiveStock(product, stockOverrides);
    setEditForm({
      title: product.title ?? "",
      category: product.category ?? "",
      priceStore:
        product.priceStore && product.priceStore !== "—"
          ? product.priceStore
          : "",
      priceCustomer:
        product.price && product.price !== "—" ? product.price : "",
      sizes: product.sizes ?? DEFAULT_SIZES,
      stock: typeof stock === "number" ? stock : 0,
      description: product.description ?? "",
      imageSrc: product.imageSrc ?? "",
    });
    setEditError("");
    setEditingProduct(product);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditError("");
  };

  const confirmDelete = () => {
    if (!productToDelete) return;
    const isCustom = customProducts.some(
      (p) => p.slug === productToDelete.slug,
    );
    if (isCustom) {
      const nextCustom = customProducts.filter(
        (p) => p.slug !== productToDelete.slug,
      );
      setCustomProducts(nextCustom);
      saveCustomProducts(nextCustom);
    }
    setStockOverrides((prev) => {
      const next = { ...prev };
      delete next[productToDelete.slug];
      return next;
    });
    setStockInStorage(productToDelete.slug, 0);
    setProductToDelete(null);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setEditError("");
    if (!editingProduct) return;
    const title = editForm.title.trim();
    const category = editForm.category.trim();
    if (!title) {
      setEditError("Title is required.");
      return;
    }
    if (!category) {
      setEditError("Category is required.");
      return;
    }
    const stock = Math.max(0, Math.floor(Number(editForm.stock)) || 0);
    const isCustom = customProducts.some((p) => p.slug === editingProduct.slug);

    if (isCustom) {
      const updated = customProducts.map((p) =>
        p.slug === editingProduct.slug
          ? {
              ...p,
              title,
              category,
              priceStore: editForm.priceStore.trim() || "—",
              price: editForm.priceCustomer.trim() || "¥0",
              sizes: editForm.sizes.trim() || DEFAULT_SIZES,
              stock,
              description: editForm.description.trim() || "",
              imageSrc: editForm.imageSrc?.trim() || p.imageSrc || undefined,
            }
          : p,
      );
      setCustomProducts(updated);
      saveCustomProducts(updated);
    }
    setStockInStorage(editingProduct.slug, stock);
    setStockOverrides((prev) => ({ ...prev, [editingProduct.slug]: stock }));
    closeEditModal();
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
      <Header />

      <main className="mx-auto max-w-[1200px] px-6 py-8 md:py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
            Inventory
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              <PlusIcon className="h-4 w-4" />
              Create new item
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--card-hover)] text-[var(--muted)]">
                <PackageIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--foreground)]">
                  {stats.total}
                </p>
                <p className="text-sm text-[var(--muted)]">Total items</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                <ExclamationIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--accent)]">
                  {stats.lowStock}
                </p>
                <p className="text-sm text-[var(--muted)]">
                  Low stock (&lt;{LOW_STOCK_THRESHOLD})
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--card-hover)] text-[var(--muted)]">
                <PackageIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--foreground)]">
                  {stats.total - stats.outOfStock}
                </p>
                <p className="text-sm text-[var(--muted)]">In stock</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                <PackageIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                  {stats.outOfStock}
                </p>
                <p className="text-sm text-[var(--muted)]">Out of stock</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & sort */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="search"
                placeholder="Search by name, price, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full py-2 pl-9 pr-3 ${INPUT_CLASS}`}
                aria-label="Search products"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={INPUT_CLASS}
              aria-label="Filter by category"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className={INPUT_CLASS}
              aria-label="Filter by size (has size)"
              title="Show only products that have this size"
            >
              <option value="">All sizes</option>
              {sizeOptions.map((s) => (
                <option key={s} value={s}>
                  Has size: {s}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-[var(--muted)]">
            Click a column header to sort.
          </p>
        </div>

        {/* Size legend */}
        <div className="mb-2 flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <span className="inline-flex rounded bg-[var(--accent)]/15 px-1.5 py-0.5 text-[var(--accent)] border border-[var(--accent)]/30 font-medium">
              M
            </span>
            = has size
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-flex rounded bg-[var(--card-hover)]/50 px-1.5 py-0.5 text-[var(--muted)] border border-[var(--border)] font-medium">
              M
            </span>
            = no size
          </span>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--card-hover)]">
                  <SortableTh
                    column="title"
                    label="Product"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSortHeader}
                  />
                  <SortableTh
                    column="category"
                    label="Category"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSortHeader}
                  />
                  <th className="px-4 py-3 font-semibold text-center text-[var(--muted)] whitespace-nowrap">
                    Size
                  </th>
                  <SortableTh
                    column="priceStore"
                    label="Price sell store"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSortHeader}
                  />
                  <SortableTh
                    column="price"
                    label="Price sell"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSortHeader}
                  />
                  <SortableTh
                    column="effectiveStock"
                    label="Stock"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSortHeader}
                  />
                  <th className="px-4 py-3 font-semibold text-center text-[var(--muted)] w-[140px]">
                    Action
                  </th>
                  <th className="px-4 py-3 font-semibold text-[var(--muted)]" />
                </tr>
              </thead>
              <tbody>
                {!hydrated ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-[var(--muted)]"
                    >
                      Loading…
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-[var(--muted)]"
                    >
                      No products match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const stock = product.effectiveStock;
                    return (
                      <tr
                        key={product.slug}
                        className={`border-b border-[var(--border)] last:border-b-0 transition-colors hover:bg-[var(--card-hover)] ${getRowClassName(product)}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {product.imageSrc ? (
                              <img
                                src={product.imageSrc}
                                alt={product.title}
                                className="h-10 w-10 shrink-0 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--card-hover)] text-[var(--muted)]/40 text-sm">
                                ✦
                              </div>
                            )}
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium text-[var(--foreground)]">
                                {product.title}
                              </span>
                              {customProducts.some(
                                (p) => p.slug === product.slug,
                              ) && (
                                <span className="rounded bg-[var(--accent)]/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--accent)]">
                                  Custom
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[var(--muted)]">
                          {product.category}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {sizeOptions.length
                              ? sizeOptions.map((s) => {
                                  const hasSize = productHasSize(product, s);
                                  return (
                                    <span
                                      key={s}
                                      className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                                        hasSize
                                          ? "bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30"
                                          : "bg-[var(--card-hover)]/50 text-[var(--muted)] border border-[var(--border)]"
                                      }`}
                                      title={
                                        hasSize
                                          ? `Has size ${s}`
                                          : `No size ${s}`
                                      }
                                    >
                                      {s}
                                    </span>
                                  );
                                })
                              : "—"}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                          {product.priceStore ? "$" + product.priceStore : "—"}
                        </td>
                        <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                          {product.price ? "$" + product.price : "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={getStockTextClassName(stock)}>
                            {stock}
                          </span>
                        </td>
                        <td className="px-4 py-5 text-center flex gap-5 justify-end">
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="inline-flex items-center gap-1 font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(product)}
                            className="inline-flex items-center gap-1 font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-xs text-[var(--muted)]">
          Stock changes are saved in this browser. Low stock = under{" "}
          {LOW_STOCK_THRESHOLD} units.
        </p>

        {/* Create new item modal */}
        {showCreateModal && (
          <CreatePopUp
            showCreateModal={showCreateModal}
            closeCreateModal={closeCreateModal}
            createForm={createForm}
            setCreateForm={setCreateForm}
            createError={createError}
            handleCreateSubmit={handleCreateSubmit}
          />
        )}

        {/* Delete confirmation popup */}
        {productToDelete && (
          <DeletePopUp
            productToDelete={productToDelete}
            setProductToDelete={setProductToDelete}
            confirmDelete={confirmDelete}
          />
        )}

        {/* Edit item modal */}
        {editingProduct && (
          <EditItem
            editingProduct={editingProduct}
            closeEditModal={closeEditModal}
            customProducts={customProducts}
            editForm={editForm}
            setEditForm={setEditForm}
            editError={editError}
            handleEditSubmit={handleEditSubmit}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
