import { getTranslations } from "next-intl/server";
import { getTourPackages } from "@/data/mock/riding";
import { PageHeader, Card, ComingSoonCard } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { formatManwon } from "@/lib/utils";

export const revalidate = 300;

export default async function ToursPage() {
  const t = await getTranslations("riding");
  const c = await getTranslations("common");
  const tourPackages = await getTourPackages();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title={t("tours.title")}
        description={t("tours.description")}
        action={<Badge variant="partner">{c("badge.partner")}</Badge>}
      />

      {/* 준비중 안내 */}
      <div className="mt-6 animate-fade-up">
        <ComingSoonCard
          title={t("tours.comingSoonTitle")}
          description={t("tours.comingSoonBody")}
          tag={c("badge.partner")}
        />
      </div>

      {/* 제휴 예정 상품 미리보기 (흐리게 데모) */}
      <section className="mt-8 animate-fade-up">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-fg-muted">
          {t("tours.previewLabel")}
          <Badge variant="soon">{c("badge.comingSoon")}</Badge>
        </h2>
        <div className="grid gap-3 opacity-60 sm:grid-cols-2">
          {tourPackages.map((pkg) => (
            <Card key={pkg.id} className="flex flex-col p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-fg-subtle">
                  {t("tours.partner")} · {pkg.partner}
                </span>
                <Badge variant="partner">{c("badge.partner")}</Badge>
              </div>
              <h3 className="mt-2 text-sm font-bold">{pkg.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-fg-muted">
                {pkg.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-neon">
                  {formatManwon(pkg.priceFromManwon)}~
                </span>
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-lg border border-border px-3 py-1.5 text-[11px] font-bold text-fg-subtle"
                >
                  {t("tours.inquire")}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <p className="mt-6 text-center text-[11px] text-fg-subtle">
        {c("footer.notice")}
      </p>
    </div>
  );
}
