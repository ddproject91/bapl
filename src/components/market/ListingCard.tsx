import Link from "next/link";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { Listing } from "@/lib/types";
import { getModel } from "@/data/mock/models";
import { Card, BikeThumb } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { SlotChips } from "@/components/market/VerifySlots";
import { formatManwon, formatKm } from "@/lib/utils";

/**
 * 마켓 매물 카드(서버 공용). 카테고리에 따라 뱃지/메타를 파생.
 * - bike: 인증(glow "✓ BAPL 인증")/비인증 구분, 인증 매물은 필수 슬롯 표시, 상세 링크
 * - apparel/parts/dealer: 입점 뱃지, 업자는 "인증 업자"
 */
export async function ListingCard({ listing }: { listing: Listing }) {
  const t = await getTranslations("market");
  const isBike = listing.category === "bike";
  const isDealer = listing.category === "dealer";
  const model = listing.modelId ? await getModel(listing.modelId) : undefined;
  const thumbLabel = model?.nameKo ?? listing.brandName;

  const inner = (
    <div className="p-3">
      <div className="relative">
        <BikeThumb color={listing.thumbColor} label={thumbLabel} />
        {/* 상태 뱃지 */}
        {listing.status !== "active" && (
          <span className="absolute left-2 top-2">
            <Badge variant={listing.status === "sold" ? "muted" : "warning"}>
              {t(`status.${listing.status}`)}
            </Badge>
          </span>
        )}
        {/* 인증 / 입점 뱃지 */}
        <span className="absolute right-2 top-2 flex flex-col items-end gap-1">
          {isBike && listing.isVerified && (
            <Badge variant="neon" glow>
              ✓ {t("badge.verified")}
            </Badge>
          )}
          {isBike && !listing.isVerified && (
            <Badge variant="muted">{t("badge.unverified")}</Badge>
          )}
          {listing.isVendor && (
            <Badge variant={isDealer ? "partner" : "vendor"}>
              {isDealer ? t("badge.dealer") : t("badge.vendor")}
            </Badge>
          )}
        </span>
      </div>

      <div className="mt-3">
        {listing.brandName && (
          <p className="text-[11px] font-medium text-info">
            {listing.brandName}
          </p>
        )}
        <h3 className="line-clamp-2 text-sm font-bold leading-snug">
          {listing.title}
        </h3>

        {/* 가격 */}
        <p className="mt-1.5 font-mono text-base font-black text-neon">
          {listing.priceManwon > 0
            ? formatManwon(listing.priceManwon)
            : t("card.priceOnRequest")}
        </p>

        {/* 제원 메타 */}
        {(listing.year || listing.mileageKm) && (
          <p className="mt-1 text-[11px] text-fg-muted">
            {[
              listing.year && t("card.yearUnit", { year: listing.year }),
              listing.mileageKm && formatKm(listing.mileageKm),
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}

        {/* 인증 매물: 필수 슬롯 표시 */}
        {isBike && listing.isVerified && (
          <SlotChips filled={listing.filledSlots} />
        )}

        {/* 하단: 지역 · 매너 · 찜 */}
        <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2 text-[11px] text-fg-subtle">
          <span>📍 {listing.region}</span>
          <span className="flex items-center gap-2">
            {listing.sellerScore != null && (
              <span className="text-fg-muted">
                {t("card.manner", { score: listing.sellerScore.toFixed(1) })}
              </span>
            )}
            <span>♡ {listing.bookmarkCount}</span>
          </span>
        </div>
      </div>
    </div>
  );

  if (isBike) {
    return (
      <Card
        as="article"
        hover
        className={listing.status === "sold" ? "opacity-70" : undefined}
      >
        <Link href={`/market/bikes/${listing.id}`} className="block">
          {inner}
        </Link>
      </Card>
    );
  }

  return (
    <Card as="article" hover>
      {inner}
    </Card>
  );
}

/** 카드 그리드 래퍼 */
export function ListingGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {children}
    </div>
  );
}
