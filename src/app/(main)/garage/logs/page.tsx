import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/primitives";
import { LogsView } from "@/components/garage/LogsView";
import { getModels } from "@/data/mock/models";
import { myBikes, getLogsByBike } from "@/data/mock/garage";

export const revalidate = 300;

export default async function LogsPage() {
  const t = await getTranslations("garage");
  const models = await getModels();
  const bikes = myBikes.map((bike) => ({ bike, logs: getLogsByBike(bike.id) }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title={t("logs.title")}
        description={t("logs.description")}
        action={
          <Link
            href="/garage"
            className="text-xs font-medium text-fg-muted transition-colors hover:text-neon"
          >
            ← {t("backToHub")}
          </Link>
        }
      />

      <div className="mt-6">
        <LogsView models={models} bikes={bikes} />
      </div>

      <div className="h-8" />
    </div>
  );
}
