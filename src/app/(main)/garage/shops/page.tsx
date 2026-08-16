import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getShopPreviews } from "@/data/mock/garage";
import { PageHeader, Card, ComingSoonCard, RatingStars } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";

export const revalidate = 300;

export default async function ShopsPage() {
  const t = await getTranslations("garage");
  const c = await getTranslations("common");
  const shopPreviews = await getShopPreviews();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title={t("shops.title")}
        description={t("shops.description")}
        action={
          <Link
            href="/garage"
            className="text-xs font-medium text-fg-muted transition-colors hover:text-neon"
          >
            ← {t("backToHub")}
          </Link>
        }
      />

      <div className="mt-6 flex items-center gap-2">
        <Badge variant="vendor">{c("badge.vendor")}</Badge>
        <Badge variant="soon">{c("badge.comingSoon")}</Badge>
      </div>

      <div className="mt-4">
        <ComingSoonCard
          title={t("shops.soonTitle")}
          description={t("shops.soonDesc")}
          tag={c("badge.vendor")}
        />
      </div>

      {/* ── 지도 플레이스홀더 ── */}
      <div className="mt-6">
        <Card className="relative flex aspect-[16/9] items-center justify-center overflow-hidden md:aspect-[21/9]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative flex flex-col items-center gap-2 text-center">
            <span className="text-3xl opacity-60" aria-hidden>
              🗺️
            </span>
            <p className="text-sm font-bold text-fg-muted">
              {t("shops.mapPlaceholder")}
            </p>
            <p className="max-w-xs text-xs text-fg-subtle">
              {t("shops.mapNote")}
            </p>
          </div>
        </Card>
      </div>

      {/* ── 입점 예정 정비소 미리보기 ── */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold tracking-tight md:text-xl">
          {t("shops.previewTitle")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {shopPreviews.map((shop) => (
            <Card key={shop.id} className="p-4 opacity-90">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold">{shop.name}</h3>
                  <p className="mt-0.5 text-xs text-fg-subtle">{shop.region}</p>
                </div>
                <Badge variant="vendor">{c("badge.vendor")}</Badge>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <RatingStars rating={shop.rating} />
                <span className="text-[11px] text-fg-muted">
                  {shop.specialty}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
