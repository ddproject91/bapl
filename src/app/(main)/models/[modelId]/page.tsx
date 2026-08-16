import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getModel, getModelsByBrand, getModels } from "@/data/mock/models";
import { getBrand } from "@/data/mock/brands";
import { getNewsList } from "@/data/mock/news";
import { ModelCard } from "@/components/cards/ModelCard";
import { ModelTabs } from "@/components/models/ModelTabs";
import {
  BikeThumb,
  RatingStars,
  SectionHeader,
} from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { formatManwon } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  const models = await getModels();
  return models.map((m) => ({ modelId: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ modelId: string }>;
}): Promise<Metadata> {
  const { modelId } = await params;
  const model = await getModel(modelId);
  if (!model) return {};

  const image = model.imageUrl;
  const title = `${model.nameKo} | ${model.tagline}`;

  return {
    title,
    description: model.tagline,
    openGraph: {
      title,
      description: model.tagline,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ modelId: string }>;
}) {
  const { modelId } = await params;
  const model = await getModel(modelId);
  if (!model) notFound();

  const t = await getTranslations("models");
  const c = await getTranslations("common");
  const brand = await getBrand(model.brandId);
  const latest = model.years[model.years.length - 1];
  const news = await getNewsList();
  const relatedNews = news.filter(
    (n) => n.modelId === model.id || n.brandId === model.brandId,
  );
  const siblings = (await getModelsByBrand(model.brandId)).filter(
    (m) => m.id !== model.id,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* 브레드크럼 */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-fg-subtle">
        <Link href="/models" className="hover:text-neon">
          {t("detail.backToList")}
        </Link>
        {brand && (
          <>
            <span>/</span>
            <Link href={`/brands/${brand.id}`} className="hover:text-neon">
              {brand.nameKo}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-fg-muted">{model.nameKo}</span>
      </div>

      {/* 히어로 */}
      <div className="grid gap-6 md:grid-cols-2">
        <BikeThumb
          color={model.heroColor}
          ratio="aspect-[16/9]"
          src={model.imageUrl}
          alt={model.nameKo}
        />
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-fg-muted">
              {brand?.nameKo}
            </span>
            {model.isNew && <Badge variant="neon">{c("badge.new")}</Badge>}
            {model.isPopular && <Badge variant="neon">{c("badge.hot")}</Badge>}
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">
            {model.nameKo}
          </h1>
          {model.name !== model.nameKo && (
            <p className="text-sm text-fg-subtle">{model.name}</p>
          )}
          <p className="mt-2 text-sm text-fg-muted">{model.tagline}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{c(`cat.${model.category}`)}</Badge>
            <Badge variant="outline">
              {c(`disp.${model.displacementClass}`)}
            </Badge>
            <RatingStars
              rating={model.ratingAvg}
              count={model.ratingCount}
              size="md"
            />
          </div>

          {latest && (
            <div className="mt-4">
              <span className="text-xs text-fg-subtle">
                {t("detail.latestPrice")} ({latest.year})
              </span>
              <p className="font-mono text-2xl font-black text-neon">
                {formatManwon(Math.round(latest.priceKrw / 10000))}
              </p>
            </div>
          )}

          {/* 컬러웨이 */}
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-fg-subtle">
              {t("detail.colorways")}
            </p>
            <div className="flex flex-wrap gap-3">
              {model.colorways.map((cw) => (
                <div key={cw.name} className="flex items-center gap-1.5">
                  <span
                    className="h-5 w-5 rounded-full border border-border-strong"
                    style={{ background: cw.hex }}
                    aria-hidden
                  />
                  <span className="text-xs text-fg-muted">{cw.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="mt-10">
        <ModelTabs model={model} relatedNews={relatedNews} />
      </div>

      {/* 같은 브랜드 다른 모델 */}
      {siblings.length > 0 && (
        <section className="mt-14">
          <SectionHeader title={t("detail.relatedModels")} />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {siblings.map((m) => (
              <ModelCard key={m.id} model={m} />
            ))}
          </div>
        </section>
      )}

      <div className="h-8" />
    </div>
  );
}
