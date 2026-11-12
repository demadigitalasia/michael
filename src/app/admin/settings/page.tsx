import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Admin · Settings" };

export default async function AdminSettingsPage() {
  const s = await getSettings();

  return (
    <div>
      <h1 className="display text-[clamp(32px,4vw,48px)] text-ink">Settings</h1>
      <p className="body-muted mt-2 max-w-[60ch] text-[14.5px]">
        SEO global, thumbnail berbagi tautan (OG image), dan verifikasi Search
        Console — berlaku di seluruh situs.
      </p>
      <div className="mt-8">
        <SettingsForm
          settings={{
            metaTitle: s.metaTitle,
            metaDescription: s.metaDescription,
            ogImageUrl: s.ogImageUrl,
            googleSiteVerification: s.googleSiteVerification,
            instagramUrl: s.instagramUrl,
          }}
        />
      </div>
    </div>
  );
}
