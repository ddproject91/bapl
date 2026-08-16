import { getTranslations } from "next-intl/server";
import { getListingsByCategory } from "@/data/mock/market";
import { PageHeader, EmptyState } from "@/components/ui/primitives";
import { ListingCard, ListingGrid } from "@/components/market/ListingCard";

export const revalidate = 300;

export default async function GearPage() {
  const t = await getTranslations("market");
  const items = await getListingsByCategory("gear");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader title={t("gear.title")} description={t("gear.description")} />
      <p className="mt-5 text-xs text-fg-subtle">
        {t("gear.resultCount", { count: items.length })}
      </p>
      <div className="mt-3">
        {items.length === 0 ? (
          <EmptyState title={t("bikes.empty")} icon="🎒" />
        ) : (
          <ListingGrid>
            {items.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </ListingGrid>
        )}
      </div>
    </div>
  );
}
