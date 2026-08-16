import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getNews, getNewsList } from "@/data/mock/news";
import { getBrand } from "@/data/mock/brands";
import { getModel } from "@/data/mock/models";
import { Card, SectionHeader } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { categoryVariant } from "@/components/news/category";

export const revalidate = 300;

export async function generateStaticParams() {
  const news = await getNewsList();
  return news.map((n) => ({ id: n.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getNews(id);
  if (!item) return {};

  return {
    title: item.title,
    description: item.summary,
    openGraph: {
      title: item.title,
      description: item.summary,
      images: item.imageUrl ? [item.imageUrl] : undefined,
    },
  };
}

function fmtDate(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, ".");
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getNews(id);
  if (!item) notFound();

  const t = await getTranslations("news");
  const brand = item.brandId ? await getBrand(item.brandId) : undefined;
  const model = item.modelId ? await getModel(item.modelId) : undefined;
  const news = await getNewsList();
  const related = news
    .filter((n) => n.category === item.category && n.id !== item.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link
        href="/news"
        className="inline-flex items-center gap-1 text-xs font-medium text-fg-muted transition-colors hover:text-neon"
      >
        ← {t("backToNews")}
      </Link>

      <article className="mt-4">
        <div className="flex items-center gap-2">
          <Badge variant={categoryVariant(item.category)}>
            {t(`cat.${item.category}`)}
          </Badge>
          <span className="text-xs text-fg-subtle">
            {fmtDate(item.publishedAt)}
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-black leading-tight tracking-tight md:text-3xl">
          {item.title}
        </h1>
        <p className="mt-2 text-xs text-fg-subtle">
          {t("source")} · {item.source}
        </p>

        <p className="mt-6 text-sm font-medium text-fg-muted">{item.summary}</p>
        <div className="mt-4 border-t border-border pt-6">
          <p className="whitespace-pre-line text-sm leading-relaxed md:text-base">
            {item.content}
          </p>
        </div>
      </article>

      {/* ── 관련 브랜드/모델 ── */}
      {(brand || model) && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {model && (
            <Card hover className="p-4">
              <p className="text-[11px] font-medium text-fg-subtle">
                {t("relatedModel")}
              </p>
              <p className="mt-1 text-base font-bold">{model.nameKo}</p>
              <p className="mt-0.5 line-clamp-1 text-xs text-fg-muted">
                {model.tagline}
              </p>
              <Link
                href={`/models/${model.id}`}
                className="mt-3 inline-block rounded-lg border border-border-strong px-3 py-1.5 text-xs font-bold transition-colors hover:border-neon/50 hover:text-neon"
              >
                {t("viewModel")} →
              </Link>
            </Card>
          )}
          {brand && (
            <Card hover className="p-4">
              <p className="text-[11px] font-medium text-fg-subtle">
                {t("relatedBrand")}
              </p>
              <p className="mt-1 text-base font-bold">{brand.nameKo}</p>
              <p className="mt-0.5 line-clamp-1 text-xs text-fg-muted">
                {brand.name}
              </p>
              <Link
                href={`/brands/${brand.id}`}
                className="mt-3 inline-block rounded-lg border border-border-strong px-3 py-1.5 text-xs font-bold transition-colors hover:border-neon/50 hover:text-neon"
              >
                {t("viewBrand")} →
              </Link>
            </Card>
          )}
        </div>
      )}

      {/* ── 관련 뉴스 ── */}
      {related.length > 0 && (
        <section className="mt-12">
          <SectionHeader title={t("related")} />
          <Card className="divide-y divide-border">
            {related.map((n) => (
              <Link
                key={n.id}
                href={`/news/${n.id}`}
                className="flex items-start gap-3 p-4 transition-colors hover:bg-bg-elevated"
              >
                <Badge variant={categoryVariant(n.category)}>
                  {t(`cat.${n.category}`)}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium">{n.title}</p>
                  <p className="mt-0.5 text-[11px] text-fg-subtle">
                    {fmtDate(n.publishedAt)}
                  </p>
                </div>
              </Link>
            ))}
          </Card>
        </section>
      )}

      <div className="h-8" />
    </div>
  );
}
