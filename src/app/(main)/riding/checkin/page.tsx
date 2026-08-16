import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/primitives";
import { CheckinCard } from "@/components/riding/CheckinCard";

export const revalidate = 300;

export default async function CheckinPage() {
  const t = await getTranslations("riding");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title={t("checkin.title")}
        description={t("checkin.description")}
      />
      <div className="mt-6 animate-fade-up">
        <CheckinCard />
      </div>
    </div>
  );
}
