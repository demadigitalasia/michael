import { site } from "@/lib/site";

export const metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <p className="eyebrow text-ink/60">Legal</p>
      <h1 className="display mt-3 text-[clamp(36px,5vw,64px)] text-ink">Privacy policy</h1>
      <div className="body-muted mt-8 space-y-6 text-[15.5px] leading-relaxed">
        <p>We collect only what we need to sell you a stone: your name, email and shipping address for order fulfilment, and your email if you join the monthly letter.</p>
        <p>We do not sell, rent or share your data with anyone except the processors required to fulfil an order (payment: Stripe; email delivery: our email provider). Payment card details never touch our servers — Stripe handles them directly.</p>
        <p>Analytics, where enabled, are aggregate and anonymous.</p>
        <p>You can ask for a copy or deletion of your data at any time by emailing {site.email}. Order records we must keep for tax and warranty purposes are the exception.</p>
        <p>This policy was last updated on 12 November 2026.</p>
      </div>
    </article>
  );
}
