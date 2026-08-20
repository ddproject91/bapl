"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { CafeType, FoodCuisine, Place } from "@/lib/types";
import { Card, Chip, EmptyState, RatingStars } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { KakaoPlacesMap } from "@/components/riding/KakaoPlacesMap";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";

type Cat = "all" | Place["category"];
type CuisineFilter = "all" | FoodCuisine;
type CafeTypeFilter = "all" | CafeType;

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
const CAFE_TYPES: CafeType[] = ["general", "rider"];

export function PlacesList({ places }: { places: Place[] }) {
  const t = useTranslations("riding");
  const { user, openLogin } = useAuth();
  const [supabase] = useState(() => createClient());
  const [cat, setCat] = useState<Cat>("all");
  const [cuisine, setCuisine] = useState<CuisineFilter>("all");
  const [cafeType, setCafeType] = useState<CafeTypeFilter>("all");
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [pendingBookmarkId, setPendingBookmarkId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!user) {
      setBookmarkedIds(new Set());
      return;
    }
    supabase
      .from("likes")
      .select("target_id")
      .eq("user_id", user.id)
      .eq("target_type", "place")
      .then(({ data }) => {
        if (active) setBookmarkedIds(new Set((data ?? []).map((row) => row.target_id as string)));
      });
    return () => {
      active = false;
    };
  }, [user, supabase]);

  async function toggleBookmark(id: string) {
    if (!user) {
      setNotice(t("places.bookmarkLoginRequired"));
      openLogin();
      return;
    }
    if (pendingBookmarkId) return;
    setPendingBookmarkId(id);
    const alreadyBookmarked = bookmarkedIds.has(id);
    if (alreadyBookmarked) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("target_type", "place")
        .eq("target_id", id);
      if (!error) {
        setBookmarkedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    } else {
      const { error } = await supabase
        .from("likes")
        .insert({ user_id: user.id, target_type: "place", target_id: id });
      if (!error) {
        setBookmarkedIds((prev) => new Set(prev).add(id));
      }
    }
    setPendingBookmarkId(null);
  }

  function showOnMap(id: string) {
    setSelectedId(id);
    document.getElementById("places-map")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const filtered = places
    .filter((p) => cat === "all" || p.category === cat)
    .filter((p) => cat !== "food" || cuisine === "all" || p.cuisine === cuisine)
    .filter((p) => cat !== "cafe" || cafeType === "all" || p.cafeType === cafeType)
    .filter((p) => !favoritesOnly || bookmarkedIds.has(p.id));

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

  const cafeTypeLabel = (v: CafeTypeFilter) =>
    v === "all" ? t("places.cafeTypeAll") : t(`places.cafeType${v[0].toUpperCase()}${v.slice(1)}`);

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
              setCafeType("all");
            }}
          >
            {catLabel(v)}
          </Chip>
        ))}
        <Chip active={favoritesOnly} onClick={() => setFavoritesOnly((v) => !v)}>
          ♥ {t("places.favoritesOnly")}
        </Chip>
      </div>
      {notice && <p className="mt-2 text-xs text-fg-subtle">{notice}</p>}

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

      {/* 카페 세부 카테고리(일반카페/라이더카페) */}
      {cat === "cafe" && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {(["all", ...CAFE_TYPES] as const).map((v) => (
            <Chip key={v} active={cafeType === v} onClick={() => setCafeType(v)}>
              {cafeTypeLabel(v)}
            </Chip>
          ))}
        </div>
      )}

      {/* 카카오맵 */}
      <div id="places-map" className="mt-5 scroll-mt-4">
        <KakaoPlacesMap places={filtered} selectedId={selectedId} />
      </div>

      {/* 플레이스 목록 */}
      {filtered.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title={favoritesOnly ? t("places.emptyFavorites") : t("places.empty")}
            icon="📍"
          />
        </div>
      ) : (
      <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map((p) => {
          const hasCoords =
            typeof p.lat === "number" && typeof p.lng === "number" && !(p.lat === 0 && p.lng === 0);
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
                {hasCoords && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      showOnMap(p.id);
                    }}
                    className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                  >
                    📍 {t("places.viewOnMap")}
                  </button>
                )}
                <button
                  type="button"
                  aria-label={
                    bookmarkedIds.has(p.id) ? t("places.bookmarkRemove") : t("places.bookmarkAdd")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleBookmark(p.id);
                  }}
                  disabled={pendingBookmarkId === p.id}
                  className={
                    "absolute bottom-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-sm backdrop-blur-sm transition-colors hover:bg-black/80 disabled:opacity-60 " +
                    (bookmarkedIds.has(p.id) ? "text-neon" : "text-white")
                  }
                >
                  {bookmarkedIds.has(p.id) ? "♥" : "♡"}
                </button>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <span className="text-[11px] font-medium text-fg-subtle">
                  {catLabel(p.category)}
                  {p.category === "food" && p.cuisine && ` · ${cuisineLabel(p.cuisine)}`}
                  {p.category === "cafe" && p.cafeType && ` · ${cafeTypeLabel(p.cafeType)}`}
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
