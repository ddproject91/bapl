"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Chip, EmptyState } from "@/components/ui/primitives";
import {
  BIKE_CATEGORIES,
  DISPLACEMENT_CLASSES,
  type BikeCategory,
  type DisplacementClass,
} from "@/lib/types";

export type ModelFilterItem = {
  id: string;
  brandId: string;
  category: BikeCategory;
  displacementClass: DisplacementClass;
  popular: boolean;
  price: number; // 최신 연식 출시가(원)
  node: ReactNode; // 서버에서 렌더한 ModelCard
};

type SortKey = "popular" | "priceLow" | "priceHigh";
const SORTS: SortKey[] = ["popular", "priceLow", "priceHigh"];

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <span className="mt-2 w-12 shrink-0 text-[11px] font-medium text-fg-subtle">
        {label}
      </span>
      <div className="no-scrollbar flex flex-1 flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function ModelFilter({
  items,
  brands,
}: {
  items: ModelFilterItem[];
  brands: { id: string; nameKo: string }[];
}) {
  const t = useTranslations("models");
  const c = useTranslations("common");
  const [brand, setBrand] = useState<string | null>(null);
  const [category, setCategory] = useState<BikeCategory | null>(null);
  const [disp, setDisp] = useState<DisplacementClass | null>(null);
  const [sort, setSort] = useState<SortKey>("popular");

  const filtered = useMemo(() => {
    const out = items.filter(
      (m) =>
        (!brand || m.brandId === brand) &&
        (!category || m.category === category) &&
        (!disp || m.displacementClass === disp),
    );
    out.sort((a, b) => {
      if (sort === "priceLow") return a.price - b.price;
      if (sort === "priceHigh") return b.price - a.price;
      return Number(b.popular) - Number(a.popular);
    });
    return out;
  }, [items, brand, category, disp, sort]);

  return (
    <div>
      <div className="rounded-2xl border border-border bg-bg-card p-3">
        <FilterRow label={t("filter.brand")}>
          <Chip active={brand === null} onClick={() => setBrand(null)}>
            {t("filter.all")}
          </Chip>
          {brands.map((b) => (
            <Chip
              key={b.id}
              active={brand === b.id}
              onClick={() => setBrand(b.id)}
            >
              {b.nameKo}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label={t("filter.category")}>
          <Chip active={category === null} onClick={() => setCategory(null)}>
            {t("filter.all")}
          </Chip>
          {BIKE_CATEGORIES.map((cat) => (
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
          <Chip active={disp === null} onClick={() => setDisp(null)}>
            {t("filter.all")}
          </Chip>
          {DISPLACEMENT_CLASSES.map((d) => (
            <Chip key={d} active={disp === d} onClick={() => setDisp(d)}>
              {c(`disp.${d}`)}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label={t("sort.label")}>
          {SORTS.map((s) => (
            <Chip key={s} active={sort === s} onClick={() => setSort(s)}>
              {t(`sort.${s}`)}
            </Chip>
          ))}
        </FilterRow>
      </div>

      <p className="mt-4 text-xs text-fg-subtle">
        {t("list.count", { count: filtered.length })}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-3">
          <EmptyState title={t("list.empty")} hint={t("list.emptyHint")} />
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {filtered.map((m) => (
            <div key={m.id} className="animate-fade-up">
              {m.node}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
