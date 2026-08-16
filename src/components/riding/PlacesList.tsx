"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { FoodCuisine, Place } from "@/lib/types";
import { Card, Chip, EmptyState, RatingStars } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { KakaoPlacesMap } from "@/components/riding/KakaoPlacesMap";

type Cat = "all" | Place["category"];
type CuisineFilter = "all" | FoodCuisine;

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

const CUISINES: FoodCuisine[] = ["korean", "chinese", "western", "japanese", "dessert", "other"];

export function PlacesList({ places }: { places: Place[] }) {
  const t = useTranslations("riding");
  const [cat, setCat] = useState<Cat>("all");
  const [cuisine, setCuisine] = useState<CuisineFilter>("all");

  const filtered = places
    .filter((p) => cat === "all" || p.category === cat)
    .filter((p) => cat !== "food" || cuisine === "all" || p.cuisine === cuisine);

  const catLabel = (v: Cat) =>
    v === "all"
      ? t("places.catAll")
      : v === "food"
        ? t("places.catFood")
        : v === "cafe"
          ? t("places.catCafe")
          : t("places.catWash");

  const cuisineLabel = (v: CuisineFilter) =>
    v === "all" ? t("places.cuisineAll") : t(`places.cuisine${v[0].toUpperCase()}${v.slice(1)}`);

  return (
    <div>
      {/* 카테고리 필터 */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "food", "cafe", "wash"] as const).map((v) => (
          <Chip
            key={v}
            active={cat === v}
            onClick={() => {
              setCat(v);
              setCuisine("all");
            }}
          >
            {catLabel(v)}
          </Chip>
        ))}
      </div>

      {/* 맛집 세부 카테고리(한식/중식/양식/일식/디저트/기타) */}
      {cat === "food" && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {(["all", ...CUISINES] as const).map((v) => (
            <Chip key={v} active={cuisine === v} onClick={() => setCuisine(v)}>
              {cuisineLabel(v)}
            </Chip>
          ))}
        </div>
      )}

      {/* 카카오맵 */}
      <div className="mt-5">
        <KakaoPlacesMap places={filtered} />
      </div>

      {/* 플레이스 목록 */}
      {filtered.length === 0 ? (
        <div className="mt-5">
          <EmptyState title={t("places.empty")} icon="📍" />
        </div>
      ) : (
      <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map((p) => {
          const content = (
            <>
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
                  {p.category === "food" && p.cuisine && ` · ${cuisineLabel(p.cuisine)}`}
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
            </>
          );

          return (
            <Card key={p.id} hover={!!p.linkUrl} className="flex flex-col overflow-hidden">
              {p.linkUrl ? (
                <a
                  href={p.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 flex-col"
                >
                  {content}
                </a>
              ) : (
                content
              )}
            </Card>
          );
        })}
      </div>
      )}
    </div>
  );
}
