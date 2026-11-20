import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { site } from "@/lib/site";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  serviceType: z.enum(["PENDANT", "PAIR", "CARVING", "INTARSIA", "OTHER"]),
  description: z.string().min(10).max(5000),
  budgetUsd: z.number().nullable().optional(),
  timeline: z.string().max(200).optional().default(""),
  // Link gambar referensi (tanpa upload anonim) — URL publik yang ditempel user
  referenceImages: z
    .array(z.string().url().max(500).refine((v) => /^https?:\/\//.test(v), "http(s) only"))
    .max(5)
    .optional()
    .default([]),
});

export async function POST(req: Request) {
  const limit = rateLimit(`custom:${clientIp(req)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many inquiries — try again in a few minutes, or email us directly." },
      { status: 429 },
    );
  }
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const row = await prisma.customOrder.create({
      data: {
        name: data.name,
        email: data.email,
        serviceType: data.serviceType,
        description: data.description,
        budgetUsd: data.budgetUsd ?? null,
        timeline: data.timeline,
        referenceImages: data.referenceImages.length > 0 ? data.referenceImages : undefined,
        status: "NEW",
      },
    });

    // Notifikasi admin (best-effort — jangan gagalkan submit bila email error)
    const refsHtml =
      data.referenceImages.length > 0
        ? `<p>References:<br/>${data.referenceImages
            .map((u) => `<a href="${u.replace(/"/g, "%22")}">${u.replace(/</g, "&lt;")}</a>`)
            .join("<br/>")}</p>`
        : "";
    await sendMail({
      to: process.env.ADMIN_EMAIL ?? site.email,
      subject: `New custom order inquiry — ${data.serviceType.toLowerCase()} from ${data.name}`,
      html: `<p><b>${data.name}</b> (${data.email})</p>
             <p>Service: <b>${data.serviceType}</b> · Budget: ${data.budgetUsd ? "$" + data.budgetUsd : "—"} · Timeline: ${data.timeline || "—"}</p>
             <p>${data.description.replace(/</g, "&lt;").replace(/\n/g, "<br/>")}</p>
             ${refsHtml}
             <p><a href="${site.url}/admin/custom-orders">Open admin inbox</a></p>`,
    }).catch(() => undefined);

    return NextResponse.json({ ok: true, id: row.id });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
