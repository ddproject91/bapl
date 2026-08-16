import Link from "next/link";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getListing, getListingsByCategory } from "@/data/mock/market";
import { getModel } from "@/data/mock/models";
import { getBrand } from "@/data/mock/brands";
import { Card, BikeThumb } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { SlotGallery } from "@/components/market/VerifySlots";
import { ListingActions } from "@/components/market/ListingActions";
import { formatManwon, formatKm } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  const bikes = await getListingsByCategory("bike");
  return bikes.map((l) => ({ id: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing || listing.category !== "bike") return {};

  const description = `${formatManwon(listing.priceManwon)} · ${listing.region}${
    listing.mileageKm != null ? ` · ${formatKm(listing.mileageKm)}` : ""
  }`;
  const model = listing.modelId ? await getModel(listing.modelId) : undefined;
  const image = model?.imageUrl;

  return {
    title: listing.title,
    description,
    openGraph: {
      title: listing.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BikeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing || listing.category !== "bike") notFound();

  const t = await getTranslations("market");
  const c = await getTranslations("common");
  const model = listing.modelId ? await getModel(listing.modelId) : undefined;
  const brand = model ? await getBrand(model.brandId) : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link
        href="/market/bikes"
        className="text-xs font-medium text-fg-muted transition-colors hover:text-neon"
      >
        ← {t("detail.back")}
      </Link>

      {/* ── 헤더 ── */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {listing.isVerified ? (
          <Badge variant="neon" glow>
            ✓ {t("badge.verified")}
          </Badge>
        ) : (
          <Badge variant="muted">{t("badge.unverified")}</Badge>
        )}
        {listing.status !== "active" && (
          <Badge variant={listing.status === "sold" ? "muted" : "warning"}>
            {t(`status.${listing.status}`)}
          </Badge>
        )}
      </div>
      <h1 className="mt-2 text-xl font-black tracking-tight md:text-2xl">
        {listing.title}
      </h1>
      <p className="mt-2 font-mono text-2xl font-black text-neon">
        {formatManwon(listing.priceManwon)}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* ── 좌: 사진/갤러리 ── */}
        <div>
          {listing.isVerified ? (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="neon">✓ {t("detail.verifiedGalleryTitle")}</Badge>
                <span className="text-[11px] text-fg-subtle">
                  {t("slot.verifiedComplete")}
                </span>
              </div>
              <p className="mb-3 text-xs text-fg-muted">
                {t("detail.verifiedGalleryDesc")}
              </p>
              <SlotGallery color={listing.thumbColor} filled={listing.filledSlots} />
            </section>
          ) : (
            <section>
              <h2 className="mb-3 text-sm font-bold">
                {t("detail.freeGalleryTitle")}
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <BikeThumb key={i} color={listing.thumbColor} />
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-warning/40 bg-warning/10 p-3 text-xs text-warning">
                ⚠️ {t("detail.unverifiedWarning")}
              </div>
            </section>
          )}
        </div>

        {/* ── 우: 정보/액션 ── */}
        <div className="space-y-4">
          {/* 제원/매물 정보 */}
          <Card className="p-4">
            <h2 className="mb-3 text-sm font-bold">{t("detail.specTitle")}</h2>
            <dl className="space-y-2 text-sm">
              {listing.year != null && (
                <Row
                  label={t("detail.year")}
                  value={t("card.yearUnit", { year: listing.year })}
                />
              )}
              {listing.mileageKm != null && (
                <Row
                  label={t("detail.mileage")}
                  value={formatKm(listing.mileageKm)}
                />
              )}
              <Row label={t("detail.region")} value={listing.region} />
            </dl>
            {model && (
              <Link
                href={`/models/${model.id}`}
                className="mt-4 flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:border-neon/40"
              >
                <div className="w-20 shrink-0">
                  <BikeThumb color={model.heroColor} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-fg-subtle">
                    {brand?.nameKo} · {c(`cat.${model.category}`)}
                  </p>
                  <p className="truncate text-sm font-bold">{model.nameKo}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-neon">
                    {t("detail.modelLink")} →
                  </p>
                </div>
              </Link>
            )}
          </Card>

          {/* 판매자 정보 */}
          <Card className="p-4">
            <h2 className="mb-3 text-sm font-bold">{t("detail.sellerTitle")}</h2>
            <dl className="space-y-2 text-sm">
              <Row label={t("detail.sellerTitle")} value={listing.seller} />
              {listing.sellerScore != null && (
                <Row
                  label={t("detail.mannerScore")}
                  value={
                    <span className="font-mono font-bold text-neon">
                      {listing.sellerScore.toFixed(1)}
                    </span>
                  }
                />
              )}
              <Row label={t("detail.registeredAt")} value={listing.createdAt} />
              <Row label="♡" value={`${listing.bookmarkCount}`} />
            </dl>
          </Card>

          <ListingActions listingId={listing.id} />
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-fg-muted">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
