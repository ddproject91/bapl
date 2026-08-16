"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Place } from "@/lib/types";
import { Card, Chip, EmptyState, RatingStars } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";

type Cat = "all" | Place["category"];

const CAT_ICON: Record<Place["category"], string> = {
  food: "🍚",
  cafe: "☕",
  wash: "🧼",
};

const CAT_COLOR: Record<Place["category"], string> = {
  food: "#e8734a",
  cafe: "#a9744f",
  wash: "#4a90c9",
};

export function PlacesList({ places }: { places: Place[] }) {
  const t = useTranslations("riding");
  const [cat, setCat] = useState<Cat>("all");

  const filtered =
    cat === "all" ? places : places.filter((p) => p.category === cat);

  const catLabel = (v: Cat) =>
    v === "all"
      ? t("places.catAll")
      : v === "food"
        ? t("places.catFood")
        : v === "cafe"
          ? t("places.catCafe")
          : t("places.catWash");

  return (
    <div>
      {/* 카테고리 필터 */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "food", "cafe", "wash"] as const).map((v) => (
          <Chip key={v} active={cat === v} onClick={() => setCat(v)}>
            {catLabel(v)}
          </Chip>
        ))}
      </div>

      {/* 지도 플레이스홀더 */}
      <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-bg-elevated py-10 text-center">
        <span className="mb-2 text-2xl opacity-60">🗺️</span>
        <p className="text-sm font-medium text-fg-muted">
          {t("places.mapPlaceholder")}
        </p>
        <p className="mt-1 text-xs text-fg-subtle">{t("places.mapHint")}</p>
      </div>

      {/* 플레이스 목록 */}
      {filtered.length === 0 ? (
        <div className="mt-5">
          <EmptyState title={t("places.empty")} icon="📍" />
        </div>
      ) : (
      <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map((p) => (
          <Card key={p.id} className="flex flex-col overflow-hidden">
            <div
              className="relative aspect-[4/3] w-full"
              style={{
                background: p.imageUrl
                  ? undefined
                  : `radial-gradient(120% 120% at 20% 0%, ${CAT_COLOR[p.category]}33 0%, transparent 55%), linear-gradient(135deg, #eef0f3 0%, #e2e5ea 100%)`,
              }}
            >
              {p.imageUrl ? (
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-4xl opacity-70">
                  {CAT_ICON[p.category]}
                </span>
              )}
              {p.isSponsored && (
                <Badge variant="vendor" className="absolute right-2 top-2">
                  {t("places.sponsored")}
                </Badge>
              )}
            </div>

            <div className="flex flex-1 flex-col p-4">
              <span className="text-[11px] font-medium text-fg-subtle">
                {catLabel(p.category)}
              </span>
              <h3 className="mt-1 text-sm font-bold">{p.name}</h3>
              <p className="mt-0.5 text-[11px] text-fg-subtle">{p.region}</p>
              <p className="mt-1.5 line-clamp-2 text-xs text-fg-muted">
                {p.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <RatingStars rating={p.rating} />
                {p.bikeParking && (
                  <span className="text-[11px] text-neon">
                    🅿️ {t("places.bikeParking")}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}
