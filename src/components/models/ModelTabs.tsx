"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Model, NewsItem } from "@/lib/types";
import {
  BikeThumb,
  RatingStars,
  EmptyState,
  Card,
} from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { cn, formatManwon, formatKm, formatNumber } from "@/lib/utils";

const TABS = [
  "spec",
  "review",
  "maintenance",
  "tuning",
  "gallery",
  "price",
  "newbike",
  "news",
  "faq",
] as const;
type TabKey = (typeof TABS)[number];

export function ModelTabs({
  model,
  relatedNews,
}: {
  model: Model;
  relatedNews: NewsItem[];
}) {
  const t = useTranslations("models");
  const [tab, setTab] = useState<TabKey>("spec");

  return (
    <div>
      <div className="no-scrollbar -mx-4 mb-6 flex gap-1 overflow-x-auto border-b border-border px-4">
        {TABS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={cn(
              "-mb-px shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              tab === k
                ? "border-neon text-neon"
                : "border-transparent text-fg-muted hover:text-fg",
            )}
          >
            {t(`tab.${k}`)}
          </button>
        ))}
      </div>

      <div key={tab} className="animate-fade-up">
        {tab === "spec" && <SpecTab model={model} />}
        {tab === "review" && <ReviewTab model={model} />}
        {tab === "maintenance" && (
          <BulletTab
            items={model.maintenance}
            title={t("maintenance.title")}
            empty={t("maintenance.empty")}
            icon="🔧"
          />
        )}
        {tab === "tuning" && (
          <BulletTab
            items={model.tuning}
            title={t("tuning.title")}
            empty={t("tuning.empty")}
            icon="⚙️"
          />
        )}
        {tab === "gallery" && <GalleryTab model={model} />}
        {tab === "price" && <PriceTab model={model} />}
        {tab === "newbike" && <NewbikeTab model={model} />}
        {tab === "news" && <NewsTab news={relatedNews} />}
        {tab === "faq" && <FaqTab model={model} />}
      </div>
    </div>
  );
}

