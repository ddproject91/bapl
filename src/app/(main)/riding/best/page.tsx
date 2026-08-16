import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getBestCourses } from "@/data/mock/riding";
import {
  PageHeader,
  Card,
  RatingStars,
  EmptyState,
} from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";

export const revalidate = 300;

export default async function BestCoursesPage() {
  const t = await getTranslations("riding");
  const c = await getTranslations("common");
  const bestCourses = await getBestCourses();

  const ranked = [...bestCourses].sort((a, b) => b.rating - a.rating);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader title={t("best.title")} description={t("best.description")} />

      <div className="mt-6 animate-fade-up">
        {ranked.length === 0 ? (
          <EmptyState title={t("best.empty")} icon="⭐" />
        ) : (
          <div className="space-y-3">
            {ranked.map((course, i) => (
              <Card key={course.id} hover className="flex gap-4 p-4">
                <div className="flex w-12 shrink-0 flex-col items-center justify-center">
                  <span className="font-mono text-2xl font-black text-neon">
                    {i + 1}
                  </span>
                  <span className="text-[10px] text-fg-subtle">
                    {t("best.rank", { rank: i + 1 })}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="neon">{c("badge.best")}</Badge>
                    <Badge variant="outline">
                      {c(`difficulty.${course.difficulty}`)}
                    </Badge>
                    <span className="text-[11px] text-fg-subtle">
                      {course.region} · {course.distanceKm}km
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold md:text-base">
                    {course.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-fg-muted">
                    {course.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <RatingStars
                      rating={course.rating}
                      count={course.reviewCount}
                    />
                    <span className="text-[11px] text-fg-subtle">
                      {course.author}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link
          href="/riding/courses"
          className="text-xs font-medium text-fg-muted transition-colors hover:text-neon"
        >
          {t("courses.title")} {c("action.viewAll")} →
        </Link>
      </div>
    </div>
  );
}
