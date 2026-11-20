"use client";

import { useState } from "react";
import { ArrowRight } from "@/components/icons";
import { site } from "@/lib/site";

/**
 * Form Contact — POST /api/contact (email ke admin, reply-to pengirim).
 * Mengganti mailto yang membuang isian (audit UX r4, P1).
 */
export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fd.get("name"), email: fd.get("email"), message: fd.get("message") }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setState("sent");
      form.reset();
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-[6px] border border-ink/15 bg-sketch p-8">
        <p className="eyebrow text-ink/60">Sent</p>
        <h3 className="mt-3 text-[19px] font-semibold text-ink">Thank you — it’s on the bench desk</h3>
        <p className="body-muted mt-2 max-w-[46ch] text-[14.5px] leading-normal">
          We reply within two working days. Anything urgent, email {site.email} directly.
        </p>
      </div>
    );
  }

  const field =
    "h-[46px] w-full rounded-[4px] border border-ink/20 bg-transparent px-4 text-[15px] text-ink focus:outline-none focus:ring-1 focus:ring-gold";

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="eyebrow text-ink/60">Your name</span>
          <input name="name" required className={field} />
        </label>
        <label className="grid gap-1.5">
          <span className="eyebrow text-ink/60">Email</span>
          <input name="email" type="email" required className={field} />
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="eyebrow text-ink/60">What can we help with?</span>
        <textarea
          name="message"
          required
          rows={5}
          className="rounded-[4px] border border-ink/20 bg-transparent p-4 text-[15px] leading-relaxed text-ink focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex h-[46px] items-center gap-2.5 rounded-full bg-ink px-5 text-[15px] font-medium text-milk transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Send message"} <ArrowRight className="size-4" aria-hidden="true" />
        </button>
        <p className="eyebrow text-ink/50">We never share your details.</p>
      </div>
      {state === "error" && (
        <p className="text-[13px] text-oxide">{error ?? "Something went wrong — please try again."}</p>
      )}
    </form>
  );
}
