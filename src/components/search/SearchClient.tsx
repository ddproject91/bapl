"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { NewsCategory } from "@/lib/types";
import { Card } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { categoryVariant } from "@/components/news/category";

/** 검색 대상 아이템 — 서버에서 미리 렌더한 카드 노드 + 매칭용 텍스트. */
export interface SearchNode {
  id: string;
  text: string;
  node: ReactNode;
}

export interface SearchNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: NewsCategory;
  publishedAt: string;
  text: string;
}

function fmtDate(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, ".");
}

export function SearchClient({
  brands,
  models,
  news,
  popularModels,
  popularTerms,
}: {
  brands: SearchNode[];
  models: SearchNode[];
  news: SearchNewsItem[];
  popularModels: SearchNode[];
  popularTerms: string[];
}) {
  const t = useTranslations("search");
  const tn = useTranslations("news");
  const [q, setQ] = useState("");

  const query = q.trim().toLowerCase();
  const hasQuery = query.length > 0;

  const brandHits = useMemo(
    () =>
      hasQuery ? brands.filter((b) => b.text.includes(query)) : [],
    [brands, query, hasQuery],
  );
  const modelHits = useMemo(
    () =>
      hasQuery ? models.filter((m) => m.text.includes(query)) : [],
    [models, query, hasQuery],
  );
  const newsHits = useMemo(
    () => (hasQuery ? news.filter((n) => n.text.includes(query)) : []),
    [news, query, hasQuery],
  );

  const total = brandHits.length + modelHits.length + newsHits.length;

  return (
    <div>
      {/* ── 검색 입력 ── */}
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle">
          🔍
        </span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("placeholder")}
          autoFocus
          className="w-full rounded-2xl border border-border-strong bg-bg-card py-3.5 pl-11 pr-11 text-sm outline-none transition-colors focus:border-neon/60"
        />
        {hasQuery && (
          <button
            type="button"
            onClick={() => setQ("")}
            aria-label={t("clear")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-bg-elevated px-2 py-1 text-xs text-fg-muted transition-colors hover:text-fg"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── 검색 전 상태 ── */}
      {!hasQuery && (
        <div className="mt-8 space-y-10">
          <section>
            <h2 className="mb-3 text-base font-bold">{t("popular")}</h2>
            <div className="flex flex-wrap gap-2">
              {popularTerms.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQ(term)}
                  className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:border-neon/50 hover:text-neon"
                >
                  {term}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold">{t("recommend")}</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {popularModels.map((m) => (
                <div key={m.id}>{m.node}</div>
              ))}
            </div>
          </section>

          <p className="rounded-2xl border border-dashed border-border-strong bg-bg-elevated p-4 text-center text-xs text-fg-subtle">
            {t("comingSoonScope")}
          </p>
        </div>
      )}

      {/* ── 검색 결과 ── */}
      {hasQuery && (
        <div className="mt-6 space-y-10">
          {total === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-border py-16 text-center">
              <span className="mb-3 text-3xl opacity-60">🔍</span>
              <p className="text-sm font-medium text-fg-muted">
                {t("noResult")}
              </p>
              <p className="mt-1 text-xs text-fg-subtle">{t("noResultHint")}</p>
            </div>
          ) : (
            <>
              {brandHits.length > 0 && (
                <ResultGroup
                  title={t("resultBrands")}
                  count={t("resultCount", { count: brandHits.length })}
                >
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                    {brandHits.map((b) => (
                      <div key={b.id}>{b.node}</div>
                    ))}
                  </div>
                </ResultGroup>
              )}

              {modelHits.length > 0 && (
                <ResultGroup
                  title={t("resultModels")}
                  count={t("resultCount", { count: modelHits.length })}
                >
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {modelHits.map((m) => (
                      <div key={m.id}>{m.node}</div>
                    ))}
                  </div>
                </ResultGroup>
              )}

              {newsHits.length > 0 && (
                <ResultGroup
                  title={t("resultNews")}
                  count={t("resultCount", { count: newsHits.length })}
                >
                  <Card className="divide-y divide-border">
                    {newsHits.map((n) => (
                      <Link
                        key={n.id}
                        href={`/news/${n.id}`}
                        className="flex items-start gap-3 p-4 transition-colors hover:bg-bg-elevated"
                      >
                        <Badge variant={categoryVariant(n.category)}>
                          {tn(`cat.${n.category}`)}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-medium">
                            {n.title}
                          </p>
                          <p className="mt-0.5 line-clamp-1 text-xs text-fg-muted">
                            {n.summary}
                          </p>
                          <p className="mt-1 text-[11px] text-fg-subtle">
                            {n.source} · {fmtDate(n.publishedAt)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </Card>
                </ResultGroup>
              )}

              <p className="rounded-2xl border border-dashed border-border-strong bg-bg-elevated p-4 text-center text-xs text-fg-subtle">
                {t("comingSoonScope")}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ResultGroup({
  title,
  count,
  children,
}: {
  title: string;
  count: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-base font-bold">{title}</h2>
        <span className="text-xs font-medium text-fg-subtle">{count}</span>
      </div>
      {children}
    </section>
  );
}
