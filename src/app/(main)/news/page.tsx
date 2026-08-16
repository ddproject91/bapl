import { getTranslations } from "next-intl/server";
import { getNewsList } from "@/data/mock/news";
import { getBrand } from "@/data/mock/brands";
import { getModel } from "@/data/mock/models";
import { PageHeader } from "@/components/ui/primitives";
import { NewsFilter, type NewsListItem } from "@/components/news/NewsFilter";

export const revalidate = 300;

export default async function NewsPage() {
  const t = await getTranslations("news");
  const news = await getNewsList();

  // 관련 브랜드/모델 이름을 서버에서 미리 주입 → 클라이언트 필터에 전달.
  const items: NewsListItem[] = await Promise.all(
    news.map(async (n) => ({
      ...n,
      brandNameKo: n.brandId ? (await getBrand(n.brandId))?.nameKo : undefined,
      modelNameKo: n.modelId ? (await getModel(n.modelId))?.nameKo : undefined,
    })),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader title={t("title")} description={t("description")} />
      <div className="mt-6">
        <NewsFilter items={items} />
      </div>
    </div>
  );
}
