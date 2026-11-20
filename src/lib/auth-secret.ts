/**
 * Secret sesi admin — dipakai proxy (edge) dan lib/auth (node).
 * Fail-fast di production: tanpa AUTH_SECRET (min 32 char), JWT sesi bisa
 * dipalsukan siapa pun. Dev tetap memakai fallback agar onboarding mudah.
 */
export function authSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32)) {
    throw new Error("AUTH_SECRET must be set to at least 32 characters in production");
  }
  return new TextEncoder().encode(secret || "dev-only-secret-ganti-di-production");
}
