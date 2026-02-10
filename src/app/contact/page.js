"use client";

import { useState } from "react";
import { Header, Footer } from "@/components";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
      <Header />

      <main className="mx-auto max-w-[720px] px-6 py-12 md:py-20">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
          Contact
        </h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
          Get in touch
        </p>
        <p className="mt-6 text-[15px] leading-relaxed text-[var(--muted)]">
          Have a question, feedback, or want to work with us? Send a message and we’ll get back
          to you as soon as we can.
        </p>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Contact info
            </h2>
            <ul className="mt-4 space-y-3 text-[15px] text-[var(--foreground)]">
              <li>
                <span className="text-[var(--muted)]">Email</span>
                <br />
                <a
                  href="mailto:hello@lomor.com"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  hello@lomor.com
                </a>
              </li>
              <li>
                <span className="text-[var(--muted)]">Address</span>
                <br />
                <span>123 Store Street, City, 100-0001</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            {submitted ? (
              <p className="text-[15px] text-[var(--muted)]">
                Thanks for your message. We’ll be in touch soon.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[15px] text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[15px] text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="mt-1.5 w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[15px] text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
                    placeholder="Your message"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[var(--foreground)] py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
