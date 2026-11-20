import { existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "@/lib/prisma";

/**
 * Hapus file /media/<name> yang sudah tak direferensikan di mana pun
 * (ProductImage lain maupun SiteSettings.ogImageUrl) — dipanggil saat foto
 * produk dilepas dari form / produk dihapus. Best-effort: gagal unlink
 * tidak boleh menggagalkan operasi utama.
 */
export async function cleanupMediaFiles(urls: string[]): Promise<void> {
  const media = urls.filter((u) => u.startsWith("/media/"));
  if (media.length === 0) return;

  const [stillUsedRows, ogRows] = await Promise.all([
    prisma.productImage.findMany({ where: { url: { in: media } }, select: { url: true }, distinct: ["url"] }),
    prisma.siteSettings.findMany({ where: { ogImageUrl: { in: media } }, select: { ogImageUrl: true } }),
  ]);
  const stillUsed = new Set([...stillUsedRows.map((r) => r.url), ...ogRows.map((r) => r.ogImageUrl)]);

  const dir = process.env.UPLOAD_DIR ?? "./uploads";
  for (const url of media) {
    if (stillUsed.has(url)) continue;
    const name = url.slice("/media/".length);
    if (!name || name.includes("/") || name.includes("..")) continue; // file kita flat — abaikan path aneh
    try {
      const file = join(dir, name);
      if (existsSync(file)) unlinkSync(file);
    } catch {
      // biarkan file yatim — bisa dibersihkan manual
    }
  }
}
