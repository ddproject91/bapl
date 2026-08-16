"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const POINTS_PER_CHECKIN = 10;

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function CheckinCard() {
  const t = useTranslations("riding");
  const { user, openLogin, refreshProfile } = useAuth();
  const [supabase] = useState(() => createClient());

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based
  const today = now.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  const weekdays = t.raw("checkin.weekdays") as string[];

  const [attended, setAttended] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setAttended([]);
      setLoaded(true);
      return;
    }
    let active = true;
    const mm = String(month + 1).padStart(2, "0");
    const monthStart = `${year}-${mm}-01`;
    const monthEnd = `${year}-${mm}-${String(daysInMonth).padStart(2, "0")}`;
    supabase
      .from("checkins")
      .select("checkin_date")
      .eq("user_id", user.id)
      .gte("checkin_date", monthStart)
      .lte("checkin_date", monthEnd)
      .then(({ data }) => {
        if (!active) return;
        setAttended((data ?? []).map((r) => Number(r.checkin_date.slice(8, 10))));
        setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [user, supabase, year, month, daysInMonth]);

  const checkedToday = attended.includes(today);

  async function handleCheckin() {
    if (!user) {
      openLogin();
      return;
    }
    if (checkedToday || submitting) return;
    setSubmitting(true);
    const { error } = await supabase.from("checkins").insert({
      user_id: user.id,
      checkin_date: toDateStr(now),
      points_earned: POINTS_PER_CHECKIN,
    });
    if (!error) {
      setAttended((prev) => [...prev, today]);
      await supabase
        .from("profiles")
        .update({ points: user.points + POINTS_PER_CHECKIN })
        .eq("id", user.id);
      await refreshProfile();
      setToast(t("checkin.earned", { points: POINTS_PER_CHECKIN }));
      window.setTimeout(() => setToast(null), 2500);
    }
    setSubmitting(false);
  }

  // 연속 출석(오늘부터 역순)
  let streak = 0;
  for (let d = today; d >= 1; d--) {
    if (attended.includes(d)) streak++;
    else break;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong py-16 text-center">
        <span className="mb-3 text-3xl opacity-60">🔒</span>
        <p className="text-sm font-bold">{t("checkin.loginTitle")}</p>
        <p className="mt-1 text-xs text-fg-subtle">{t("checkin.loginHint")}</p>
        <button
          type="button"
          onClick={openLogin}
          className="mt-4 rounded-lg bg-neon px-5 py-2.5 text-xs font-bold text-black transition-transform hover:scale-[1.03] active:scale-95"
        >
          {t("checkin.login")}
        </button>
      </div>
    );
  }

  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_320px]">
      {/* 달력 */}
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold">
            {t("checkin.monthLabel", { year: String(year), month: month + 1 })}
          </h2>
          <span className="text-xs text-fg-subtle">
            {t("checkin.monthCount")}{" "}
            <span className="font-mono font-bold text-neon">
              {t("checkin.days", { count: attended.length })}
            </span>
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {weekdays.map((w, i) => (
            <span
              key={w}
              className={cn(
                "py-1 text-[11px] font-medium",
                i === 0 ? "text-danger" : "text-fg-subtle",
              )}
            >
              {w}
            </span>
          ))}
          {cells.map((d, i) => {
            if (d === null) return <span key={`e${i}`} />;
            const on = attended.includes(d);
            const isToday = d === today;
            return (
              <div
                key={d}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-lg text-xs font-medium",
                  on
                    ? "bg-neon text-black"
                    : "bg-bg-elevated text-fg-muted",
                  isToday && !on && "ring-1 ring-neon/60",
                )}
              >
                {on ? "✓" : d}
              </div>
            );
          })}
        </div>
      </Card>

      {/* 요약 + 출석 버튼 + 리텐션 설명 */}
      <div className="space-y-4">
        <Card className="p-5">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="font-mono text-xl font-black text-neon">
                {t("checkin.streakDays", { days: streak })}
              </p>
              <p className="mt-1 text-[11px] text-fg-subtle">
                {t("checkin.streak")}
              </p>
            </div>
            <div>
              <p className="font-mono text-xl font-black text-neon">
                {user.points.toLocaleString()}P
              </p>
              <p className="mt-1 text-[11px] text-fg-subtle">
                {t("checkin.myPoints")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCheckin}
            disabled={checkedToday || !loaded || submitting}
            className={cn(
              "mt-4 w-full rounded-xl px-4 py-3 text-sm font-bold transition-all disabled:cursor-default",
              checkedToday
                ? "border border-neon/40 bg-neon/15 text-neon"
                : "bg-neon text-black hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100",
            )}
          >
            {checkedToday
              ? "✓ " + t("checkin.checkedToday")
              : t("checkin.todayCheckin")}
          </button>

          {toast && (
            <p className="mt-3 rounded-lg border border-neon/30 bg-neon/10 px-3 py-2 text-center text-xs font-bold text-neon">
              {toast}
            </p>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-bold">{t("checkin.retentionTitle")}</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">
            {t("checkin.retentionBody")}
          </p>
        </Card>
      </div>
    </div>
  );
}
