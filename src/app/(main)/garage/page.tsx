import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  getMaintenanceGuides,
  getConsumableCycles,
  getRepairCosts,
} from "@/data/mock/garage";
import { PageHeader, Card } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { formatKm, formatManwon } from "@/lib/utils";

export const revalidate = 300;

const CARDS = [
  { key: "manuals", href: "/garage/manuals", icon: "📖" },
  { key: "cycles", href: "/garage/cycles", icon: "🔄" },
  { key: "costs", href: "/garage/costs", icon: "💰" },
  { key: "shops", href: "/garage/shops", icon: "🛠️", vendor: true },
  { key: "logs", href: "/garage/logs", icon: "🗂️" },
  { key: "diagnosis", href: "/garage/diagnosis", icon: "🩺" },
  { key: "faq", href: "/garage/faq", icon: "❓" },
] as const;

const DIFFICULTY_VARIANT = {
  easy: "neon",
  medium: "warning",
  hard: "danger",
} as const;

export default async function GarageHubPage() {
  const t = await getTranslations("garage");
  const c = await getTranslations("common");
  const maintenanceGuides = await getMaintenanceGuides();
  const consumableCycles = await getConsumableCycles();
  const repairCosts = await getRepairCosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader title={t("title")} description={t("description")} />

      {/* ── 소모품 알림 소개 배너 ── */}
      <section className="mt-6">
        <Card className="relative overflow-hidden p-6">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(110% 90% at 90% -10%, rgba(0,230,118,0.16) 0%, transparent 50%)",
            }}
          />
          <Badge variant="neon" glow>
            {t("hub.alert.badge")}
          </Badge>
          <h2 className="mt-3 text-lg font-black tracking-tight md:text-xl">
            {t("hub.alert.title")}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-fg-muted">
            {t("hub.alert.desc")}
          </p>
          <Link
            href="/garage/cycles"
            className="mt-4 inline-block rounded-xl bg-neon px-5 py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.03] active:scale-95"
          >
            {t("hub.alert.cta")} →
          </Link>
        </Card>
      </section>

      {/* ── 기능 카드 ── */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold tracking-tight md:text-xl">
          {t("hub.sectionTitle")}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {CARDS.map((card) => (
            <Link key={card.key} href={card.href}>
              <Card hover className="flex h-full flex-col gap-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{card.icon}</span>
                  {"vendor" in card && card.vendor && (
                    <Badge variant="vendor">{c("badge.vendor")}</Badge>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold">
                    {t(`hub.cards.${card.key}.title`)}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-fg-muted">
                    {t(`hub.cards.${card.key}.desc`)}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 미리보기: 정비 매뉴얼 ── */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight md:text-xl">
            {t("hub.guidesTitle")}
          </h2>
          <Link
            href="/garage/manuals"
            className="text-xs font-medium text-fg-muted transition-colors hover:text-neon"
          >
            {c("action.viewAll")} →
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {maintenanceGuides.slice(0, 3).map((g) => (
            <Card key={g.id} hover className="p-4">
              <div className="flex items-center gap-2">
                <Badge variant={DIFFICULTY_VARIANT[g.difficulty]}>
                  {c(`difficulty.${g.difficulty}`)}
                </Badge>
                {g.modelName && (
                  <span className="text-[11px] text-fg-subtle">
                    {g.modelName}
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-sm font-bold">{g.task}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-fg-muted">
                {g.summary}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 미리보기: 소모품 주기 + 비용 시세 ── */}
      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight md:text-xl">
              {t("hub.cyclesTitle")}
            </h2>
            <Link
              href="/garage/cycles"
              className="text-xs font-medium text-fg-muted transition-colors hover:text-neon"
            >
              {c("action.viewAll")} →
            </Link>
          </div>
          <Card className="divide-y divide-border">
            {consumableCycles.slice(0, 4).map((cy) => (
              <div
                key={cy.item}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="text-sm font-medium">{cy.itemKo}</span>
                <span className="font-mono text-xs font-bold text-neon">
                  {formatKm(cy.intervalKm)}
                </span>
              </div>
            ))}
          </Card>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight md:text-xl">
              {t("hub.costsTitle")}
            </h2>
            <Link
              href="/garage/costs"
              className="text-xs font-medium text-fg-muted transition-colors hover:text-neon"
            >
              {c("action.viewAll")} →
            </Link>
          </div>
          <Card className="divide-y divide-border">
            {repairCosts.slice(0, 4).map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <span className="truncate text-sm font-medium">{r.task}</span>
                <span className="shrink-0 font-mono text-xs font-bold text-neon">
                  {formatManwon(r.costManwon)}
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
