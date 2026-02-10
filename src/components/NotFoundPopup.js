"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFoundPopup({
  title = "Not found",
  message = "The page you're looking for doesn't exist.",
  backHref = "/",
  backLabel = "Back to shop",
}) {
  const router = useRouter();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) router.push(backHref);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--foreground)]/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="not-found-title"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="not-found-title" className="text-lg font-semibold text-[var(--foreground)]">
          {title}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{message}</p>
        <Link
          href={backHref}
          className="mt-6 block w-full rounded-full bg-[var(--foreground)] py-3 text-center text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
