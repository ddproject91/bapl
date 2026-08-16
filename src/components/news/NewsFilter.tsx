"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { NewsCategory, NewsItem } from "@/lib/types";
import { Card, Chip } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { categoryVariant } from "@/components/news/category";

/** 뉴스 카드에 관련 링크 라벨을 붙이기 위한 확장 데이터. */
export interface NewsListItem extends NewsItem {
  brandNameKo?: string;
  modelNameKo?: string;
}

const CATEGORIES: NewsCategory[] = [
  "law",
  "newbike",
  "recall",
  "industry",
  "blog",
];

const CATEGORY_COLOR: Record<NewsCategory, string> = {
  law: "#f59e0b",
  newbike: "#00a552",
  recall: "#e53935",
  industry: "#0ea5e9",
  blog: "#8b8f98",
};

const CATEGORY_ICON: Record<NewsCategory, string> = {
  law: "⚖️",
  newbike: "🏍️",
  recall: "⚠️",
  industry: "📊",
  blog: "✍️",
};

function fmtDate(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, ".");
}

export function NewsFilter({ items }: { items: NewsListItem[] }) {
  const t = useTranslations("news");
  const [category, setCategory] = useState<NewsCategory | "all">("all");

  const available = CATEGORIES.filter((cat) =>
    items.some((i) => i.category === cat),
  );
  const filtered =
    category === "all" ? items : items.filter((i) => i.category === category);

  return (
    <div>
      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex gap-2">
          <Chip active={category === "all"} onClick={() => setCategory("all")}>
            {t("all")}
          </Chip>
          {available.map((cat) => (
            <Chip
              key={cat}
              active={category === cat}
              onClick={() => setCategory(cat)}
            >
              {t(`cat.${cat}`)}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mt-5 text-xs text-fg-subtle">
        {t("resultCount", { count: filtered.length })}
      </p>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {filtered.map((n) => (
          <Card key={n.id} as="article" hover>
            <Link href={`/news/${n.id}`} className="flex gap-3 p-3">
              <div
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl"
                style={{
                  background: n.imageUrl
                    ? undefined
                    : `radial-gradient(120% 120% at 20% 0%, ${CATEGORY_COLOR[n.category]}33 0%, transparent 55%), linear-gradient(135deg, #eef0f3 0%, #e2e5ea 100%)`,
                }}
              >
                {n.imageUrl ? (
                  <Image
                    src={n.imageUrl}
                    alt={n.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-2xl opacity-70">
                    {CATEGORY_ICON[n.category]}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant={categoryVariant(n.category)}>
                    {t(`cat.${n.category}`)}
                  </Badge>
                  <span className="text-[11px] text-fg-subtle">
                    {fmtDate(n.publishedAt)}
                  </span>
                </div>
                <h3 className="mt-1.5 line-clamp-1 text-sm font-bold leading-snug">
                  {n.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-fg-muted">
                  {n.summary}
                </p>
              </div>
            </Link>
            {(n.brandNameKo || n.modelNameKo) && (
              <div className="flex flex-wrap gap-2 border-t border-border px-4 py-2.5">
                {n.modelNameKo && n.modelId && (
                  <Link
                    href={`/models/${n.modelId}`}
                    className="text-[11px] font-medium text-fg-muted transition-colors hover:text-neon"
                  >
                    🏍️ {n.modelNameKo} →
                  </Link>
                )}
                {n.brandNameKo && n.brandId && !n.modelNameKo && (
                  <Link
                    href={`/brands/${n.brandId}`}
                    className="text-[11px] font-medium text-fg-muted transition-colors hover:text-neon"
                  >
                    🏭 {n.brandNameKo} →
                  </Link>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
