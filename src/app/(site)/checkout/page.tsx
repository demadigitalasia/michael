import { CheckoutFlow } from "@/components/checkout-flow";
import { getCartItems, getCartToken } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const token = await getCartToken();
  const items = await getCartItems(token);
  const rates = await prisma.shippingRate.findMany({ where: { active: true }, orderBy: { priceCents: "asc" } });

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-12">
        <p className="eyebrow text-ink/60">Checkout</p>
        <h1 className="display mt-3 text-[clamp(44px,7vw,96px)] text-ink">Nothing to check out</h1>
        <p className="body-muted mt-4 text-[15.5px]">Add a stone to your bag first.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-12">
      <p className="eyebrow text-ink/60">
        Checkout · {items.length} {items.length === 1 ? "piece" : "pieces"}
      </p>
      <h1 className="display mt-3 text-[clamp(44px,7vw,96px)] text-ink">Three steps, then it’s yours</h1>
      <div className="mt-12">
        <CheckoutFlow items={items} rates={rates} />
      </div>
    </div>
  );
}
