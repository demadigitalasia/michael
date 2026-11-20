import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 400 });
  }

  // Brute-force guard dua lapis: 5 percobaan per IP+email (rotasi email tidak lolos)
  // dan 20 percobaan per IP per 15 menit (bukan nge-brute banyak akun sekaligus).
  const ip = clientIp(req);
  const ipLimit = rateLimit(`login-ip:${ip}`, 20, LOGIN_WINDOW_MS);
  if (!ipLimit.ok) {
    return NextResponse.json(
      { error: `Too many attempts — try again in ${Math.ceil(ipLimit.retryAfterSec / 60)} min` },
      { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSec) } },
    );
  }
  const email = String((body as { email?: string }).email ?? "").toLowerCase();
  const limit = rateLimit(`login:${ip}:${email}`, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Too many attempts — try again in ${Math.ceil(limit.retryAfterSec / 60)} min` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  try {
    const { email: validEmail, password } = schema.parse(body);
    const admin = await prisma.adminUser.findUnique({ where: { email: validEmail.toLowerCase() } });
    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      // Delay acak kecil memperlambat guessing tanpa mengganggu user sah
      await new Promise((r) => setTimeout(r, 150 + Math.random() * 350));
      return NextResponse.json({ error: "Wrong email or password" }, { status: 401 });
    }
    await createSession(admin.email);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 400 });
  }
}
