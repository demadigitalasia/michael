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
      const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
      writeFileSync(join(dir, name), Buffer.from(await file.arrayBuffer()));
      urls.push(`/media/${name}`);
    }
    return NextResponse.json({ urls });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
