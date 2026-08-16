import { getTranslations } from "next-intl/server";
import { getMeetups } from "@/data/mock/riding";
import { PageHeader } from "@/components/ui/primitives";
import { MeetupsList } from "@/components/riding/MeetupsList";

export const revalidate = 300;

export default async function MeetupsPage() {
  const t = await getTranslations("riding");
  const meetups = await getMeetups();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title={t("meetups.title")}
        description={t("meetups.description")}
      />
      <div className="mt-6 animate-fade-up">
        <MeetupsList meetups={meetups} />
      </div>
    </div>
  );
}
