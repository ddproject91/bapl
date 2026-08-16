import { getTranslations } from "next-intl/server";
import { getEventsByDate } from "@/data/mock/riding";
import { PageHeader, Card, EmptyState } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";

export const revalidate = 300;

function formatDate(iso: string) {
  const d = new Date(iso);
  const wd = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return {
    month: `${d.getMonth() + 1}`,
    day: `${d.getDate()}`,
    time: `${wd} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
  };
}

export default async function EventsPage() {
  const t = await getTranslations("riding");
  const c = await getTranslations("common");
  const eventsByDate = await getEventsByDate();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title={t("events.title")}
        description={t("events.description")}
      />

      <div className="mt-6 animate-fade-up">
        {eventsByDate.length === 0 ? (
          <EmptyState title={t("events.empty")} icon="🏁" />
        ) : (
          <div className="space-y-3">
            {eventsByDate.map((ev) => {
              const d = formatDate(ev.startsAt);
              return (
                <Card key={ev.id} hover className="flex gap-4 p-4">
                  {/* 날짜 블록 */}
                  <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-bg-elevated py-2">
                    <span className="text-[11px] font-medium text-fg-subtle">
                      {d.month}월
                    </span>
                    <span className="font-mono text-2xl font-black text-neon">
                      {d.day}
                    </span>
                    <span className="text-[10px] text-fg-subtle">{d.time}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={ev.type === "race" ? "warning" : "info"}>
                        {ev.type === "race"
                          ? t("events.race")
                          : t("events.festival")}
                      </Badge>
                      <Badge variant="muted">{t("events.upcoming")}</Badge>
                    </div>
                    <h3 className="mt-2 text-sm font-bold md:text-base">
                      {ev.title}
                    </h3>
                    <p className="mt-1 text-xs text-fg-muted">
                      {t("events.location")} · {ev.location}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-xs text-fg-subtle">
                      {ev.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-[11px] text-fg-subtle">
        {c("footer.notice")}
      </p>
    </div>
  );
}
