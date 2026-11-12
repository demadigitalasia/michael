import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ email: z.string().email().max(200) });

/** Pendaftaran letter bulanan (homepage newsletter). Idempoten per email. */
export async function POST(req: Request) {
  try {
    const { email } = schema.parse(await req.json());
    await prisma.newsletterSubscriber.upsert({
      where: { email: email.toLowerCase() },
      update: {},
      create: { email: email.toLowerCase() },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
