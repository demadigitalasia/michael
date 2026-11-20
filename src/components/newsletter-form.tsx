"use client";

import { useState } from "react";

/** Form newsletter homepage — POST /api/newsletter (ganti mailto). */
export function NewsletterForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [email, setEmail] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setState("sent");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <p className="eyebrow mt-8 text-gold">
        You’re in — your first letter arrives with the next batch. Welcome.
      </p>
    );
  }

  return (
    <div className="mt-8 max-w-md">
      <form onSubmit={submit} className="flex items-center gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="h-[46px] w-full rounded-full border border-milk/25 bg-transparent px-5 text-[15px] text-milk placeholder:text-milk/40 focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="h-[46px] flex-none rounded-full bg-milk px-5 text-[15px] font-medium text-ink transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-60"
        >
          {state === "sending" ? "…" : "Join"}
        </button>
      </form>
      {state === "error" && (
        <p className="mt-3 text-[13px] text-oxide">Couldn’t sign you up — try again in a moment.</p>
      )}
    </div>
  );
}
