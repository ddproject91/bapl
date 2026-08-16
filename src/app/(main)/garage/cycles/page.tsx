import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getConsumableCycles } from "@/data/mock/garage";
import { PageHeader, Card } from "@/components/ui/primitives";
import { CycleSimulator } from "@/components/garage/CycleSimulator";
import { formatKm } from "@/lib/utils";

export const revalidate = 300;

export default async function CyclesPage() {
  const t = await getTranslations("garage");
  const consumableCycles = await getConsumableCycles();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title={t("cycles.title")}
        description={t("cycles.description")}
        action={
          <Link
            href="/garage"
            className="text-xs font-medium text-fg-muted transition-colors hover:text-neon"
          >
            ← {t("backToHub")}
          </Link>
        }
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* ── 주기 표 ── */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-fg-subtle">
                  <th className="px-4 py-3 font-medium">
                    {t("cycles.table.item")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("cycles.table.intervalKm")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("cycles.table.intervalMonths")}
                  </th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">
                    {t("cycles.table.note")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {consumableCycles.map((cy) => (
                  <tr key={cy.item}>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap">
                      {cy.itemKo}
                    </td>
                    <td className="px-4 py-3 font-mono text-neon whitespace-nowrap">
                      {formatKm(cy.intervalKm)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-fg-muted">
                      {t("cycles.months", { months: cy.intervalMonths })}
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-fg-subtle md:table-cell">
                      {cy.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ── 시뮬레이터 ── */}
        <CycleSimulator cycles={consumableCycles} />
      </div>

      <div className="h-8" />
    </div>
  );
}
