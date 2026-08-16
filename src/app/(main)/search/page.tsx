import { getTranslations } from "next-intl/server";
import { getBrands, getBrand } from "@/data/mock/brands";
import { getModels, getPopularModels } from "@/data/mock/models";
import { getNewsList } from "@/data/mock/news";
import { ModelCard } from "@/components/cards/ModelCard";
import { BrandCard } from "@/components/cards/BrandCard";
import { PageHeader } from "@/components/ui/primitives";
import {
  SearchClient,
  type SearchNewsItem,
  type SearchNode,
} from "@/components/search/SearchClient";

export const revalidate = 300;

/** 인기 검색어(목업) — 데이터에서 파생한 대표 키워드. */
const POPULAR_TERMS = ["MT-09", "듀크", "GS", "네이키드", "야마하", "파니갈레"];

export default async function SearchPage() {
  const t = await getTranslations("search");
  const brands = await getBrands();
  const models = await getModels();
  const news = await getNewsList();
  const popularModels = await getPopularModels();

  // 브랜드/모델 카드는 서버에서 미리 렌더해 클라이언트 필터에 노드로 전달(BrandFilter 패턴).
  const brandNodes: SearchNode[] = brands.map((b) => ({
    id: b.id,
    text: `${b.nameKo} ${b.name} ${b.description}`.toLowerCase(),
    node: <BrandCard brand={b} />,
  }));

  const modelNodes: SearchNode[] = await Promise.all(
    models.map(async (m) => {
      const brand = await getBrand(m.brandId);
      return {
        id: m.id,
        text: `${m.nameKo} ${m.name} ${m.tagline} ${brand?.nameKo ?? ""} ${
          brand?.name ?? ""
        }`.toLowerCase(),
        node: <ModelCard model={m} />,
      };
    }),
  );

  const newsItems: SearchNewsItem[] = news.map((n) => ({
    id: n.id,
    title: n.title,
    summary: n.summary,
    source: n.source,
    category: n.category,
    publishedAt: n.publishedAt,
    text: `${n.title} ${n.summary}`.toLowerCase(),
  }));

  const popularNodes: SearchNode[] = popularModels.slice(0, 4).map((m) => ({
    id: m.id,
    text: "",
    node: <ModelCard model={m} />,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader title={t("title")} description={t("description")} />
      <div className="mt-6">
        <SearchClient
          brands={brandNodes}
          models={modelNodes}
          news={newsItems}
          popularModels={popularNodes}
          popularTerms={POPULAR_TERMS}
        />
      </div>
    </div>
  );
}
