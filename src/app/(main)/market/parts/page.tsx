import { getTranslations } from "next-intl/server";
import { getListingsByCategory } from "@/data/mock/market";
import { PageHeader } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { ListingCard, ListingGrid } from "@/components/market/ListingCard";

export const revalidate = 300;

export default async function PartsPage() {
  const t = await getTranslations("market");
  const items = await getListingsByCategory("parts");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader title={t("parts.title")} description={t("parts.description")} />
      <div className="mt-5 flex items-center gap-2 rounded-xl border border-info/30 bg-info/10 px-4 py-3">
        <Badge variant="vendor">{t("badge.vendor")}</Badge>
        <span className="text-xs text-fg-muted">{t("parts.vendorNotice")}</span>
      </div>
      <p className="mt-5 text-xs text-fg-subtle">
        {t("parts.resultCount", { count: items.length })}
      </p>
      <div className="mt-3">
        <ListingGrid>
          {items.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </ListingGrid>
      </div>
    </div>
  );
}
