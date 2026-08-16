import { getTranslations } from "next-intl/server";
import { getListingsByCategory, getGroupbuyMeta } from "@/data/mock/market";
import { PageHeader, Card, BikeThumb } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { formatManwon } from "@/lib/utils";

export const revalidate = 300;

export default async function GroupbuyPage() {
  const t = await getTranslations("market");
  const items = await getListingsByCategory("groupbuy");
  const groupbuyMeta = await getGroupbuyMeta();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title={t("groupbuy.title")}
        description={t("groupbuy.description")}
      />
      <p className="mt-5 text-xs text-fg-subtle">
        {t("groupbuy.resultCount", { count: items.length })}
      </p>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {items.map((l) => {
          const meta = groupbuyMeta[l.id] ?? { joined: 0, target: 1 };
          const pct = Math.min(100, Math.round((meta.joined / meta.target) * 100));
          const achieved = meta.joined >= meta.target;
          const remain = Math.max(0, meta.target - meta.joined);
          return (
            <Card key={l.id} as="article" hover className="p-4">
              <div className="flex gap-4">
                <div className="w-28 shrink-0">
                  <BikeThumb color={l.thumbColor} />
                </div>
                <div className="min-w-0 flex-1">
                  <Badge variant="neon">{t("cat.groupbuy")}</Badge>
                  <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug">
                    {l.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-fg-subtle">
                    {t("groupbuy.priceLabel")}
                  </p>
                  <p className="font-mono text-base font-black text-neon">
                    {formatManwon(l.priceManwon)}
                  </p>
                </div>
              </div>

              {/* 진행바 */}
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-fg">
                    {t("groupbuy.progress", {
                      joined: meta.joined,
                      target: meta.target,
                    })}
                  </span>
                  <span
                    className={achieved ? "font-bold text-neon" : "text-fg-muted"}
                  >
                    {achieved
                      ? t("groupbuy.achieved")
                      : t("groupbuy.remain", { remain })}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-bg-elevated">
                  <div
                    className="h-full rounded-full bg-neon transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                className="mt-4 w-full rounded-xl bg-neon px-4 py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.01] active:scale-95"
              >
                {t("groupbuy.join")}
              </button>
            </Card>
          );
        })}
      </div>
      <div className="h-8" />
    </div>
  );
}
