import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Model } from "@/lib/types";
import { getBrand } from "@/data/mock/brands";
import { Card, BikeThumb, RatingStars } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { formatManwon } from "@/lib/utils";

export async function ModelCard({
  model,
  className,
}: {
  model: Model;
  className?: string;
}) {
  const t = await getTranslations("common");
  const brand = await getBrand(model.brandId);
  const priceKrw = model.years[model.years.length - 1]?.priceKrw ?? 0;

  return (
    <Card as="article" hover className={className}>
      <Link href={`/models/${model.id}`} className="block p-3">
        <div className="relative">
          <BikeThumb
            color={model.heroColor}
            src={model.imageUrl}
            alt={model.nameKo}
          />
          <div className="absolute left-2 top-2 flex gap-1">
            {model.isNew && <Badge variant="neon">{t("badge.new")}</Badge>}
            {model.isPopular && <Badge variant="neon">{t("badge.hot")}</Badge>}
          </div>
        </div>
        <div className="mt-3">
          <p className="text-[11px] font-medium text-fg-subtle">
            {brand?.nameKo} · {t(`cat.${model.category}`)}
          </p>
          <h3 className="mt-0.5 truncate text-sm font-bold">{model.nameKo}</h3>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-fg-muted">
            {model.tagline}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <RatingStars rating={model.ratingAvg} count={model.ratingCount} />
            <span className="font-mono text-xs font-bold text-neon">
              {formatManwon(Math.round(priceKrw / 10000))}
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
