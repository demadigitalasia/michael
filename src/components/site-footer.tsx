import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { getSettings } from "@/lib/settings";
import { site } from "@/lib/site";

/** Footer — gaya referensi: kolom nav + visit + legal, wordmark besar. Kontak (email/IG) dari admin Settings. */
export async function SiteFooter() {
  const settings = await getSettings();

  return (
    <footer className="bg-bench px-4 pb-10 pt-16 text-milk sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <BrandLogo tone="light" size="large" />
            <p className="body-muted-dark mt-4 max-w-[30ch] text-[15px] leading-relaxed">
              One stone at a time. Cabochons, slabs and rough cut by hand; treatment always disclosed.
            </p>
            <ul className="mt-5 space-y-2">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-[15px] text-milk/80 transition-colors duration-200 hover:text-gold"
                >
                  {site.email}
                </a>
              </li>
              {settings.instagramUrl && (
                <li>
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] text-milk/80 transition-colors duration-200 hover:text-gold"
                  >
                    Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>
          <FooterCol
            title="Shop"
            links={[
              { href: "/shop", label: "All pieces" },
              { href: "/collections", label: "Collections" },
              { href: "/material-studies", label: "Material studies" },
              { href: "/custom", label: "Custom orders" },
              { href: "/the-workshop", label: "The workshop" },
              { href: "/journal", label: "Journal" },
            ]}
          />
          <FooterCol
            title="Help"
            links={[
              { href: "/care", label: "Care & repairs" },
              { href: "/care#shipping", label: "Shipping & returns" },
              { href: "/care#faq", label: "FAQ" },
              { href: "/contact", label: "Contact" },
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              { href: "/privacy", label: "Privacy policy" },
              { href: "/terms", label: "Terms of service" },
            ]}
          />
        </div>
        {/* Wordmark raksasa (signature element referensi) */}
        <p
          aria-hidden
          className="font-display mt-16 select-none whitespace-nowrap text-center font-bold uppercase leading-[0.8] tracking-[-0.005em] text-milk text-[clamp(40px,9.2vw,152px)]"
        >
          Michael Lapidary
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-milk/12 pt-6">
          <p className="eyebrow text-milk/50">© {new Date().getFullYear()} Michael Lapidary — Cut by hand, kept for life.</p>
          <p className="eyebrow text-milk/50">Treatment disclosed · Insured worldwide shipping</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="eyebrow text-milk/50">{title}</p>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={`${l.href}-${l.label}`}>
            <Link href={l.href} className="text-[15px] text-milk/80 transition-colors duration-200 hover:text-gold">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
