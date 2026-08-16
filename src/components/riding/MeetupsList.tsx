"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Meetup } from "@/lib/types";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, Chip } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

function formatMeetAt(iso: string) {
  const d = new Date(iso);
  const wd = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${d.getMonth() + 1}.${d.getDate()}(${wd}) ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function MeetupsList({ meetups }: { meetups: Meetup[] }) {
  const t = useTranslations("riding");
  const { user, openLogin } = useAuth();

  const regions = useMemo(
    () => Array.from(new Set(meetups.map((m) => m.region))),
    [meetups],
  );

  const [type, setType] = useState<"all" | "region" | "model">("all");
  const [region, setRegion] = useState<string>("all");
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = meetups.filter(
    (m) =>
      (type === "all" || m.type === type) &&
      (region === "all" || m.region === region),
  );

  function handleJoin(m: Meetup) {
    if (!user) {
      setNotice(t("meetups.joinRequireLogin"));
      openLogin();
      return;
    }
    setJoinedIds((prev) =>
      prev.includes(m.id) ? prev : [...prev, m.id],
    );
    setNotice(t("meetups.joinDemo"));
  }

  return (
    <div>
      {/* 필터 */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium text-fg-subtle">
            {t("meetups.filterType")}
          </span>
          {(["all", "region", "model"] as const).map((v) => (
            <Chip key={v} active={type === v} onClick={() => setType(v)}>
              {v === "all"
                ? t("meetups.typeAll")
                : v === "region"
                  ? t("meetups.typeRegion")
                  : t("meetups.typeModel")}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium text-fg-subtle">
            {t("meetups.filterRegion")}
          </span>
          <Chip active={region === "all"} onClick={() => setRegion("all")}>
            {t("meetups.regionAll")}
          </Chip>
          {regions.map((r) => (
            <Chip key={r} active={region === r} onClick={() => setRegion(r)}>
              {r}
            </Chip>
          ))}
        </div>
      </div>

      {/* 지도 플레이스홀더 */}
      <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-bg-elevated py-10 text-center">
        <span className="mb-2 text-2xl opacity-60">🗺️</span>
        <p className="text-sm font-medium text-fg-muted">
          {t("meetups.mapPlaceholder")}
        </p>
        <p className="mt-1 text-xs text-fg-subtle">{t("meetups.mapHint")}</p>
      </div>

      {notice && (
        <p className="mt-4 rounded-xl border border-neon/30 bg-neon/10 px-4 py-2.5 text-xs text-neon">
          {notice}
        </p>
      )}

      {/* 모임 카드 목록 */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {filtered.map((m) => {
          const full = m.joined >= m.capacity;
          const joined = joinedIds.includes(m.id);
          const pct = Math.min(100, Math.round((m.joined / m.capacity) * 100));
          return (
            <Card key={m.id} className="flex flex-col p-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {m.type === "region"
                    ? t("meetups.typeRegion")
                    : t("meetups.typeModel")}
                </Badge>
                <span className="text-[11px] text-fg-subtle">{m.region}</span>
                {full && <Badge variant="muted">{t("meetups.full")}</Badge>}
              </div>
              <h3 className="mt-2 text-sm font-bold">{m.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-fg-muted">
                {m.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-fg-subtle">
                <span>{formatMeetAt(m.meetAt)}</span>
                <span>
                  {t("meetups.host")} {m.host}
                </span>
              </div>

              {/* 정원 진행바 */}
              <div className="mt-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-fg-subtle">{t("meetups.capacity")}</span>
                  <span className="font-mono text-neon">
                    {t("meetups.joinedOf", {
                      joined: m.joined,
                      capacity: m.capacity,
                    })}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-bg-elevated">
                  <div
                    className="h-full rounded-full bg-neon"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleJoin(m)}
                disabled={full && !joined}
                className={cn(
                  "mt-3 rounded-lg px-4 py-2 text-xs font-bold transition-colors",
                  joined
                    ? "border border-neon/40 bg-neon/15 text-neon"
                    : full
                      ? "cursor-not-allowed border border-border text-fg-subtle"
                      : "bg-neon text-black hover:brightness-110",
                )}
              >
                {joined
                  ? t("meetups.joined") + " ✓"
                  : full
                    ? t("meetups.full")
                    : t("meetups.join")}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
