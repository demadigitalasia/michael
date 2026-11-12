export const metadata = { title: "Terms of service" };

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <p className="eyebrow text-ink/60">Legal</p>
      <h1 className="display mt-3 text-[clamp(36px,5vw,64px)] text-ink">Terms of service</h1>
      <div className="body-muted mt-8 space-y-6 text-[15.5px] leading-relaxed">
        <p><b>One of a kind.</b> Every piece on this site is unique. When it sells, it is gone. Reservations expire after 30 minutes; the first completed payment owns the stone.</p>
        <p><b>Pricing & payment.</b> Prices are in USD and include our disclosure of any treatment. Payment is taken in full at checkout through Stripe; we never see your card details.</p>
        <p><b>Shipping.</b> Tracked and insured worldwide, dispatched within 1–2 business days. Import duties, where applicable, are the buyer’s responsibility; parcels are declared at full value.</p>
        <p><b>Returns.</b> 14 days from delivery, unworn and as shipped, for any reason. Return postage is the buyer’s; original postage is refunded where the item is faulty or not as described.</p>
        <p><b>Custom work.</b> Quoted as a fixed price after the drawing stage. Progress photos are sent during cutting; substantial changes after approval may affect price and timeline.</p>
        <p><b>Accuracy.</b> Stones are photographed exactly as they are, including inclusions and flaws, with measurements to the tenth of a millimetre where stated. Colour varies between screens.</p>
        <p><b>Liability.</b> Our liability is limited to the purchase price of the item, except where the law says otherwise.</p>
        <p>Last updated: 12 November 2026.</p>
      </div>
    </article>
  );
}
