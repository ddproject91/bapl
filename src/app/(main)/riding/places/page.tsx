import { getTranslations } from "next-intl/server";
import { getPlaces } from "@/data/mock/riding";
import { PageHeader } from "@/components/ui/primitives";
import { PlacesList } from "@/components/riding/PlacesList";

export const revalidate = 300;

export default async function PlacesPage() {
  const t = await getTranslations("riding");
  const c = await getTranslations("common");
  const places = await getPlaces();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader title={t("places.title")} description={t("places.description")} />

      <section className="mt-6 animate-fade-up">
        <h2 className="mb-3 text-sm font-bold text-fg-muted">
          {t("places.previewLabel")}
        </h2>
        <PlacesList places={places} />
      </section>

      <p className="mt-6 text-center text-[11px] text-fg-subtle">
        {c("footer.notice")}
      </p>
    </div>
  );
}
