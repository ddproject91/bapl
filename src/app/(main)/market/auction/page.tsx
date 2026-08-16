import { getTranslations } from "next-intl/server";
import { getListingsByCategory, getAuctionMeta } from "@/data/mock/market";
import { PageHeader, Card, BikeThumb } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { formatManwon, formatKm } from "@/lib/utils";

export const revalidate = 300;

export default async function AuctionPage() {
  const t = await getTranslations("market");
  const c = await getTranslations("common");
  const items = await getListingsByCategory("auction");
  const auctionMeta = await getAuctionMeta();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title={t("auction.title")}
        description={t("auction.description")}
      />

      {/* 후순위 안내 */}
      <div className="mt-5 flex items-start gap-2 rounded-xl border border-fg-subtle/30 bg-bg-elevated px-4 py-3">
        <Badge variant="soon">{c("badge.comingSoon")}</Badge>
        <span className="text-xs text-fg-muted">{t("auction.soonNotice")}</span>
      </div>

      <p className="mt-5 text-xs text-fg-subtle">
        {t("auction.resultCount", { count: items.length })}
      </p>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {items.map((l) => {
          const meta = auctionMeta[l.id];
          return (
            <Card key={l.id} as="article" className="p-4 opacity-90">
              <div className="flex gap-4">
                <div className="w-28 shrink-0">
                  <BikeThumb color={l.thumbColor} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <Badge variant="soon">{t("cat.auction")}</Badge>
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug">
                    {l.title}
                  </h3>
                  {(l.year || l.mileageKm) && (
                    <p className="mt-1 text-[11px] text-fg-muted">
                      {[
                        l.year && t("card.yearUnit", { year: l.year }),
                        l.mileageKm && formatKm(l.mileageKm),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-bg-elevated px-3 py-2">
                  <p className="text-[10px] text-fg-subtle">
                    {t("auction.startPrice")}
                  </p>
                  <p className="font-mono font-bold">{formatManwon(l.priceManwon)}</p>
                </div>
                <div className="rounded-lg border border-neon/30 bg-neon/10 px-3 py-2">
                  <p className="text-[10px] text-fg-subtle">
                    {t("auction.currentBid")}
                  </p>
                  <p className="font-mono font-bold text-neon">
                    {meta ? formatManwon(meta.currentBidManwon) : "-"}
                  </p>
                </div>
              </div>
              {meta && (
                <p className="mt-2 text-[11px] text-fg-subtle">
                  {t("auction.bidCount", { count: meta.bidCount })} ·{" "}
                  {t("auction.endsAt", { date: meta.endsAt })}
                </p>
              )}
            </Card>
          );
        })}
      </div>
      <div className="h-8" />
    </div>
  );
}
