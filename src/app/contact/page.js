"use client";

import { useState } from "react";
import { Header, Footer } from "@/components";

const INPUT_CLASS =
  "mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[15px] text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] transition-colors focus:ring-1 focus:ring-[var(--accent)]/20";

const contactItems = [
  {
    label: "Email",
    value: "hello@lomor.com",
    href: "mailto:hello@lomor.com",
  },
  {
    label: "Address",
    value: "123 Store Street, City, 100-0001",
    href: null,
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
      <Header />

      <main className="mx-auto max-w-[900px] px-6 py-14 sm:py-20">
        {/* Hero block */}
        <header className="mb-16 text-center sm:mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Get in touch
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl md:text-5xl">
            Contact
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[var(--muted)]">
            Have a question, feedback, or want to work with us? Send a message
            and we’ll get back to you as soon as we can.
          </p>
        </header>

        <div className="grid gap-12 lg:grid-cols-[1fr,1.1fr] lg:gap-16">
          {/* Contact info */}
          <aside className="lg:pt-1">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
              Contact info
            </h2>
            <ul className="mt-6 space-y-6">
              {contactItems.map((item) => (
                <li key={item.label}>
                  <span className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                    {item.label}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-1 block text-[15px] font-medium text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="mt-1 block text-[15px] text-[var(--foreground)]">
                      {item.value}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-10 hidden border-l-2 border-[var(--accent)]/30 pl-6 lg:block">
              <p className="text-sm italic leading-relaxed text-[var(--muted)]">
                We usually reply within 1–2 business days.
              </p>
            </div>
          </aside>

          {/* Form card */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_4px_24px_-4px_rgba(28,27,25,0.06)] sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center sm:py-16">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[var(--foreground)]">
                  Message sent
                </h3>
                <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-[var(--muted)]">
                  Thanks for reaching out. We’ll be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="text-sm font-medium text-[var(--foreground)]"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    className={INPUT_CLASS}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="text-sm font-medium text-[var(--foreground)]"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    className={INPUT_CLASS}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="text-sm font-medium text-[var(--foreground)]"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    className={`${INPUT_CLASS} resize-y min-h-[120px]`}
                    placeholder="Your message"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[var(--foreground)] py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:ring-offset-2"
                >
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Mobile note */}
        <p className="mt-10 text-center text-sm text-[var(--muted)] lg:hidden">
          We usually reply within 1–2 business days.
        </p>
      </main>

      <Footer />
    </div>
  );
}
