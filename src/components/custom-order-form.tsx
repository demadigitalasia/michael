"use client";

import { useState } from "react";

/**
 * Form Custom Order (PRD F-17) → POST /api/custom-orders → tersimpan ke DB
 * + email notifikasi admin. Reply "within two working days".
 */
export function CustomOrderForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState("sending");
    try {
      const res = await fetch("/api/custom-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          serviceType: fd.get("serviceType"),
          description: fd.get("description"),
          budgetUsd: fd.get("budgetUsd") || null,
          timeline: fd.get("timeline"),
        }),
      });
      if (!res.ok) throw new Error();
      setState("sent");
      form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-[6px] border border-ink/15 bg-sketch p-8">
        <p className="eyebrow text-ink/60">Received</p>
        <h3 className="mt-3 text-[19px] font-semibold text-ink">Thank you — it’s on the bench desk</h3>
        <p className="body-muted mt-2 max-w-[46ch] text-[14.5px] leading-normal">
          We reply within two working days with questions, a rough price and next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="eyebrow text-ink/60">Your name</span>
          <input name="name" required className="h-[46px] rounded-[4px] border border-ink/20 bg-transparent px-4 text-[15px] text-ink focus:outline-none focus:ring-1 focus:ring-gold" />
        </label>
        <label className="grid gap-1.5">
          <span className="eyebrow text-ink/60">Email</span>
          <input name="email" type="email" required className="h-[46px] rounded-[4px] border border-ink/20 bg-transparent px-4 text-[15px] text-ink focus:outline-none focus:ring-1 focus:ring-gold" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="grid gap-1.5">
          <span className="eyebrow text-ink/60">Service</span>
          <select name="serviceType" required defaultValue="" className="h-[46px] rounded-[4px] border border-ink/20 bg-transparent px-4 text-[15px] text-ink focus:outline-none focus:ring-1 focus:ring-gold">
            <option value="" disabled>Choose…</option>
            <option value="PENDANT">Pendant</option>
            <option value="PAIR">Matched pair</option>
            <option value="CARVING">Carving</option>
            <option value="INTARSIA">Intarsia</option>
            <option value="OTHER">Something else</option>
          </select>
        </label>
        <label className="grid gap-1.5">
          <span className="eyebrow text-ink/60">Budget (USD, optional)</span>
          <input name="budgetUsd" type="number" min="0" className="h-[46px] rounded-[4px] border border-ink/20 bg-transparent px-4 text-[15px] text-ink focus:outline-none focus:ring-1 focus:ring-gold" />
        </label>
        <label className="grid gap-1.5">
          <span className="eyebrow text-ink/60">Timeline</span>
          <input name="timeline" placeholder="e.g. before December" className="h-[46px] rounded-[4px] border border-ink/20 bg-transparent px-4 text-[15px] text-ink focus:outline-none focus:ring-1 focus:ring-gold" />
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="eyebrow text-ink/60">What are you thinking of?</span>
        <textarea name="description" required rows={5} className="rounded-[4px] border border-ink/20 bg-transparent p-4 text-[15px] leading-relaxed text-ink focus:outline-none focus:ring-1 focus:ring-gold" />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex h-[46px] items-center gap-2.5 rounded-full bg-ink px-5 text-[15px] font-medium text-milk transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Send it to the bench"} <span aria-hidden>→</span>
        </button>
        <p className="eyebrow text-ink/50">We never share your details. Replies within two working days.</p>
      </div>
      {state === "error" && <p className="text-[13px] text-oxide">Something went wrong — please try again.</p>}
    </form>
  );
}
