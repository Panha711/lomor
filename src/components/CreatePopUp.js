import { useRef } from "react";
import { DEFAULT_CATEGORIES } from "@/lib/products";

const INPUT_CLASS =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

function readFileAsDataUrl(file, setImageSrc) {
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = () => setImageSrc((f) => ({ ...f, imageSrc: reader.result }));
  reader.readAsDataURL(file);
}

export default function CreatePopUp({
  showCreateModal,
  closeCreateModal,
  createForm,
  setCreateForm,
  createError,
  handleCreateSubmit,
}) {
  const fileInputRef = useRef(null);
  if (!showCreateModal) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-modal-title"
    >
      <div
        className="absolute inset-0 bg-[var(--foreground)]/40"
        onClick={closeCreateModal}
        aria-hidden="true"
      />
      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
        <div className="shrink-0 border-b border-[var(--border)] px-6 py-4">
          <h2
            id="create-modal-title"
            className="text-lg font-semibold text-[var(--foreground)]"
          >
            Create new stock item
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Add a new product to your inventory. Saved in this browser.
          </p>
        </div>
        <form onSubmit={handleCreateSubmit} className="min-h-0 flex-1 overflow-y-auto p-6 space-y-4">
          {createError && (
            <p
              className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {createError}
            </p>
          )}
          <div>
            <label
              htmlFor="create-title"
              className="mb-1 block text-sm font-medium text-[var(--foreground)]"
            >
              Title *
            </label>
            <input
              id="create-title"
              type="text"
              value={createForm.title}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="e.g. Linen Overshirt"
              className={INPUT_CLASS}
              autoFocus
            />
          </div>
          <div>
            <span className="mb-1 block text-sm font-medium text-[var(--foreground)]">
              Image
            </span>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
              <div className="flex shrink-0 items-center gap-3">
                {createForm.imageSrc ? (
                  <div className="relative">
                    <img
                      src={createForm.imageSrc}
                      alt=""
                      className="h-24 w-24 rounded-lg border border-[var(--border)] object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setCreateForm((f) => ({ ...f, imageSrc: "" }))
                      }
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--card-hover)] text-[var(--muted)] text-xs">
                    No image
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) readFileAsDataUrl(file, setCreateForm);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--card-hover)]"
                >
                  {createForm.imageSrc ? "Change image" : "Upload image"}
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="create-category"
                className="mb-1 block text-sm font-medium text-[var(--foreground)]"
              >
                Category *
              </label>
              <input
                id="create-category"
                type="text"
                list="create-category-list"
                value={createForm.category}
                onChange={(e) =>
                  setCreateForm((f) => ({
                    ...f,
                    category: e.target.value,
                  }))
                }
                placeholder="e.g. Tops"
                className={INPUT_CLASS}
              />
              <datalist id="create-category-list">
                {DEFAULT_CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label
                htmlFor="create-price-store"
                className="mb-1 block text-sm font-medium text-[var(--foreground)]"
              >
                Price sell store
              </label>
              <input
                id="create-price-store"
                type="text"
                value={createForm.priceStore}
                onChange={(e) =>
                  setCreateForm((f) => ({
                    ...f,
                    priceStore: e.target.value,
                  }))
                }
                placeholder="e.g. ¥2,800"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label
                htmlFor="create-price-customer"
                className="mb-1 block text-sm font-medium text-[var(--foreground)]"
              >
                Price sell to customer
              </label>
              <input
                id="create-price-customer"
                type="text"
                value={createForm.priceCustomer}
                onChange={(e) =>
                  setCreateForm((f) => ({
                    ...f,
                    priceCustomer: e.target.value,
                  }))
                }
                placeholder="e.g. 4,200"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label
                htmlFor="create-stock"
                className="mb-1 block text-sm font-medium text-[var(--foreground)]"
              >
                Initial stock
              </label>
              <input
                id="create-stock"
                type="number"
                min={0}
                value={createForm.stock === 0 ? "" : createForm.stock}
                onChange={(e) =>
                  setCreateForm((f) => ({
                    ...f,
                    stock: e.target.value === "" ? 0 : Number(e.target.value),
                  }))
                }
                placeholder="0"
                className={INPUT_CLASS}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="create-sizes"
              className="mb-1 block text-sm font-medium text-[var(--foreground)]"
            >
              Sizes
            </label>
            <input
              id="create-sizes"
              type="text"
              value={createForm.sizes}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, sizes: e.target.value }))
              }
              placeholder="S, M, L, XL"
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label
              htmlFor="create-description"
              className="mb-1 block text-sm font-medium text-[var(--foreground)]"
            >
              Description
            </label>
            <textarea
              id="create-description"
              rows={3}
              value={createForm.description}
              onChange={(e) =>
                setCreateForm((f) => ({
                  ...f,
                  description: e.target.value,
                }))
              }
              placeholder="Short product description..."
              className={INPUT_CLASS}
            />
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              Create item
            </button>
            <button
              type="button"
              onClick={closeCreateModal}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--card-hover)]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
