import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { contactFormHtml, sendMail } from "@/lib/mail";
import { site } from "@/lib/site";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  message: z.string().min(1).max(5000),
});

/**
 * Form Contact → email ke admin (reply-to alamat pengirim).
 * Rate limit 5 pesan / 10 menit per IP (lib/rate-limit, pola yang sama dengan login).
 */
export async function POST(req: Request) {
  const limit = rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many messages — try again in a few minutes, or email us directly." },
      { status: 429 },
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete every field" }, { status: 400 });
  }
  const { name, email, message } = parsed.data;

  const sent = await sendMail({
    to: site.email,
    replyTo: email,
    subject: `Contact form — ${name}`,
    html: contactFormHtml({ name, email, message }),
  });
  if (!sent) {
    return NextResponse.json(
      { error: `Could not send right now — email us directly at ${site.email}` },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true });
}
