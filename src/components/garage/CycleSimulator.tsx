"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { ConsumableCycle } from "@/lib/types";
import { Card } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { formatKm } from "@/lib/utils";

// computeCycleStatus/CycleStatus는 원래 @/data/mock/garage에서 가져왔으나,
// 해당 모듈이 DB 연동(getContent, server-only)을 함께 export하면서
// 클라이언트 컴포넌트에서 값 import 시 번들링 오류가 발생한다.
// 이 계산은 순수 함수라 DB와 무관하므로 로컬로 복제해 클라이언트/서버 경계를 분리한다.
// (로직은 @/data/mock/garage.ts의 computeCycleStatus와 동일하게 유지할 것)
type CycleStatus = "ok" | "dueSoon" | "overdue";

function computeCycleStatus(
  odometerKm: number,
  cycle: ConsumableCycle,
): { remainingKm: number; status: CycleStatus } {
  const into = odometerKm % cycle.intervalKm;
  const remainingKm = cycle.intervalKm - into;
  let status: CycleStatus = "ok";
  if (remainingKm <= 500) status = "overdue";
  else if (remainingKm <= cycle.intervalKm * 0.15) status = "dueSoon";
  return { remainingKm, status };
}

const STATUS_VARIANT: Record<CycleStatus, "neon" | "warning" | "danger"> = {
  ok: "neon",
  dueSoon: "warning",
  overdue: "danger",
};

export function CycleSimulator({ cycles }: { cycles: ConsumableCycle[] }) {
  const t = useTranslations("garage.cycles.simulator");
  const [raw, setRaw] = useState("");

  const odometer = useMemo(() => {
    const n = parseInt(raw.replace(/[^0-9]/g, ""), 10);
    return Number.isFinite(n) ? n : NaN;
  }, [raw]);

  const hasValue = raw.trim() !== "" && !Number.isNaN(odometer);

  const results = useMemo(() => {
    if (!hasValue) return [];
    return cycles.map((c) => ({
      cycle: c,
      ...computeCycleStatus(odometer, c),
    }));
  }, [cycles, odometer, hasValue]);

  return (
    <Card className="p-5">
      <h3 className="text-base font-bold">{t("title")}</h3>
      <p className="mt-1 text-xs text-fg-muted">{t("desc")}</p>

      <div className="mt-4">
        <label
          htmlFor="odometer"
          className="mb-1.5 block text-xs font-medium text-fg-muted"
        >
          {t("odometerInput")}
        </label>
        <div className="flex gap-2">
          <input
            id="odometer"
            inputMode="numeric"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={t("placeholder")}
            className="w-full rounded-xl border border-border bg-bg-elevated px-4 py-2.5 text-sm text-fg outline-none transition-colors focus:border-neon/60"
          />
        </div>
      </div>

      <div className="mt-4">
        {!hasValue ? (
          <p className="rounded-xl border border-dashed border-border py-6 text-center text-xs text-fg-subtle">
            {t("empty")}
          </p>
        ) : (
          <>
            <p className="mb-2 text-xs font-bold text-fg-muted">
              {t("resultTitle")}
            </p>
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
              {results.map(({ cycle, remainingKm, status }) => (
                <li
                  key={cycle.item}
                  className="flex items-center justify-between gap-3 bg-bg-card px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{cycle.itemKo}</p>
                    <p className="text-[11px] text-fg-subtle">
                      {t("remaining", { km: formatKm(Math.max(remainingKm, 0)) })}
                    </p>
                  </div>
                  <Badge variant={STATUS_VARIANT[status]} className="shrink-0">
                    {t(`status.${status}`)}
                  </Badge>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-fg-subtle">{t("disclaimer")}</p>
          </>
        )}
      </div>
    </Card>
  );
}
