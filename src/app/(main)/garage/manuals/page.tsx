import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getMaintenanceGuides } from "@/data/mock/garage";
import { PageHeader, Card } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";

export const revalidate = 300;

const DIFFICULTY_VARIANT = {
  easy: "neon",
  medium: "warning",
  hard: "danger",
} as const;

export default async function ManualsPage() {
  const t = await getTranslations("garage");
  const c = await getTranslations("common");
  const maintenanceGuides = await getMaintenanceGuides();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title={t("manuals.title")}
        description={t("manuals.description")}
        action={
          <Link
            href="/garage"
            className="text-xs font-medium text-fg-muted transition-colors hover:text-neon"
          >
            ← {t("backToHub")}
          </Link>
        }
      />

      <Card className="mt-6 flex items-start gap-2 border-neon/30 bg-neon/[0.04] p-4">
        <span aria-hidden>🔗</span>
        <p className="text-xs text-fg-muted">{t("manuals.modelLinkNote")}</p>
      </Card>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {maintenanceGuides.map((g) => (
          <Card key={g.id} hover className="p-5">
            <div className="flex items-center gap-2">
              <Badge variant={DIFFICULTY_VARIANT[g.difficulty]}>
                {c(`difficulty.${g.difficulty}`)}
              </Badge>
              <Badge variant="muted">
                {g.modelName ?? t("manuals.commonModel")}
              </Badge>
            </div>
            <h3 className="mt-3 text-base font-bold">{g.task}</h3>
            <p className="mt-1.5 text-sm text-fg-muted">{g.summary}</p>
          </Card>
        ))}
      </div>

      <div className="h-8" />
    </div>
  );
}
