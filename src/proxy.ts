import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Proteksi /admin/* (kecuali login) — verifikasi JWT session cookie.
 * Ringan dan cepat: verifikasi di proxy, query DB hanya di halaman.
 * (Next.js 16: konvensi middleware.ts → proxy.ts)
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get("ml_admin")?.value;
  const ok = token
    ? await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-only-secret-ganti-di-production"))
        .then(() => true)
        .catch(() => false)
    : false;

  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
