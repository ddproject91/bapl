"use client";

import { useMemo, useState } from "react";

export interface MetricSeries {
  key: string;
  label: string;
  /** ISO 타임스탬프 문자열 목록 */
  dates: string[];
}

type Period = "day" | "week" | "month";

const PERIOD_LABEL: Record<Period, string> = { day: "일간", week: "주간", month: "월간" };
const PERIOD_COUNT: Record<Period, number> = { day: 14, week: 12, month: 12 };

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d: Date): Date {
  const x = startOfDay(d);
  const dow = (x.getDay() + 6) % 7; // 0 = 월요일
  x.setDate(x.getDate() - dow);
  return x;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function label(d: Date, period: Period): string {
  if (period === "month") return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

interface Bucket {
  start: Date;
  end: Date;
  label: string;
}

function buildBuckets(period: Period, count: number): Bucket[] {
  const now = new Date();
  const buckets: Bucket[] = [];
  for (let i = 0; i < count; i++) {
    let start: Date;
    let end: Date;
    if (period === "day") {
      start = startOfDay(now);
      start.setDate(start.getDate() - i);
      end = new Date(start);
      end.setDate(end.getDate() + 1);
    } else if (period === "week") {
      start = startOfWeek(now);
      start.setDate(start.getDate() - i * 7);
      end = new Date(start);
      end.setDate(end.getDate() + 7);
    } else {
      start = startOfMonth(now);
      start.setMonth(start.getMonth() - i);
      end = new Date(start);
      end.setMonth(end.getMonth() + 1);
    }
    buckets.push({ start, end, label: label(start, period) });
  }
  return buckets;
}

export function StatsView({ series }: { series: MetricSeries[] }) {
  const [period, setPeriod] = useState<Period>("day");

  const buckets = useMemo(() => buildBuckets(period, PERIOD_COUNT[period]), [period]);

  const parsedSeries = useMemo(
    () =>
      series.map((s) => ({
        key: s.key,
        label: s.label,
        timestamps: s.dates.map((d) => new Date(d).getTime()).filter((t) => !Number.isNaN(t)),
      })),
    [series],
  );

  const table = useMemo(
    () =>
      buckets.map((b) => {
        const counts = parsedSeries.map((s) => {
          const startMs = b.start.getTime();
          const endMs = b.end.getTime();
          return s.timestamps.filter((t) => t >= startMs && t < endMs).length;
        });
        return { bucket: b, counts };
      }),
    [buckets, parsedSeries],
  );

  const totals = parsedSeries.map((_, i) => table.reduce((sum, row) => sum + row.counts[i], 0));

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {(["day", "week", "month"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={
              "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors " +
              (period === p
                ? "border-neon bg-neon/15 text-neon"
                : "border-border text-fg-muted hover:border-border-strong hover:text-fg")
            }
          >
            {PERIOD_LABEL[p]}
          </button>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {parsedSeries.map((s, i) => (
          <div key={s.key} className="rounded-2xl border border-border bg-bg-card p-3 text-center">
            <p className="font-mono text-lg font-black text-neon">{totals[i]}</p>
            <p className="mt-0.5 text-[11px] text-fg-subtle">
              {s.label} · {PERIOD_LABEL[period]} 합계
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-elevated text-xs text-fg-muted">
              <th className="px-4 py-3 font-medium">기간</th>
              {parsedSeries.map((s) => (
                <th key={s.key} className="px-4 py-3 text-right font-medium">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row) => (
              <tr key={row.bucket.label + row.bucket.start.toISOString()} className="border-b border-border last:border-b-0">
                <td className="px-4 py-2.5 font-mono text-xs text-fg-muted">{row.bucket.label}</td>
                {row.counts.map((c, i) => (
                  <td key={parsedSeries[i].key} className="px-4 py-2.5 text-right font-mono">
                    {c > 0 ? c : <span className="text-fg-subtle">-</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
