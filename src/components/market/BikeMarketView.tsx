"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Chip, EmptyState } from "@/components/ui/primitives";

/**
 * 중고 바이크 목록 뷰(클라이언트 인터랙션).
 * 인증/비인증 탭 필터. 카드는 서버에서 미리 렌더해 노드로 전달받고,
 * items는 이미 "인증 우선 + 최신순"으로 정렬된 상태로 들어온다.
 */
export interface BikeMarketItem {
  id: string;
  isVerified: boolean;
  card: ReactNode;
}

export function BikeMarketView({ items }: { items: BikeMarketItem[] }) {
  const t = useTranslations("market");
  const [tab, setTab] = useState<"all" | "verified">("all");

  const filtered =
    tab === "verified" ? items.filter((i) => i.isVerified) : items;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Chip active={tab === "all"} onClick={() => setTab("all")}>
            {t("bikes.tabAll")}
          </Chip>
          <Chip active={tab === "verified"} onClick={() => setTab("verified")}>
            ✓ {t("bikes.tabVerified")}
          </Chip>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neon">
          <span className="h-1.5 w-1.5 rounded-full bg-neon" />
          {t("bikes.priorityNotice")}
        </span>
      </div>

      <p className="mt-4 text-xs text-fg-subtle">
        {t("bikes.resultCount", { count: filtered.length })}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-3">
          <EmptyState title={t("bikes.empty")} hint={t("bikes.emptyHint")} icon="🔍" />
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
