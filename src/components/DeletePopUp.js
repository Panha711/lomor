export default function DeletePopUp({
  productToDelete,
  setProductToDelete,
  confirmDelete,
}) {
  if (!productToDelete) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div
        className="absolute inset-0 bg-[var(--foreground)]/40"
        onClick={() => setProductToDelete(null)}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
        <h2
          id="delete-modal-title"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          Delete item
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Are you sure you want to delete{" "}
          <strong className="text-[var(--foreground)]">
            {productToDelete.title}
          </strong>
          ? This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setProductToDelete(null)}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--card-hover)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
