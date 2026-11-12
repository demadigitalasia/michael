import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  metaTitle: z.string().max(70).default(""),
  metaDescription: z.string().max(200).default(""),
  ogImageUrl: z.string().max(300).default(""),
  googleSiteVerification: z.string().max(200).default(""),
  instagramUrl: z
    .string()
    .max(200)
    .refine((v) => v === "" || /^https?:\/\/.+\..+/.test(v), "Instagram URL is not valid")
    .default(""),
});

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const data = schema.parse(await req.json());
    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
