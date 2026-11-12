import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/** Kirim email transaksional (Resend). No-op aman saat API key belum diisi (dev). */
export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.log(`[mail:noop] to=${to} subject=${subject}`);
    return;
  }
  const from = process.env.EMAIL_FROM ?? "Michael Lapidary <onboarding@resend.dev>";
  try {
    await resend.emails.send({ from, to, subject, html });
  } catch (e) {
    console.error(`[mail:error] to=${to} subject="${subject}"`, e);
  }
}

export function orderConfirmationHtml(opts: {
  orderNumber: string;
  items: { title: string; priceCents: number }[];
  totalCents: number;
  siteUrl: string;
}) {
  const rows = opts.items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e1da">${i.title}</td><td align="right" style="padding:8px 0;border-bottom:1px solid #e5e1da">$${(i.priceCents / 100).toFixed(2)}</td></tr>`,
    )
    .join("");
  return `
  <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:560px;margin:0 auto;background:#E9E5DE;padding:32px;color:#121214">
    <p style="font-size:11px;letter-spacing:.14em;font-weight:700;margin:0">MICHAEL LAPIDARY</p>
    <h1 style="font-size:28px;text-transform:uppercase;letter-spacing:-.01em;margin:16px 0 8px">Order ${opts.orderNumber}</h1>
    <p style="color:rgba(18,18,20,.72);line-height:1.55">Thank you — your stones are being packed. Every piece is one of a kind and shipped tracked &amp; insured.</p>
    <table style="width:100%;border-collapse:collapse;margin:24px 0">${rows}
      <tr><td style="padding:12px 0;font-weight:700">Total</td><td align="right" style="padding:12px 0;font-weight:700">$${(opts.totalCents / 100).toFixed(2)}</td></tr>
    </table>
    <p style="font-size:13px;color:rgba(18,18,20,.6)">Questions? Just reply to this email — a human reads it.</p>
  </div>`;
}

export function shippedHtml(opts: { orderNumber: string; trackingNumber: string; courier: string; siteUrl: string }) {
  return `
  <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:560px;margin:0 auto;background:#E9E5DE;padding:32px;color:#121214">
    <p style="font-size:11px;letter-spacing:.14em;font-weight:700;margin:0">MICHAEL LAPIDARY</p>
    <h1 style="font-size:28px;text-transform:uppercase;letter-spacing:-.01em;margin:16px 0 8px">Your stones are on their way</h1>
    <p style="color:rgba(18,18,20,.72);line-height:1.55">Order <b>${opts.orderNumber}</b> shipped via ${opts.courier}.</p>
    <p style="font-family:ui-monospace,monospace;font-size:18px;letter-spacing:.05em;background:#141415;color:#ECE8E1;padding:12px 16px;border-radius:4px">${opts.trackingNumber}</p>
    <p style="font-size:13px;color:rgba(18,18,20,.6)">Care guides for your specific stones are in the parcel.</p>
  </div>`;
}
