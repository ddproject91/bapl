import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getDiagnosisFlows } from "@/data/mock/garage";
import { PageHeader } from "@/components/ui/primitives";
import { DiagnosisTool } from "@/components/garage/DiagnosisTool";

export const revalidate = 300;

export default async function DiagnosisPage() {
  const t = await getTranslations("garage");
  const diagnosisFlows = await getDiagnosisFlows();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title={t("diagnosis.title")}
        description={t("diagnosis.description")}
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
        <DiagnosisTool flows={diagnosisFlows} />
      </div>

      <div className="h-8" />
    </div>
  );
}
