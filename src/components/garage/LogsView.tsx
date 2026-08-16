"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import type { MaintenanceLogEntry } from "@/data/mock/garage";
import type { Model, UserBike } from "@/lib/types";
import { Card, EmptyState } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { formatKm, formatManwon } from "@/lib/utils";

export function LogsView({
  models,
  bikes,
}: {
  models: Model[];
  bikes: { bike: UserBike; logs: MaintenanceLogEntry[] }[];
}) {
  const t = useTranslations("garage.logs");
  const c = useTranslations("common");
  const { user, openLogin } = useAuth();

  if (!user) {
    return (
      <Card className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
        <span className="text-3xl opacity-70" aria-hidden>
          🔧
        </span>
        <div>
          <h2 className="text-base font-bold">{t("loginTitle")}</h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-fg-muted">
            {t("loginDesc")}
          </p>
        </div>
        <button
          type="button"
          onClick={openLogin}
          className="mt-1 rounded-xl bg-neon px-5 py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.03] active:scale-95"
        >
          {t("login")}
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-fg-subtle">{t("myBikeNote")}</p>
      {bikes.map(({ bike, logs }) => (
        <BikeLogs key={bike.id} bike={bike} logs={logs} models={models} />
      ))}
      <button
        type="button"
        onClick={() => alert(t("addDemo"))}
        className="w-full rounded-xl border border-dashed border-border-strong py-3 text-sm font-bold text-fg-muted transition-colors hover:border-neon/50 hover:text-neon"
      >
        + {t("addLog")}
      </button>
      <p className="text-center text-[11px] text-fg-subtle">
        {c("badge.comingSoon")} · {t("addDemo")}
      </p>
    </div>
  );
}

function BikeLogs({
  bike,
  logs,
  models,
}: {
  bike: UserBike;
  logs: MaintenanceLogEntry[];
  models: Model[];
}) {
  const t = useTranslations("garage.logs");
  const model = models.find((m) => m.id === bike.modelId);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold">{bike.nickname}</h2>
          <p className="mt-0.5 text-xs text-fg-subtle">
            {model?.nameKo ?? bike.modelId}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[11px] text-fg-subtle">{t("odometer")}</p>
          <p className="font-mono text-sm font-bold text-neon">
            {formatKm(bike.odometerKm)}
          </p>
        </div>
      </div>

      <p className="mt-4 mb-3 text-xs font-bold text-fg-muted">
        {t("historyTitle")}
      </p>
      {logs.length === 0 ? (
        <EmptyState title={t("empty")} icon="🗓️" />
      ) : (
        <ol className="relative space-y-4 border-l border-border pl-5">
          {logs.map((log) => (
            <li key={log.id} className="relative">
              <span
                aria-hidden
                className="absolute -left-[23px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-bg-card bg-neon"
              />
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p className="text-sm font-semibold">{log.task}</p>
                <span className="font-mono text-xs font-bold text-neon">
                  {formatManwon(log.costManwon)}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-fg-subtle">
                <span>{log.date}</span>
                <span aria-hidden>·</span>
                <span>{formatKm(log.odometerKm)}</span>
                {log.shop && (
                  <>
                    <span aria-hidden>·</span>
                    <Badge variant="muted">{log.shop}</Badge>
                  </>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
