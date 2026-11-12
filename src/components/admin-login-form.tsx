"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Login failed");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const field =
    "h-[46px] w-full rounded-[4px] border border-milk/25 bg-transparent px-4 text-[15px] text-milk placeholder:text-milk/40 focus:outline-none focus:ring-1 focus:ring-gold";

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4">
      <input name="email" type="email" required placeholder="Email" className={field} />
      <input name="password" type="password" required placeholder="Password" className={field} />
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-[46px] items-center justify-center gap-2.5 rounded-full bg-milk px-5 text-[15px] font-medium text-ink transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-60"
      >
        {loading ? "Checking…" : "Sign in →"}
      </button>
      {error && <p className="text-[13px] text-oxide">{error}</p>}
    </form>
  );
}
