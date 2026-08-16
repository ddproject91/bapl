"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";

/** 데모용 개인 주행 기록 목업 */
const DEMO_RIDES = [
  { id: "r1", date: "2026-07-02", course: "북한강 라이트 크루징", km: 38 },
  { id: "r2", date: "2026-06-28", course: "미시령 옛길 와인딩", km: 44 },
  { id: "r3", date: "2026-06-21", course: "영종도 공항 순환", km: 31 },
  { id: "r4", date: "2026-06-14", course: "충주호 순환 투어링", km: 67 },
  { id: "r5", date: "2026-06-07", course: "남해 물미해안도로", km: 59 },
];

export function RecordsView() {
  const t = useTranslations("riding");
  const { user, openLogin } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong py-16 text-center">
        <span className="mb-3 text-3xl opacity-60">🔒</span>
        <p className="text-sm font-bold">{t("records.loginTitle")}</p>
        <p className="mt-1 text-xs text-fg-subtle">{t("records.loginHint")}</p>
        <button
          type="button"
          onClick={openLogin}
          className="mt-4 rounded-lg bg-neon px-5 py-2.5 text-xs font-bold text-black transition-transform hover:scale-[1.03] active:scale-95"
        >
          {t("records.login")}
        </button>
      </div>
    );
  }

  const total = DEMO_RIDES.reduce((s, r) => s + r.km, 0);
  const monthKm = DEMO_RIDES.filter((r) => r.date.startsWith("2026-07")).reduce(
    (s, r) => s + r.km,
    0,
  );

  const stats = [
    { label: t("records.totalDistance"), value: `${total} km` },
    { label: t("records.rideCount"), value: `${DEMO_RIDES.length}` },
    { label: t("records.thisMonth"), value: `${monthKm} km` },
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <p className="font-mono text-xl font-black text-neon md:text-2xl">
              {s.value}
            </p>
            <p className="mt-1 text-[11px] text-fg-subtle">{s.label}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-lg font-bold">
        {t("records.recentRides")}
      </h2>
      <div className="space-y-2">
        {DEMO_RIDES.map((r) => (
          <Card key={r.id} className="flex items-center gap-4 p-4">
            <span className="font-mono text-xs text-fg-subtle">
              {r.date.slice(5).replace("-", ".")}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {r.course}
            </span>
            <span className="shrink-0 font-mono text-sm font-bold text-neon">
              {r.km} km
            </span>
          </Card>
        ))}
      </div>

      <p className="mt-4 flex items-center gap-2 text-[11px] text-fg-subtle">
        <Badge variant="muted">{t("records.demoNote")}</Badge>
      </p>
    </div>
  );
}
