import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getBrands } from "@/data/mock/brands";
import { getModels, getPopularModels } from "@/data/mock/models";
import { getNewsList } from "@/data/mock/news";
import { ModelCard } from "@/components/cards/ModelCard";
import { BrandCard } from "@/components/cards/BrandCard";
import { SectionHeader, Card } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import {
  BikeBlueprint,
  CheckeredStrip,
  SpeedLines,
} from "@/components/brand/BikeMotifs";
import { MainBanner } from "@/components/layout/MainBanner";

export const revalidate = 300;

const MENU = [
  { key: "brands", href: "/brands", icon: "🏭" },
  { key: "models", href: "/models", icon: "🏍️" },
  { key: "community", href: "/community", icon: "💬" },
  { key: "riding", href: "/riding", icon: "🛣️" },
  { key: "market", href: "/market", icon: "🏷️" },
  { key: "garage", href: "/garage", icon: "🔧" },
] as const;

export default async function HomePage() {
  const t = await getTranslations("home");
  const c = await getTranslations("common");
  const brands = await getBrands();
  const models = await getModels();
  const popularModels = await getPopularModels();
  const news = await getNewsList();

  const supabase = getSupabaseAdmin();
  const { count: memberCount } = supabase
    ? await supabase.from("profiles").select("*", { count: "exact", head: true })
    : { count: 0 };

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* ── 메인 배너 (어드민에서 ON/OFF) ── */}
      <MainBanner />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-b-3xl">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(120% 90% at 85% -10%, rgba(0,165,82,0.16) 0%, transparent 45%), radial-gradient(80% 60% at 0% 110%, rgba(0,165,82,0.07) 0%, transparent 50%)",
          }}
        />
        {/* 바이크 블루프린트 워터마크 */}
        <BikeBlueprint className="pointer-events-none absolute -right-8 top-6 hidden w-[440px] text-neon opacity-[0.08] md:block" />
        <CheckeredStrip
          className="pointer-events-none absolute right-0 top-0 h-3 w-36 text-fg opacity-10"
          rows={2}
          cols={18}
        />
        <div className="relative py-12 md:py-20">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-[11px] font-medium text-neon">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" />
            {t("hero.kicker")}
          </p>
          <SpeedLines className="mb-4 h-6 w-24 text-neon opacity-70" />
          <h1 className="whitespace-pre-line text-4xl font-black leading-[1.1] tracking-tight md:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-4 max-w-lg text-sm text-fg-muted md:text-base">
            {t("hero.subtitle")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/models"
              className="rounded-xl bg-neon px-5 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.03] active:scale-95"
            >
              {t("hero.ctaModels")}
            </Link>
            <Link
              href="/community"
              className="rounded-xl border border-border-strong px-5 py-3 text-sm font-bold transition-colors hover:border-neon/50 hover:text-neon"
            >
              {t("hero.ctaCommunity")}
            </Link>
          </div>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              { n: `${brands.length}`, label: t("hero.stat1") },
              { n: `${models.length}+`, label: t("hero.stat2") },
              { n: `${memberCount ?? 0}`, label: t("hero.stat3") },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-mono text-2xl font-black text-neon md:text-3xl">
                  {s.n}
                </p>
                <p className="text-[11px] text-fg-subtle">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 퀵 메뉴 ── */}
      <section className="mt-8">
        <SectionHeader title={t("menu.title")} />
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
          {MENU.map((m) => (
            <Link key={m.key} href={m.href}>
              <Card hover className="flex flex-col items-center gap-2 p-4 text-center">
                <span className="text-2xl">{m.icon}</span>
                <span className="text-xs font-bold">{c(`nav.${m.key}`)}</span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 인기 모델 ── */}
      <section className="mt-12">
        <SectionHeader
          title={t("popular.title")}
          href="/models"
          moreLabel={c("action.viewAll")}
          accent
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {popularModels.slice(0, 4).map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      </section>

      {/* ── 브랜드관 ── */}
      <section className="mt-12">
        <SectionHeader
          title={t("brands.title")}
          href="/brands"
          moreLabel={c("action.viewAll")}
        />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {brands.slice(0, 6).map((b) => (
            <BrandCard key={b.id} brand={b} />
          ))}
        </div>
      </section>

      {/* ── 뉴스 + 마켓 하이라이트 ── */}
      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div>
          <SectionHeader
            title={t("news.title")}
            href="/news"
            moreLabel={c("action.viewAll")}
          />
          <Card className="divide-y divide-border">
            {news.slice(0, 4).map((n) => (
              <Link
                key={n.id}
                href={`/news/${n.id}`}
                className="flex items-start gap-3 p-3.5 transition-colors hover:bg-bg-elevated"
              >
                <Badge
                  variant={
                    n.category === "law"
                      ? "warning"
                      : n.category === "recall"
                        ? "danger"
                        : "outline"
                  }
                >
                  {c(`badge.${n.category === "law" ? "notice" : "new"}`)}
                </Badge>
                <span className="line-clamp-1 flex-1 text-sm">{n.title}</span>
              </Link>
            ))}
          </Card>
        </div>

        <div>
          <SectionHeader
            title={t("market.title")}
            href="/market"
            moreLabel={c("action.viewAll")}
          />
          <Card hover className="p-5">
            <Badge variant="neon" glow>
              ✓ {c("badge.verified")}
            </Badge>
            <p className="mt-3 text-sm font-bold">{t("market.verifiedLead")}</p>
            <p className="mt-1 text-xs text-fg-muted">{t("market.subtitle")}</p>
            <Link
              href="/market/bikes"
              className="mt-4 inline-block rounded-lg border border-border-strong px-4 py-2 text-xs font-bold transition-colors hover:border-neon/50 hover:text-neon"
            >
              {c("action.viewAll")} →
            </Link>
          </Card>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
