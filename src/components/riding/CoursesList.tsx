"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Course } from "@/lib/types";
import { Card, Chip, RatingStars } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";

type Diff = "all" | "easy" | "medium" | "hard";

export function CoursesList({ courses }: { courses: Course[] }) {
  const t = useTranslations("riding");
  const c = useTranslations("common");
  const [diff, setDiff] = useState<Diff>("all");
  const [notice, setNotice] = useState<string | null>(null);

  const filtered =
    diff === "all" ? courses : courses.filter((x) => x.difficulty === diff);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium text-fg-subtle">
            {t("courses.filterDifficulty")}
          </span>
          {(["all", "easy", "medium", "hard"] as const).map((v) => (
            <Chip key={v} active={diff === v} onClick={() => setDiff(v)}>
              {v === "all" ? t("courses.difficultyAll") : c(`difficulty.${v}`)}
            </Chip>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setNotice(t("courses.gpxDemo"))}
          className="shrink-0 rounded-lg border border-border-strong px-3 py-1.5 text-xs font-bold transition-colors hover:border-neon/50 hover:text-neon"
        >
          {t("courses.gpxUpload")}
        </button>
      </div>

      {notice && (
        <p className="mt-4 rounded-xl border border-neon/30 bg-neon/10 px-4 py-2.5 text-xs text-neon">
          {notice}
        </p>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {filtered.map((course) => (
          <Card key={course.id} className="flex flex-col p-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {c(`difficulty.${course.difficulty}`)}
              </Badge>
              {course.isBest && <Badge variant="neon">{c("badge.best")}</Badge>}
              <span className="ml-auto text-[11px] text-fg-subtle">
                {course.region}
              </span>
            </div>
            <h3 className="mt-2 text-sm font-bold">{course.title}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-fg-muted">
              {course.description}
            </p>

            <dl className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-lg bg-bg-elevated px-2.5 py-1.5">
                <dt className="text-fg-subtle">{t("courses.distance")}</dt>
                <dd className="mt-0.5 font-mono font-bold text-neon">
                  {course.distanceKm} km
                </dd>
              </div>
              <div className="rounded-lg bg-bg-elevated px-2.5 py-1.5">
                <dt className="text-fg-subtle">{t("courses.author")}</dt>
                <dd className="mt-0.5 truncate font-medium">{course.author}</dd>
              </div>
              <div className="col-span-2 rounded-lg bg-bg-elevated px-2.5 py-1.5">
                <dt className="text-fg-subtle">{t("courses.road")}</dt>
                <dd className="mt-0.5 font-medium text-fg-muted">
                  {course.roadCondition}
                </dd>
              </div>
            </dl>

            <div className="mt-3 flex items-center justify-between">
              <RatingStars rating={course.rating} count={course.reviewCount} />
              <button
                type="button"
                onClick={() => setNotice(t("courses.gpxDemo"))}
                className="rounded-lg bg-neon px-3 py-1.5 text-[11px] font-bold text-black transition-transform hover:scale-[1.03] active:scale-95"
              >
                {t("courses.gpxDownload")}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
