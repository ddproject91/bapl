import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/primitives";
import { RecordsView } from "@/components/riding/RecordsView";

export const revalidate = 300;

export default async function RecordsPage() {
  const t = await getTranslations("riding");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title={t("records.title")}
        description={t("records.description")}
      />
      <div className="mt-6 animate-fade-up">
        <RecordsView />
      </div>
    </div>
  );
}
