import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";
import { site } from "@/lib/site";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  serviceType: z.enum(["PENDANT", "PAIR", "CARVING", "INTARSIA", "OTHER"]),
  description: z.string().min(10).max(5000),
  budgetUsd: z.number().nullable().optional(),
  timeline: z.string().max(200).optional().default(""),
});

export async function POST(req: Request) {
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
        status: "NEW",
      },
    });

    // Notifikasi admin (best-effort — jangan gagalkan submit bila email error)
    await sendMail({
      to: process.env.ADMIN_EMAIL ?? site.email,
      subject: `New custom order inquiry — ${data.serviceType.toLowerCase()} from ${data.name}`,
      html: `<p><b>${data.name}</b> (${data.email})</p>
             <p>Service: <b>${data.serviceType}</b> · Budget: ${data.budgetUsd ? "$" + data.budgetUsd : "—"} · Timeline: ${data.timeline || "—"}</p>
             <p>${data.description.replace(/</g, "&lt;").replace(/\n/g, "<br/>")}</p>
             <p><a href="${site.url}/admin/custom-orders">Open admin inbox</a></p>`,
    }).catch(() => undefined);

    return NextResponse.json({ ok: true, id: row.id });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
