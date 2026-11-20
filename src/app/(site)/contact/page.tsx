import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";

export const metadata = {
  title: "Contact",
  description: "Email the workshop about stones, custom work or anything else — replies within two working days.",
};

const INFO = [
  { label: "Email", value: site.email },
  { label: "Response time", value: "Within two working days" },
  { label: "Workshop", value: "The bench — location shared with buyers before dispatch" },
  { label: "Shipping from", value: "Tracked & insured, worldwide" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-12">
      <Reveal>
        <p className="eyebrow text-ink/60">Contact</p>
        <h1 className="display mt-3 text-[clamp(44px,7vw,96px)] text-ink">Talk to the bench</h1>
        <p className="body-muted mt-4 max-w-[56ch] text-[17px] leading-relaxed">
          Questions about a stone, a setting, or an idea you want cut — everything starts with a conversation.
        </p>
      </Reveal>

      {/* Info grid */}
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {INFO.map((i, idx) => (
          <Reveal key={i.label} delay={idx * 90}>
            <div className="border-t border-ink/15 pt-4">
              <p className="eyebrow text-ink/60">{i.label}</p>
              <p className="mt-2 text-[15px] font-medium text-ink">{i.value}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Form */}
      <section className="mt-16 max-w-3xl">
        <Reveal>
          <h2 className="display text-[clamp(32px,4vw,56px)] text-ink">Write to us</h2>
          <p className="body-muted mt-3 text-[15.5px] leading-relaxed">
            The fastest way to reach the bench. For custom work, use the custom form — it captures the details we
            need to quote.
          </p>
        </Reveal>
        <Reveal className="mt-8" delay={90}>
          <ContactForm />
        </Reveal>
      </section>
    </div>
  );
}
