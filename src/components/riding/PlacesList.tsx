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
  const [detailPlace, setDetailPlace] = useState<Place | null>(null);

  useEffect(() => {
    if (!detailPlace) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDetailPlace(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [detailPlace]);

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
            <Card key={p.id} hover className="flex flex-col overflow-hidden">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setDetailPlace(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setDetailPlace(p);
                  }
                }}
                className="flex flex-1 cursor-pointer flex-col text-left"
              >
                {content}
              </div>
            </Card>
          );
        })}
      </div>
      )}

      {/* 상세 정보 팝업 */}
      {detailPlace && (
        <PlaceDetailModal
          place={detailPlace}
          onClose={() => setDetailPlace(null)}
          onShowOnMap={() => {
            showOnMap(detailPlace.id);
            setDetailPlace(null);
          }}
          catLabel={catLabel}
          cuisineLabel={cuisineLabel}
          cafeTypeLabel={cafeTypeLabel}
        />
      )}
    </div>
  );
}

function PlaceDetailModal({
  place,
  onClose,
  onShowOnMap,
  catLabel,
  cuisineLabel,
  cafeTypeLabel,
}: {
  place: Place;
  onClose: () => void;
  onShowOnMap: () => void;
  catLabel: (v: Cat) => string;
  cuisineLabel: (v: CuisineFilter) => string;
  cafeTypeLabel: (v: CafeTypeFilter) => string;
}) {
  const t = useTranslations("riding");
  const hasCoords =
    typeof place.lat === "number" &&
    typeof place.lng === "number" &&
    !(place.lat === 0 && place.lng === 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-border bg-bg-card sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto">
          <div
            className="relative aspect-[4/3] w-full"
            style={{
              background: place.imageUrl
                ? undefined
                : `radial-gradient(120% 120% at 20% 0%, ${CAT_COLOR[place.category]}33 0%, transparent 55%), linear-gradient(135deg, #eef0f3 0%, #e2e5ea 100%)`,
            }}
          >
            {place.imageUrl ? (
              <Image
                src={place.imageUrl}
                alt={place.name}
                fill
                sizes="(min-width: 640px) 480px, 100vw"
                className="object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-5xl opacity-70">
                {CAT_ICON[place.category]}
              </span>
            )}
            {place.isSponsored && (
              <Badge variant="vendor" className="absolute left-3 top-3">
                {t("places.sponsored")}
              </Badge>
            )}
            <button
              type="button"
              aria-label={t("places.detailClose")}
              onClick={onClose}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/80"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-4 p-5">
            <div>
              <span className="text-[11px] font-medium text-fg-subtle">
                {catLabel(place.category)}
                {place.category === "food" && place.cuisine && ` · ${cuisineLabel(place.cuisine)}`}
                {place.category === "cafe" && place.cafeType && ` · ${cafeTypeLabel(place.cafeType)}`}
              </span>
              <h3 className="mt-1 text-lg font-bold">{place.name}</h3>
              <div className="mt-1.5 flex items-center gap-2">
                <RatingStars rating={place.rating} />
                {place.bikeParking && (
                  <span className="text-[11px] text-neon">🅿️ {t("places.bikeParking")}</span>
                )}
              </div>
            </div>

            {place.description && (
              <p className="text-sm leading-relaxed text-fg-muted">{place.description}</p>
            )}

            {(place.address || place.hours || place.region) && (
              <dl className="flex flex-col gap-2 rounded-xl border border-border bg-bg-elevated p-3 text-sm">
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-fg-subtle">📍 {t("places.detailAddress")}</dt>
                  <dd>{place.address || place.region}</dd>
                </div>
                {place.hours && (
                  <div className="flex gap-2">
                    <dt className="w-16 shrink-0 text-fg-subtle">🕐 {t("places.detailHours")}</dt>
                    <dd>{place.hours}</dd>
                  </div>
                )}
              </dl>
            )}

            {place.galleryImages && place.galleryImages.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-bold text-fg-muted">{t("places.detailGallery")}</p>
                <div className="flex gap-2 overflow-x-auto">
                  {place.galleryImages.map((url, i) => (
                    <div
                      key={url + i}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border"
                    >
                      <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {place.menuImages && place.menuImages.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-bold text-fg-muted">{t("places.detailMenu")}</p>
                <div className="flex gap-2 overflow-x-auto">
                  {place.menuImages.map((url, i) => (
                    <div
                      key={url + i}
                      className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg border border-border"
                    >
                      <Image src={url} alt="" fill sizes="96px" className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2 border-t border-border p-4">
          {hasCoords && (
            <button
              type="button"
              onClick={onShowOnMap}
              className="flex-1 rounded-xl border border-border-strong px-4 py-2.5 text-sm font-bold transition-colors hover:border-neon/50 hover:text-neon"
            >
              📍 {t("places.viewOnMap")}
            </button>
          )}
          {place.linkUrl && (
            <a
              href={place.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-xl bg-neon px-4 py-2.5 text-center text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-95"
            >
              {t("places.detailLink")} ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
