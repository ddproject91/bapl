import { getTranslations } from "next-intl/server";
import { getListingsByCategory } from "@/data/mock/market";
import { PageHeader } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { ListingCard, ListingGrid } from "@/components/market/ListingCard";

export const revalidate = 300;

export default async function DealersPage() {
  const t = await getTranslations("market");
  const items = await getListingsByCategory("dealer");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader title={t("dealers.title")} description={t("dealers.description")} />
      <div className="mt-5 flex items-center gap-2 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3">
        <Badge variant="partner">{t("badge.dealer")}</Badge>
        <span className="text-xs text-fg-muted">{t("dealers.vendorNotice")}</span>
      </div>
      <p className="mt-5 text-xs text-fg-subtle">
        {t("dealers.resultCount", { count: items.length })}
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
