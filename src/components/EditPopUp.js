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

export default function EditPopUp({
  editingProduct,
  closeEditModal,
  customProducts,
  editForm,
  setEditForm,
  editError,
  handleEditSubmit,
}) {
  const fileInputRef = useRef(null);
  if (!editingProduct) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div
        className="absolute inset-0 bg-[var(--foreground)]/40"
        onClick={closeEditModal}
        aria-hidden="true"
      />
      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
        <div className="shrink-0 border-b border-[var(--border)] px-6 py-4">
          <h2
            id="edit-modal-title"
            className="text-lg font-semibold text-[var(--foreground)]"
          >
            Edit item
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {customProducts.some((p) => p.slug === editingProduct.slug)
              ? "Changes are saved in this browser."
              : "Built-in product: only stock is saved. Other fields are for display."}
          </p>
        </div>
        <form onSubmit={handleEditSubmit} className="min-h-0 flex-1 overflow-y-auto space-y-4 p-6">
          {editError && (
            <p
              className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {editError}
            </p>
          )}
          <div>
            <label
              htmlFor="edit-title"
              className="mb-1 block text-sm font-medium text-[var(--foreground)]"
            >
              Title *
            </label>
            <input
              id="edit-title"
              type="text"
              value={editForm.title}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, title: e.target.value }))
              }
              className={`w-full ${INPUT_CLASS}`}
            />
          </div>
          <div>
            <span className="mb-1 block text-sm font-medium text-[var(--foreground)]">
              Image
            </span>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
              <div className="flex shrink-0 items-center gap-3">
                {editForm.imageSrc ? (
                  <div className="relative">
                    <img
                      src={editForm.imageSrc}
                      alt=""
                      className="h-24 w-24 rounded-lg border border-[var(--border)] object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditForm((f) => ({ ...f, imageSrc: "" }))
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
                    if (file) readFileAsDataUrl(file, setEditForm);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--card-hover)]"
                >
                  {editForm.imageSrc ? "Change image" : "Upload image"}
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-category"
                className="mb-1 block text-sm font-medium text-[var(--foreground)]"
              >
                Category *
              </label>
              <input
                id="edit-category"
                type="text"
                list="edit-category-list"
                value={editForm.category}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, category: e.target.value }))
                }
                className={`w-full ${INPUT_CLASS}`}
              />
              <datalist id="edit-category-list">
                {DEFAULT_CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label
                htmlFor="edit-price-store"
                className="mb-1 block text-sm font-medium text-[var(--foreground)]"
              >
                Price sell store
              </label>
              <input
                id="edit-price-store"
                type="text"
                value={editForm.priceStore}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, priceStore: e.target.value }))
                }
                className={`w-full ${INPUT_CLASS}`}
              />
            </div>
            <div>
              <label
                htmlFor="edit-price-customer"
                className="mb-1 block text-sm font-medium text-[var(--foreground)]"
              >
                Price sell to customer
              </label>
              <input
                id="edit-price-customer"
                type="text"
                value={editForm.priceCustomer}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, priceCustomer: e.target.value }))
                }
                className={`w-full ${INPUT_CLASS}`}
              />
            </div>
            <div>
              <label
                htmlFor="edit-stock"
                className="mb-1 block text-sm font-medium text-[var(--foreground)]"
              >
                Stock
              </label>
              <input
                id="edit-stock"
                type="number"
                min={0}
                value={editForm.stock === 0 ? "" : editForm.stock}
                onChange={(e) =>
                  setEditForm((f) => ({
                    ...f,
                    stock: e.target.value === "" ? 0 : Number(e.target.value),
                  }))
                }
                className={INPUT_CLASS}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="edit-sizes"
              className="mb-1 block text-sm font-medium text-[var(--foreground)]"
            >
              Sizes
            </label>
            <input
              id="edit-sizes"
              type="text"
              value={editForm.sizes}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, sizes: e.target.value }))
              }
              className={`w-full ${INPUT_CLASS}`}
            />
          </div>
          <div>
            <label
              htmlFor="edit-description"
              className="mb-1 block text-sm font-medium text-[var(--foreground)]"
            >
              Description
            </label>
            <textarea
              id="edit-description"
              rows={3}
              value={editForm.description}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, description: e.target.value }))
              }
              className={`w-full ${INPUT_CLASS}`}
            />
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={closeEditModal}
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
