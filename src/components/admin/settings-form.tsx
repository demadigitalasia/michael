"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export type SettingsData = {
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  googleSiteVerification: string;
  instagramUrl: string;
};

const field = "h-[42px] w-full rounded-[4px] border border-ink/20 bg-transparent px-3 text-[14px] text-ink focus:outline-none focus:ring-1 focus:ring-gold";
const label = "eyebrow text-ink/60";

/** Form Settings admin: SEO global + OG image + verifikasi + sosial. */
export function SettingsForm({ settings }: { settings: SettingsData }) {
  const router = useRouter();
  const [form, setForm] = useState(settings);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadOg(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("files", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setForm((f) => ({ ...f, ogImageUrl: data.urls[0] }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="grid gap-4">
        <label className="grid gap-1.5">
          <span className={label}>Default tab title</span>
          <input
            value={form.metaTitle}
            onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
            maxLength={70}
            placeholder="Michael Lapidary · One stone at a time"
            className={field}
          />
          <span className="text-[11px] text-ink/40">{form.metaTitle.length}/70</span>
        </label>
        <label className="grid gap-1.5">
          <span className={label}>Default meta description</span>
          <textarea
            value={form.metaDescription}
            onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
            maxLength={200}
            rows={3}
            placeholder="Cabochons, slabs and rough cut by hand from semi-precious stone…"
            className="rounded-[4px] border border-ink/20 bg-transparent p-3 text-[14px] leading-relaxed text-ink focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <span className="text-[11px] text-ink/40">{form.metaDescription.length}/200</span>
        </label>
        <label className="grid gap-1.5">
          <span className={label}>Google Search Console — verification code</span>
          <input
            value={form.googleSiteVerification}
            onChange={(e) => setForm({ ...form, googleSiteVerification: e.target.value })}
            placeholder="Isi dari meta tag google-site-verification"
            className={field}
          />
        </label>
        <label className="grid gap-1.5">
          <span className={label}>Instagram URL (opsional, untuk structured data)</span>
          <input
            value={form.instagramUrl}
            onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
            placeholder="https://instagram.com/michaellapidary"
            className={field}
          />
        </label>
      </div>

      {/* OG image */}
      <div>
        <p className={label}>OG image — thumbnail saat link dibagikan (WA/IG/FB)</p>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void uploadOg(e.dataTransfer.files?.[0]);
          }}
          onClick={() => fileRef.current?.click()}
          className="mt-2 grid cursor-pointer place-items-center rounded-[4px] border border-dashed border-ink/30 bg-sketch p-6 text-center"
        >
          <span className="eyebrow text-ink/60">{uploading ? "Uploading…" : "Drop image or click — 1200×630 disarankan"}</span>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => void uploadOg(e.target.files?.[0])} />
        </div>
        {form.ogImageUrl && (
          <div className="mt-3">
            <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-[4px] border border-ink/10 bg-phold">
              <Image src={form.ogImageUrl} alt="OG preview" fill sizes="360px" className="object-cover" unoptimized={form.ogImageUrl.endsWith(".svg")} />
            </div>
            <button type="button" onClick={() => setForm({ ...form, ogImageUrl: "" })} className="eyebrow mt-2 text-oxide">
              Remove
            </button>
          </div>
        )}

        <button
          onClick={save}
          disabled={saving}
          className="mt-6 inline-flex h-[46px] w-full items-center justify-center gap-2.5 rounded-full bg-ink px-5 text-[15px] font-medium text-milk transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save settings →"}
        </button>
        {saved && <p className="eyebrow mt-3 text-gold">Saved — berlaku di seluruh situs.</p>}
        {error && <p className="mt-3 text-[13px] text-oxide">{error}</p>}
      </div>
    </div>
  );
}
