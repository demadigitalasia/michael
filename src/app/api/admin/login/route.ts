import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const { email, password } = schema.parse(await req.json());
    const admin = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });
    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      return NextResponse.json({ error: "Wrong email or password" }, { status: 401 });
    }
    await createSession(admin.email);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 400 });
  }
}
