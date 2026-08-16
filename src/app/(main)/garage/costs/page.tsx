import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getRepairCosts } from "@/data/mock/garage";
import { PageHeader, Card } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { CostReportButton } from "@/components/garage/CostReportButton";
import { formatManwon } from "@/lib/utils";

export const revalidate = 300;

export default async function CostsPage() {
  const t = await getTranslations("garage");
  const c = await getTranslations("common");
  const repairCosts = await getRepairCosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title={t("costs.title")}
        description={t("costs.description")}
        action={
          <Link
            href="/garage"
            className="text-xs font-medium text-fg-muted transition-colors hover:text-neon"
          >
            ← {t("backToHub")}
          </Link>
        }
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="soon">{c("badge.comingSoon")}</Badge>
          <p className="text-xs text-fg-muted">{t("costs.demoNote")}</p>
        </div>
        <CostReportButton />
      </div>

      <Card className="mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-fg-subtle">
                <th className="px-4 py-3 font-medium">
                  {t("costs.table.task")}
                </th>
                <th className="px-4 py-3 font-medium">
                  {t("costs.table.model")}
                </th>
                <th className="px-4 py-3 font-medium">
                  {t("costs.table.cost")}
                </th>
                <th className="px-4 py-3 font-medium">
                  {t("costs.table.region")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {repairCosts.map((r, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 font-semibold">{r.task}</td>
                  <td className="px-4 py-3 text-xs text-fg-muted whitespace-nowrap">
                    {r.modelName ?? t("costs.commonModel")}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-neon whitespace-nowrap">
                    {formatManwon(r.costManwon)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant="muted">{r.region}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="h-8" />
    </div>
  );
}
