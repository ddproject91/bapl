import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getBrands, getBrand } from "@/data/mock/brands";
import { getModelsByBrand } from "@/data/mock/models";
import { ModelCard } from "@/components/cards/ModelCard";
import { SectionHeader, Card, EmptyState } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";

export const revalidate = 300;

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((brand) => ({ brandId: brand.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brandId: string }>;
}): Promise<Metadata> {
  const { brandId } = await params;
  const brand = await getBrand(brandId);
  if (!brand) return {};

  return {
    title: brand.nameKo,
    description: brand.description,
    openGraph: {
      title: brand.nameKo,
      description: brand.description,
      images: brand.logoUrl ? [brand.logoUrl] : undefined,
    },
  };
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ brandId: string }>;
}) {
  const { brandId } = await params;
  const brand = await getBrand(brandId);
  if (!brand) notFound();

  const t = await getTranslations("brands");
  const c = await getTranslations("common");
  const brandModels = await getModelsByBrand(brand.id);
  const logoUrl = brand.logoUrl;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link
        href="/brands"
        className="inline-flex items-center gap-1 text-xs font-medium text-fg-muted transition-colors hover:text-neon"
      >
        ← {t("backToBrands")}
      </Link>

      {/* ── 브랜드 히어로 ── */}
      <section className="relative mt-3 overflow-hidden rounded-3xl border border-border bg-bg-card p-6 md:p-10">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(120% 100% at 100% -10%, ${brand.accent}33 0%, transparent 50%), radial-gradient(80% 80% at 0% 120%, ${brand.accent}1a 0%, transparent 55%)`,
          }}
        />
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
          <div
            className="relative flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-3xl text-2xl font-black md:h-28 md:w-[168px]"
            style={
              logoUrl
                ? undefined
                : {
                    background: `${brand.accent}1f`,
                    color: brand.accent,
                    boxShadow: `inset 0 0 0 1px ${brand.accent}55, 0 0 40px -8px ${brand.accent}80`,
                  }
            }
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={brand.nameKo}
                fill
                sizes="(min-width: 768px) 168px, 144px"
                priority
                className="object-contain p-3"
              />
            ) : (
              brand.logoText.slice(0, 4)
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{c(`country.${brand.country}`)}</Badge>
              <Badge variant="outline">
                {t("foundedIn", { year: String(brand.foundedYear) })}
              </Badge>
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              {brand.nameKo}
            </h1>
            <p className="mt-1 text-sm font-medium text-fg-subtle">
              {brand.name}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
              {brand.description}
            </p>
            <BrandLinks brand={brand} label={t("officialChannels")} />
          </div>
        </div>
      </section>

      {/* ── 스탯 타일 ── */}
      <section className="mt-6 grid grid-cols-3 gap-3">
        <StatTile value={c(`country.${brand.country}`)} label={t("countryLabel")} />
        <StatTile value={`${brand.foundedYear}`} label={t("founded")} />
        <StatTile
          value={`${brand.modelCount}${t("unit")}`}
          label={t("modelCount")}
        />
      </section>

      {/* ── 브랜드 스토리 ── */}
      <section className="mt-10">
        <SectionHeader title={t("story")} />
        <Card className="p-5 md:p-6">
          <div
            className="mb-4 h-1 w-12 rounded-full"
            style={{ background: brand.accent }}
          />
          <p className="text-sm leading-relaxed text-fg-muted md:text-base">
            {brand.description}
          </p>
        </Card>
      </section>

      {/* ── 이 브랜드의 모델 ── */}
      <section className="mt-10">
        <SectionHeader title={t("modelsInBrand")} />
        <p className="-mt-2 mb-4 text-xs text-fg-subtle">
          {t("modelsInBrandDesc")}
        </p>
        {brandModels.length === 0 ? (
          <EmptyState
            title={t("emptyModels")}
            hint={t("emptyModelsHint")}
            icon="🏍️"
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {brandModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        )}
      </section>

      <div className="h-8" />
    </div>
  );
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-4 text-center">
      <p className="truncate font-mono text-lg font-black text-neon md:text-xl">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-fg-subtle">{label}</p>
    </div>
  );
}

/** 브랜드 공식 채널 링크 — 값이 있는 것만 노출. */
function BrandLinks({
  brand,
  label,
}: {
  brand: { homepage?: string; blog?: string; instagram?: string; youtube?: string };
  label: string;
}) {
  const links = [
    { key: "homepage", icon: "🌐", name: "홈페이지", href: brand.homepage },
    { key: "blog", icon: "📝", name: "블로그", href: brand.blog },
    { key: "instagram", icon: "📷", name: "인스타그램", href: brand.instagram },
    { key: "youtube", icon: "▶️", name: "유튜브", href: brand.youtube },
  ].filter((l) => l.href && l.href.trim().length > 0);

  if (links.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="mb-2 text-[11px] font-medium text-fg-subtle">{label}</p>
      <div className="flex flex-wrap gap-2">
        {links.map((l) => (
          <a
            key={l.key}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-elevated px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:border-neon/50 hover:text-neon"
          >
            <span aria-hidden>{l.icon}</span>
            {l.name}
            <span aria-hidden className="text-[10px] text-fg-subtle">
              ↗
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
