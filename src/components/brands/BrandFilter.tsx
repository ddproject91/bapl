"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { BikeCategory, Country, DisplacementClass } from "@/lib/types";
import { BIKE_CATEGORIES, DISPLACEMENT_CLASSES } from "@/lib/types";
import { Chip, EmptyState } from "@/components/ui/primitives";

/**
 * 브랜드 교차 필터(국가 / 타입 / 배기량) — 클라이언트 인터랙션.
 * 각 브랜드의 모델에서 파생한 메타데이터로 필터링하고,
 * 서버에서 미리 렌더한 BrandCard 노드를 그대로 노출한다.
 */
export interface BrandFilterItem {
  id: string;
  country: Country;
  categories: BikeCategory[];
  displacementClasses: DisplacementClass[];
  card: ReactNode;
}

export function BrandFilter({ items }: { items: BrandFilterItem[] }) {
  const t = useTranslations("brands");
  const c = useTranslations("common");

  const [country, setCountry] = useState<Country | "all">("all");
  const [category, setCategory] = useState<BikeCategory | "all">("all");
  const [displacement, setDisplacement] = useState<DisplacementClass | "all">(
    "all",
  );

  // 데이터에 실제로 존재하는 값만, 정해진 순서대로 노출
  const countries = useMemo(
    () => [...new Set(items.map((i) => i.country))],
    [items],
  );
  const categories = useMemo(
    () =>
      BIKE_CATEGORIES.filter((cat) =>
        items.some((i) => i.categories.includes(cat)),
      ),
    [items],
  );
  const displacements = useMemo(
    () =>
      DISPLACEMENT_CLASSES.filter((d) =>
        items.some((i) => i.displacementClasses.includes(d)),
      ),
    [items],
  );

  const filtered = items.filter((i) => {
    if (country !== "all" && i.country !== country) return false;
    if (category !== "all" && !i.categories.includes(category)) return false;
    if (displacement !== "all" && !i.displacementClasses.includes(displacement))
      return false;
    return true;
  });

  return (
    <div>
      <div className="space-y-3">
        <FilterRow label={t("filter.country")}>
          <Chip active={country === "all"} onClick={() => setCountry("all")}>
            {t("filter.all")}
          </Chip>
          {countries.map((co) => (
            <Chip
              key={co}
              active={country === co}
              onClick={() => setCountry(co)}
            >
              {c(`country.${co}`)}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label={t("filter.type")}>
          <Chip active={category === "all"} onClick={() => setCategory("all")}>
            {t("filter.all")}
          </Chip>
          {categories.map((cat) => (
            <Chip
              key={cat}
              active={category === cat}
              onClick={() => setCategory(cat)}
            >
              {c(`cat.${cat}`)}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label={t("filter.displacement")}>
          <Chip
            active={displacement === "all"}
            onClick={() => setDisplacement("all")}
          >
            {t("filter.all")}
          </Chip>
          {displacements.map((d) => (
            <Chip
              key={d}
              active={displacement === d}
              onClick={() => setDisplacement(d)}
            >
              {c(`disp.${d}`)}
            </Chip>
          ))}
        </FilterRow>
      </div>

      <p className="mt-5 text-xs text-fg-subtle">
        {t("resultCount", { count: filtered.length })}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-3">
          <EmptyState title={t("empty")} hint={t("emptyHint")} icon="🔍" />
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((i) => (
            <div key={i.id} className="animate-fade-up">
              {i.card}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-12 shrink-0 text-xs font-bold text-fg-muted">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
