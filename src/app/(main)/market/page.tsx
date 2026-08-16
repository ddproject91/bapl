import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getVerifiedBikes } from "@/data/mock/market";
import {
  PageHeader,
  SectionHeader,
  Card,
} from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { ListingCard, ListingGrid } from "@/components/market/ListingCard";

export const revalidate = 300;

const CATEGORIES = [
  { key: "bike", href: "/market/bikes", icon: "🏍️", vendor: false },
  { key: "gear", href: "/market/gear", icon: "🎒", vendor: false },
  { key: "apparel", href: "/market/apparel", icon: "🧥", vendor: true },
  { key: "parts", href: "/market/parts", icon: "🔩", vendor: true },
  { key: "dealer", href: "/market/dealers", icon: "🏪", vendor: true },
  { key: "groupbuy", href: "/market/groupbuy", icon: "👥", vendor: false },
  { key: "auction", href: "/market/auction", icon: "🔨", vendor: false },
] as const;

const SAFETY = ["chat", "manner", "wishlist", "report"] as const;

export default async function MarketPage() {
  const t = await getTranslations("market");
  const c = await getTranslations("common");
  const verifiedBikes = await getVerifiedBikes();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader title={t("title")} description={t("description")} />

      {/* ── 카테고리 그리드 ── */}
      <section className="mt-8">
        <SectionHeader title={t("hub.categoriesTitle")} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.key} href={cat.href}>
              <Card hover className="h-full p-4">
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{cat.icon}</span>
                  {cat.vendor && <Badge variant="vendor">{t("badge.vendor")}</Badge>}
                  {cat.key === "auction" && (
                    <Badge variant="soon">{c("badge.comingSoon")}</Badge>
                  )}
                </div>
                <h3 className="mt-3 text-sm font-bold">{t(`cat.${cat.key}`)}</h3>
                <p className="mt-1 text-[11px] text-fg-muted">
                  {t(`cat.${cat.key}Desc`)}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BAPL 인증 매물 하이라이트 ── */}
      <section className="mt-12">
        <div className="relative overflow-hidden rounded-2xl border border-neon/30 bg-bg-card p-5">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(90% 70% at 90% -10%, rgba(0,230,118,0.14) 0%, transparent 55%)",
            }}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Badge variant="neon" glow>
                ✓ {t("badge.verified")}
              </Badge>
              <h2 className="mt-2 text-lg font-bold text-neon md:text-xl">
                {t("hub.verifiedTitle")}
              </h2>
              <p className="mt-1 max-w-xl text-xs text-fg-muted">
                {t("hub.verifiedDesc")}
              </p>
            </div>
            <Link
              href="/market/bikes"
              className="shrink-0 rounded-xl border border-border-strong px-4 py-2 text-xs font-bold transition-colors hover:border-neon/50 hover:text-neon"
            >
              {t("hub.verifiedMore")} →
            </Link>
          </div>
          <div className="mt-5">
            <ListingGrid>
              {verifiedBikes.slice(0, 4).map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </ListingGrid>
          </div>
        </div>
      </section>

      {/* ── 안전 거래 안내 ── */}
      <section className="mt-12">
        <SectionHeader title={t("hub.safetyTitle")} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {SAFETY.map((k) => (
            <Card key={k} className="p-4">
              <h3 className="text-sm font-bold">{t(`safety.${k}`)}</h3>
              <p className="mt-1 text-[11px] text-fg-muted">
                {t(`safety.${k}Desc`)}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
