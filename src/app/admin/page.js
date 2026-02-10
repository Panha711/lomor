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
  getTotalSales,
  addToTotalSales,
} from "@/lib/products";
import {
  parsePriceNum,
  getEffectiveStock,
  isOutOfStock,
  getRowClassName,
  getStockTextClassName,
  SIZE_ORDER,
} from "@/lib/adminUtils";
import { PlusIcon, SearchIcon, PackageIcon } from "@/components/icons";
import CreatePopUp from "@/components/CreatePopUp";
import EditPopUp from "@/components/EditPopUp";
import DeletePopUp from "@/components/DeletePopUp";

const INPUT_CLASS =
  "rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

const TABLE_COL_SPAN = 8;

const DEFAULT_SORT = { column: "effectiveStock", direction: "asc" };

const EMPTY_PRODUCT_FORM = {
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

function SummaryCard({
  value,
  label,
  icon: Icon = PackageIcon,
  variant = "default",
}) {
  const variantStyles = {
    default: "bg-[var(--card-hover)] text-[var(--muted)]",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };
  const valueStyles = {
    default: "text-[var(--foreground)]",
    danger: "text-red-600 dark:text-red-400",
    success: "text-emerald-600 dark:text-emerald-400",
  };
  const style = variantStyles[variant] || variantStyles.default;
  const valueStyle = valueStyles[variant] || valueStyles.default;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${style}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-2xl font-semibold ${valueStyle}`}>{value}</p>
          <p className="text-sm text-[var(--muted)]">{label}</p>
        </div>
      </div>
    </div>
  );
}

function ProductTableRow({
  product,
  sizeOptions,
  isCustomProduct,
  onEdit,
  onDelete,
  onSellOne,
}) {
  const stock = product.effectiveStock;

  return (
    <tr
      className={`border-b border-[var(--border)] last:border-b-0 transition-colors hover:bg-[var(--card-hover)] ${getRowClassName(product)}`}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {product.imageSrc ? (
            <img
              src={product.imageSrc}
              alt={product.title}
              className="h-10 w-10 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--card-hover)] text-sm text-[var(--muted)]/40">
              ✦
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-[var(--foreground)]">
              {product.title}
            </span>
            {isCustomProduct && (
              <span className="rounded bg-[var(--accent)]/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--accent)]">
                Custom
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-[var(--muted)]">{product.category}</td>
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
                        ? "border border-[var(--accent)]/30 bg-[var(--accent)]/15 text-[var(--accent)]"
                        : "border border-[var(--border)] bg-[var(--card-hover)]/50 text-[var(--muted)]"
                    }`}
                    title={hasSize ? `Has size ${s}` : `No size ${s}`}
                  >
                    {s}
                  </span>
                );
              })
            : "—"}
        </div>
      </td>
      <td className="px-4 py-3 font-medium text-[var(--foreground)]">
        {product.priceStore ? `$${product.priceStore}` : "—"}
      </td>
      <td className="px-4 py-3 font-medium text-[var(--foreground)]">
        {product.price ? `$${product.price}` : "—"}
      </td>
      <td className="px-4 py-3 text-center">
        <span className={getStockTextClassName(stock)}>{stock}</span>
      </td>
      <td className="flex justify-end gap-3 px-4 py-5">
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(product)}
          className="font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default function AdminPage() {
  const [stockOverrides, setStockOverrides] = useState({});
  const [customProducts, setCustomProducts] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [sortColumn, setSortColumn] = useState(DEFAULT_SORT.column);
  const [sortDirection, setSortDirection] = useState(DEFAULT_SORT.direction);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_PRODUCT_FORM);
  const [createError, setCreateError] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_PRODUCT_FORM);
  const [editError, setEditError] = useState("");

  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    setStockOverrides(getAllStockFromStorage());
    setCustomProducts(getCustomProducts());
    setTotalSales(getTotalSales());
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
        stats: { total: 0, outOfStock: 0 },
      };
    }

    const q = search.trim().toLowerCase();
    const cat = categoryFilter.trim();
    const size = sizeFilter.trim();
    const dir = sortDirection === "asc" ? 1 : -1;

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
    if (cat) list = list.filter((p) => p.category === cat);
    if (size) list = list.filter((p) => productHasSize(p, size));

    list = [...list].sort((a, b) => {
      if (sortColumn === "title") return dir * a.title.localeCompare(b.title);
      if (sortColumn === "category")
        return (
          dir *
          (a.category.localeCompare(b.category) ||
            a.title.localeCompare(b.title))
        );
      if (sortColumn === "priceStore")
        return (
          dir * (parsePriceNum(a.priceStore) - parsePriceNum(b.priceStore))
        );
      if (sortColumn === "price")
        return dir * (parsePriceNum(a.price) - parsePriceNum(b.price));
      if (sortColumn === "effectiveStock")
        return dir * (a.effectiveStock - b.effectiveStock);
      return 0;
    });

    const allWithStock = allProducts.map((p) => ({
      ...p,
      effectiveStock: getEffectiveStock(p, stockOverrides),
    }));
    const outOfStock = allWithStock.filter((p) =>
      isOutOfStock(p.effectiveStock),
    ).length;

    return {
      filteredProducts: list,
      stats: { total: allProducts.length, outOfStock },
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

  // —— Handlers: Create ——
  const openCreateModal = () => {
    setCreateForm(EMPTY_PRODUCT_FORM);
    setCreateError("");
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateError("");
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setCreateError("");
    const title = createForm.title.trim();
    const category = createForm.category.trim();
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
      priceStore: createForm.priceStore.trim() || "—",
      price: createForm.priceCustomer.trim() || "¥0",
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
    setEditForm(product);
    setEditError("");
    setEditingProduct(product);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditError("");
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

  const handleSellOne = (product) => {
    const currentStock = getEffectiveStock(product, stockOverrides);
    if (currentStock <= 0) return;
    const priceNum = parsePriceNum(product.price);
    const newStock = currentStock - 1;
    setStockInStorage(product.slug, newStock);
    setStockOverrides((prev) => ({ ...prev, [product.slug]: newStock }));
    addToTotalSales(priceNum);
    setTotalSales(getTotalSales());
  };

  const handleSortHeader = (column) => {
    if (sortColumn === column) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
      <Header />

      <main className="mx-auto max-w-[1200px] px-6 py-8 md:py-10">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
            Inventory
          </h1>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            <PlusIcon className="h-4 w-4" />
            Create new item
          </button>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <SummaryCard value={stats.total} label="Total items" />
          <SummaryCard
            value={stats.total - stats.outOfStock}
            label="In stock"
          />
          <SummaryCard
            value={stats.outOfStock}
            label="Out of stock"
            variant="danger"
          />
          <SummaryCard
            value={`¥${totalSales.toLocaleString()}`}
            label="Total money from sold clothes"
            variant="success"
          />
        </section>

        <section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
            <div className="relative min-w-[180px] max-w-xs flex-1">
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
              aria-label="Filter by size"
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
        </section>

        <div className="mb-2 flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <span className="inline-flex rounded border border-[var(--accent)]/30 bg-[var(--accent)]/15 px-1.5 py-0.5 font-medium text-[var(--accent)]">
              M
            </span>
            = has size
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-flex rounded border border-[var(--border)] bg-[var(--card-hover)]/50 px-1.5 py-0.5 font-medium text-[var(--muted)]">
              M
            </span>
            = no size
          </span>
        </div>

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
                  <th className="whitespace-nowrap px-4 py-3 text-center text-[var(--muted)]">
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
                  <th className="w-[140px] px-4 py-3 text-center font-semibold text-[var(--muted)]">
                    Action
                  </th>
                  <th className="px-4 py-3 font-semibold text-[var(--muted)]" />
                </tr>
              </thead>
              <tbody>
                {!hydrated ? (
                  <tr>
                    <td
                      colSpan={TABLE_COL_SPAN}
                      className="px-4 py-8 text-center text-[var(--muted)]"
                    >
                      Loading…
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={TABLE_COL_SPAN}
                      className="px-4 py-8 text-center text-[var(--muted)]"
                    >
                      No products match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <ProductTableRow
                      key={product.slug}
                      product={product}
                      sizeOptions={sizeOptions}
                      isCustomProduct={customProducts.some(
                        (p) => p.slug === product.slug,
                      )}
                      onEdit={openEditModal}
                      onDelete={setProductToDelete}
                      onSellOne={handleSellOne}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-xs text-[var(--muted)]">
          Stock and total sales are saved in this browser.
        </p>

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

        {productToDelete && (
          <DeletePopUp
            productToDelete={productToDelete}
            setProductToDelete={setProductToDelete}
            confirmDelete={confirmDelete}
          />
        )}

        {editingProduct && (
          <EditPopUp
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