/* ── 제원 ─────────────────────────────────────────────── */
function SpecTab({ model }: { model: Model }) {
  const t = useTranslations("models");
  const s = model.spec;
  const e = s.electronics;
  const latest = model.years[model.years.length - 1];
  const yn = (b?: boolean) => (b ? t("supported") : t("notSupported"));
  const absLabel =
    e.abs === "cornering"
      ? t("spec.absCornering")
      : e.abs === "standard"
        ? t("spec.absStandard")
        : t("notSupported");

  type Row = { label: string; value: string; mono?: boolean };
  const groups: { title: string; rows: Row[] }[] = [
    {
      title: t("spec.groupEngine"),
      rows: [
        { label: t("spec.engineType"), value: s.engineType },
        { label: t("spec.engineCc"), value: `${formatNumber(s.engineCc)} cc`, mono: true },
        {
          label: t("spec.power"),
          value: `${s.powerHp} hp / ${formatNumber(s.powerRpm)} rpm`,
          mono: true,
        },
        {
          label: t("spec.torque"),
          value: `${s.torqueNm} Nm / ${formatNumber(s.torqueRpm)} rpm`,
          mono: true,
        },
        { label: t("spec.cooling"), value: s.cooling },
      ],
    },
    {
      title: t("spec.groupChassis"),
      rows: [
        { label: t("spec.frame"), value: s.frameType },
        ...(s.lengthMm
          ? [
              {
                label: t("spec.dimensions"),
                value: `${formatNumber(s.lengthMm)} × ${
                  s.widthMm ? formatNumber(s.widthMm) : "-"
                } × ${s.heightMm ? formatNumber(s.heightMm) : "-"} mm`,
                mono: true,
              },
            ]
          : []),
        { label: t("spec.wheelbase"), value: `${formatNumber(s.wheelbaseMm)} mm`, mono: true },
        { label: t("spec.seatHeight"), value: `${formatNumber(s.seatHeightMm)} mm`, mono: true },
        ...(s.weightWetKg
          ? [{ label: t("spec.weightWet"), value: `${s.weightWetKg} kg`, mono: true }]
          : []),
        ...(s.weightDryKg
          ? [{ label: t("spec.weightDry"), value: `${s.weightDryKg} kg`, mono: true }]
          : []),
      ],
    },
    {
      title: t("spec.groupRiding"),
      rows: [
        { label: t("spec.fuel"), value: `${s.fuelCapacityL} L`, mono: true },
        ...(s.fuelEconomy
          ? [{ label: t("spec.economy"), value: `${s.fuelEconomy} km/L`, mono: true }]
          : []),
        { label: t("spec.suspensionF"), value: s.suspensionFront },
        { label: t("spec.suspensionR"), value: s.suspensionRear },
        { label: t("spec.brakeF"), value: s.brakeFront },
        { label: t("spec.brakeR"), value: s.brakeRear },
        { label: t("spec.tireF"), value: s.tireFront, mono: true },
        { label: t("spec.tireR"), value: s.tireRear, mono: true },
      ],
    },
    {
      title: t("spec.groupElectronics"),
      rows: [
        { label: t("spec.ridingModes"), value: e.ridingModes ?? t("notSupported") },
        { label: t("spec.tc"), value: yn(e.tractionControl) },
        { label: t("spec.abs"), value: absLabel },
        { label: t("spec.quickshifter"), value: yn(e.quickshifter) },
        { label: t("spec.cruise"), value: yn(e.cruise) },
        { label: t("spec.tft"), value: yn(e.tft) },
      ],
    },
    {
      title: t("spec.groupEtc"),
      rows: [
        ...(s.insuranceClass
          ? [{ label: t("spec.insurance"), value: s.insuranceClass }]
          : []),
        {
          label: t("spec.price"),
          value: latest ? formatManwon(Math.round(latest.priceKrw / 10000)) : "-",
          mono: true,
        },
      ],
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {groups.map((g) => (
        <Card key={g.title} className="overflow-hidden self-start">
          <h3 className="border-b border-border bg-bg-elevated px-4 py-2.5 text-sm font-bold text-neon">
            {g.title}
          </h3>
          <dl>
            {g.rows.map((r, i) => (
              <div
                key={r.label}
                className={cn(
                  "flex gap-3 px-4 py-2.5",
                  i % 2 === 1 && "bg-bg-elevated/40",
                )}
              >
                <dt className="w-28 shrink-0 text-xs leading-relaxed text-fg-muted">
                  {r.label}
                </dt>
                <dd
                  className={cn(
                    "flex-1 break-words text-sm leading-relaxed",
                    r.mono && "font-mono",
                  )}
                >
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      ))}
    </div>
  );
}

/* ── 리뷰/시승기 ──────────────────────────────────────── */
function ReviewTab({ model }: { model: Model }) {
  const t = useTranslations("models");
  if (model.reviews.length === 0)
    return <EmptyState title={t("review.empty")} icon="✍️" />;

  return (
    <div>
      <div className="mb-5 flex items-center gap-5 rounded-2xl border border-border bg-bg-card p-5">
        <div className="text-center">
          <p className="font-mono text-4xl font-black text-neon">
            {model.ratingAvg.toFixed(1)}
          </p>
          <RatingStars rating={model.ratingAvg} />
        </div>
        <div className="text-sm">
          <p className="font-medium">{t("review.summary")}</p>
          <p className="mt-0.5 text-xs text-fg-subtle">
            {t("review.count", { count: model.ratingCount })}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {model.reviews.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {r.isEditorial ? (
                <Badge variant="neon">{t("review.editorial")}</Badge>
              ) : (
                <Badge variant="muted">{t("review.user")}</Badge>
              )}
              <span className="text-sm font-bold">{r.author}</span>
              <RatingStars rating={r.rating} />
              {r.ownershipPeriod && (
                <span className="text-xs text-fg-subtle">
                  · {t("review.ownership", { period: r.ownershipPeriod })}
                </span>
              )}
              <span className="ml-auto font-mono text-xs text-fg-subtle">
                {r.createdAt}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-fg-muted">{r.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── 정비 / 튜닝 (불릿) ───────────────────────────────── */
function BulletTab({
  items,
  title,
  empty,
  icon,
}: {
  items: string[];
  title: string;
  empty: string;
  icon: string;
}) {
  if (items.length === 0) return <EmptyState title={empty} icon={icon} />;
  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-bold">{title}</h3>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-fg-muted">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-neon" />
            <span className="leading-relaxed">{it}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ── 갤러리 ───────────────────────────────────────────── */
function GalleryTab({ model }: { model: Model }) {
  const t = useTranslations("models");
  const n = Math.min(Math.max(model.gallery, 0), 12);
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold">{t("gallery.title")}</h3>
        <Badge variant="soon">{t("gallery.soon")}</Badge>
      </div>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
        {Array.from({ length: n }).map((_, i) => (
          <BikeThumb key={i} color={model.heroColor} ratio="aspect-square" />
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-fg-subtle">
        {t("gallery.soonHint", { count: model.gallery })}
      </p>
    </div>
  );
}

/* ── 중고 시세 ────────────────────────────────────────── */
function PriceTab({ model }: { model: Model }) {
  const t = useTranslations("models");
  const ph = model.priceHistory;
  if (ph.length === 0) return <EmptyState title={t("price.empty")} icon="📉" />;
  const max = Math.max(...ph.map((p) => p.soldPriceManwon));

  return (
    <Card className="p-5">
      <h3 className="mb-6 text-sm font-bold">{t("price.title")}</h3>
      <div className="flex items-end justify-around gap-3">
        {ph.map((p) => {
          const h = Math.max(8, Math.round((p.soldPriceManwon / max) * 100));
          return (
            <div key={p.year} className="flex flex-1 flex-col items-center">
              <span className="mb-1 font-mono text-xs font-bold text-neon">
                {formatManwon(p.soldPriceManwon)}
              </span>
              <div className="flex h-40 w-full max-w-[56px] items-end">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-neon/25 to-neon"
                  style={{ height: `${h}%` }}
                />
              </div>
              <span className="mt-2 text-xs font-medium">
                {t("price.yearUnit", { year: String(p.year) })}
              </span>
              <span className="mt-0.5 text-[11px] text-fg-subtle">
                {t("price.mileage", { km: formatKm(p.mileageKm) })}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-5 border-t border-border pt-3 text-center text-xs text-fg-subtle">
        {t("price.caption")}
      </p>
    </Card>
  );
}

/* ── 신차 정보 (타임라인) ─────────────────────────────── */
function NewbikeTab({ model }: { model: Model }) {
  const t = useTranslations("models");
  if (model.years.length === 0)
    return <EmptyState title={t("newbike.empty")} icon="🆕" />;

  return (
    <Card className="p-5">
      <h3 className="mb-5 text-sm font-bold">{t("newbike.title")}</h3>
      <ol className="relative space-y-5 border-l border-border pl-6">
        {model.years.map((y, i) => (
          <li key={y.year} className="relative">
            <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-neon bg-bg" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-lg font-black">{y.year}</span>
              {i === 0 && (
                <Badge variant="muted">{t("newbike.firstYear")}</Badge>
              )}
              <span className="ml-auto font-mono text-sm font-bold text-neon">
                {formatManwon(Math.round(y.priceKrw / 10000))}
              </span>
            </div>
            {y.changes && (
              <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                {y.changes}
              </p>
            )}
          </li>
        ))}
      </ol>
    </Card>
  );
}

/* ── 관련 뉴스 ────────────────────────────────────────── */
function NewsTab({ news }: { news: NewsItem[] }) {
  const t = useTranslations("models");
  if (news.length === 0)
    return (
      <EmptyState
        title={t("news.empty")}
        hint={t("news.emptyHint")}
        icon="📰"
      />
    );

  return (
    <div className="space-y-3">
      {news.map((n) => (
        <Link key={n.id} href={`/news/${n.id}`} className="block">
          <Card hover className="p-4">
            <div className="mb-1.5 flex items-center gap-2">
              <Badge
                variant={
                  n.category === "recall"
                    ? "danger"
                    : n.category === "law"
                      ? "warning"
                      : "outline"
                }
              >
                {t(`newsCat.${n.category}`)}
              </Badge>
              <span className="font-mono text-xs text-fg-subtle">
                {n.publishedAt}
              </span>
            </div>
            <h4 className="text-sm font-bold">{n.title}</h4>
            <p className="mt-1 line-clamp-2 text-xs text-fg-muted">
              {n.summary}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
}

/* ── FAQ (아코디언) ───────────────────────────────────── */
function FaqTab({ model }: { model: Model }) {
  const t = useTranslations("models");
  if (model.faq.length === 0)
    return <EmptyState title={t("faq.empty")} icon="❓" />;

  return (
    <div className="space-y-2">
      {model.faq.map((f, i) => (
        <details
          key={i}
          className="group rounded-xl border border-border bg-bg-card px-4"
        >
          <summary className="flex list-none items-center gap-2 py-3.5 text-sm font-medium">
            <span className="font-bold text-neon">Q</span>
            <span className="flex-1">{f.q}</span>
            <span className="text-fg-subtle transition-transform group-open:rotate-180">
              ▾
            </span>
          </summary>
          <p className="border-t border-border py-3.5 text-sm leading-relaxed text-fg-muted">
            {f.a}
          </p>
        </details>
      ))}
    </div>
  );
}
