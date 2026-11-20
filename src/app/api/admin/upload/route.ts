import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

/**
 * Deteksi tipe file dari magic bytes (bukan percaya MIME dari client,
 * yang bisa dipalsukan). Return null bila bukan gambar yang dikenal.
 */
function sniffImageType(buf: Uint8Array): "jpg" | "png" | "webp" | "avif" | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return "webp";
  // ISO BMFF (AVIF/HEIF): "ftyp" di offset 4, brand di offset 8
  if (buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) {
    const brand = String.fromCharCode(buf[8], buf[9], buf[10], buf[11]);
    if (brand === "avif" || brand === "avis" || brand === "mif1" || brand === "msf1") return "avif";
  }
  return null;
}

/**
 * Upload foto produk → disimpan ke UPLOAD_DIR (volume VPS di production).
 * Dilayani publik lewat /media/[...path] — tidak butuh S3/pihak ketiga.
 */
export async function POST(req: Request) {
  try {
    await requireAdmin();
    const form = await req.formData();
    const files = form.getAll("files").filter((f): f is File => f instanceof File);
    if (files.length === 0) return NextResponse.json({ error: "No files" }, { status: 400 });

    const dir = process.env.UPLOAD_DIR ?? "./uploads";
    mkdirSync(dir, { recursive: true });

    const urls: string[] = [];
    for (const file of files) {
      const ext = ALLOWED.get(file.type);
      if (!ext) return NextResponse.json({ error: `Unsupported type: ${file.type}` }, { status: 415 });
      if (file.size > 15 * 1024 * 1024) return NextResponse.json({ error: `${file.name} is over 15 MB` }, { status: 413 });
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (sniffImageType(bytes) !== ext) {
        return NextResponse.json({ error: `${file.name}: content doesn't look like a real ${file.type}` }, { status: 415 });
      }
      const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
      writeFileSync(join(dir, name), bytes);
      urls.push(`/media/${name}`);
    }
    return NextResponse.json({ urls });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
