import { getTranslations } from "next-intl/server";
import { getBrands } from "@/data/mock/brands";
import { getModelsByBrand } from "@/data/mock/models";
import { getBikePhotos } from "@/data/mock/media";
import { BrandCard } from "@/components/cards/BrandCard";
import { SectionBanner } from "@/components/brand/SectionBanner";
import {
  BrandFilter,
  type BrandFilterItem,
} from "@/components/brands/BrandFilter";

export const revalidate = 300;

export default async function BrandsPage() {
  const t = await getTranslations("brands");
  const brands = await getBrands();
  const bikePhotos = await getBikePhotos();

  // 각 브랜드의 모델에서 타입/배기량 메타데이터를 파생 → 교차 필터에 사용.
  // BrandCard는 서버에서 미리 렌더해 클라이언트 필터에 노드로 전달한다.
  const items: BrandFilterItem[] = await Promise.all(
    brands.map(async (brand) => {
      const brandModels = await getModelsByBrand(brand.id);
      return {
        id: brand.id,
        country: brand.country,
        categories: [...new Set(brandModels.map((m) => m.category))],
        displacementClasses: [
          ...new Set(brandModels.map((m) => m.displacementClass)),
        ],
        card: <BrandCard brand={brand} />,
      };
    }),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <SectionBanner
        title={t("title")}
        subtitle={t("description")}
        imageUrl={bikePhotos.brandsBanner || bikePhotos.hero || undefined}
        stat={{ value: String(brands.length), label: t("bannerStat") }}
      />
      <div className="mt-6">
        <BrandFilter items={items} />
      </div>
    </div>
  );
}
