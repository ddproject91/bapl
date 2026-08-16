import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  getMeetups,
  getCourses,
  getEventsByDate,
  getBestCourses,
} from "@/data/mock/riding";
import {
  PageHeader,
  SectionHeader,
  Card,
  RatingStars,
} from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";

export const revalidate = 300;

const HUB_CARDS = [
  { key: "meetups", href: "/riding/meetups", icon: "📍" },
  { key: "courses", href: "/riding/courses", icon: "🛣️" },
  { key: "events", href: "/riding/events", icon: "🏁" },
  { key: "tours", href: "/riding/tours", icon: "✈️", tag: "partner" },
  { key: "records", href: "/riding/records", icon: "📈" },
  { key: "checkin", href: "/riding/checkin", icon: "✅" },
  { key: "best", href: "/riding/best", icon: "⭐" },
  { key: "places", href: "/riding/places", icon: "☕", tag: "vendor" },
] as const;

function formatMeetAt(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}.${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default async function RidingHubPage() {
  const t = await getTranslations("riding");
  const c = await getTranslations("common");
  const meetups = await getMeetups();
  const courses = await getCourses();
  const eventsByDate = await getEventsByDate();
  const bestCourses = await getBestCourses();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader title={t("hub.title")} description={t("hub.description")} />

      {/* ── 기능 카드 그리드 ── */}
      <section className="mt-6 animate-fade-up">
        <SectionHeader title={t("hub.sectionTitle")} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {HUB_CARDS.map((card) => (
            <Link key={card.key} href={card.href}>
              <Card hover className="flex h-full flex-col gap-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{card.icon}</span>
                  {"tag" in card && card.tag && (
                    <Badge variant={card.tag}>
                      {c(`badge.${card.tag === "vendor" ? "vendor" : "partner"}`)}
                    </Badge>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold">
                    {t(`hub.cards.${card.key}`)}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-fg-muted">
                    {t(`hub.cards.${card.key}Desc`)}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 다가오는 모임 ── */}
      <section className="mt-12 animate-fade-up">
        <SectionHeader
          title={t("hub.preview.meetups")}
          href="/riding/meetups"
          moreLabel={c("action.viewAll")}
          accent
        />
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {meetups.slice(0, 3).map((m) => (
            <Card key={m.id} hover className="p-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {m.type === "region"
                    ? t("meetups.typeRegion")
                    : t("meetups.typeModel")}
                </Badge>
                <span className="text-[11px] text-fg-subtle">{m.region}</span>
              </div>
              <h3 className="mt-2 truncate text-sm font-bold">{m.title}</h3>
              <p className="mt-1 text-xs text-fg-muted">
                {formatMeetAt(m.meetAt)} · {t("meetups.host")} {m.host}
              </p>
              <p className="mt-2 font-mono text-xs text-neon">
                {t("meetups.joinedOf", {
                  joined: m.joined,
                  capacity: m.capacity,
                })}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 인기 코스 ── */}
      <section className="mt-12 animate-fade-up">
        <SectionHeader
          title={t("hub.preview.courses")}
          href="/riding/courses"
          moreLabel={c("action.viewAll")}
        />
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {courses.slice(0, 4).map((course) => (
            <Card key={course.id} hover className="p-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {c(`difficulty.${course.difficulty}`)}
                </Badge>
                {course.isBest && (
                  <Badge variant="neon">{c("badge.best")}</Badge>
                )}
              </div>
              <h3 className="mt-2 truncate text-sm font-bold">
                {course.title}
              </h3>
              <p className="mt-1 text-xs text-fg-muted">
                {course.region} · {course.distanceKm}km
              </p>
              <div className="mt-2">
                <RatingStars
                  rating={course.rating}
                  count={course.reviewCount}
                />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 예정된 행사 + 베스트 코스 ── */}
      <section className="mt-12 grid gap-6 animate-fade-up md:grid-cols-2">
        <div>
          <SectionHeader
            title={t("hub.preview.events")}
            href="/riding/events"
            moreLabel={c("action.viewAll")}
          />
          <Card className="divide-y divide-border">
            {eventsByDate.slice(0, 4).map((ev) => (
              <div key={ev.id} className="flex items-center gap-3 p-3.5">
                <Badge variant={ev.type === "race" ? "warning" : "info"}>
                  {ev.type === "race"
                    ? t("events.race")
                    : t("events.festival")}
                </Badge>
                <span className="line-clamp-1 flex-1 text-sm">{ev.title}</span>
                <span className="shrink-0 font-mono text-[11px] text-fg-subtle">
                  {ev.startsAt.slice(5, 10).replace("-", ".")}
                </span>
              </div>
            ))}
          </Card>
        </div>

        <div>
          <SectionHeader
            title={t("hub.preview.best")}
            href="/riding/best"
            moreLabel={c("action.viewAll")}
            accent
          />
          <Card className="divide-y divide-border">
            {bestCourses.slice(0, 4).map((course, i) => (
              <div key={course.id} className="flex items-center gap-3 p-3.5">
                <span className="font-mono text-sm font-black text-neon">
                  {i + 1}
                </span>
                <span className="line-clamp-1 flex-1 text-sm">
                  {course.title}
                </span>
                <span className="shrink-0">
                  <RatingStars rating={course.rating} />
                </span>
              </div>
            ))}
          </Card>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
