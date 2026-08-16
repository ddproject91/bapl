import { getTranslations } from "next-intl/server";
import { getListingsByCategory } from "@/data/mock/market";
import { PageHeader } from "@/components/ui/primitives";
import { ListingCard } from "@/components/market/ListingCard";
import {
  BikeMarketView,
  type BikeMarketItem,
} from "@/components/market/BikeMarketView";

export const revalidate = 300;

export default async function BikesPage() {
  const t = await getTranslations("market");

  // 인증 매물 우선 노출 → 인증 여부(내림차순) → 최신순 정렬
  const bikes = [...(await getListingsByCategory("bike"))].sort((a, b) => {
    if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  const items: BikeMarketItem[] = bikes.map((l) => ({
    id: l.id,
    isVerified: l.isVerified,
    card: <ListingCard listing={l} />,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader title={t("bikes.title")} description={t("bikes.description")} />
      <div className="mt-6">
        <BikeMarketView items={items} />
      </div>
    </div>
  );
}
