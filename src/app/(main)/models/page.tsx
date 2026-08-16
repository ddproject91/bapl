import { getTranslations } from "next-intl/server";
import { getModels } from "@/data/mock/models";
import { getBrands } from "@/data/mock/brands";
import { ModelCard } from "@/components/cards/ModelCard";
import {
  ModelFilter,
  type ModelFilterItem,
} from "@/components/models/ModelFilter";
import { PageHeader } from "@/components/ui/primitives";

export const revalidate = 300;

export default async function ModelsPage() {
  const t = await getTranslations("models");
  const models = await getModels();
  const brands = await getBrands();

  const items: ModelFilterItem[] = models.map((m) => ({
    id: m.id,
    brandId: m.brandId,
    category: m.category,
    displacementClass: m.displacementClass,
    popular: !!m.isPopular,
    price: m.years[m.years.length - 1]?.priceKrw ?? 0,
    node: <ModelCard model={m} />,
  }));

  const brandOpts = brands.map((b) => ({ id: b.id, nameKo: b.nameKo }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader title={t("list.title")} description={t("list.description")} />
      <div className="mt-5">
        <ModelFilter items={items} brands={brandOpts} />
      </div>
    </div>
  );
}
