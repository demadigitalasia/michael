import { NextResponse } from "next/server";
import { createReadStream, existsSync, statSync } from "node:fs";
import { join, normalize, extname, sep } from "node:path";
import { Readable } from "node:stream";
import type { ReadableStream as WebReadableStream } from "node:stream/web";

export const runtime = "nodejs";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

/** Melayani foto dari UPLOAD_DIR (volume VPS) di path publik /media/*. */
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const dir = process.env.UPLOAD_DIR ?? "./uploads";
  // Next sudah decode segmen path — cukup join+normalize. Prefix check pakai
  // pemisah direktori agar direktori sibling (uploads2) tidak lolos.
  const root = normalize(dir);
  const safe = normalize(join(root, ...path));
  if (!safe.startsWith(root + sep) || !existsSync(safe) || !statSync(safe).isFile()) {
    return new NextResponse("Not found", { status: 404 });
  }
  const type = MIME[extname(safe).toLowerCase()] ?? "application/octet-stream";
  const stream = Readable.toWeb(createReadStream(safe)) as WebReadableStream<Uint8Array>;
  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
