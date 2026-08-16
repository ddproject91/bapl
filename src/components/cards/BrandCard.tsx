import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Brand } from "@/lib/types";
import { Card } from "@/components/ui/primitives";

export async function BrandCard({ brand }: { brand: Brand }) {
  const t = await getTranslations("common");
  const logoUrl = brand.logoUrl;
  return (
    <Card as="article" hover>
      <Link
        href={`/brands/${brand.id}`}
        className="flex flex-col items-center gap-2 p-4 text-center"
      >
        <div
          className="relative flex aspect-[3/2] w-full max-w-[96px] items-center justify-center overflow-hidden rounded-2xl text-lg font-black"
          style={
            logoUrl
              ? undefined
              : {
                  background: `${brand.accent}1f`,
                  color: brand.accent,
                  boxShadow: `inset 0 0 0 1px ${brand.accent}44`,
                }
          }
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={brand.nameKo}
              fill
              sizes="96px"
              className="object-contain p-1.5"
            />
          ) : (
            brand.logoText.slice(0, 3)
          )}
        </div>
        <div>
          <p className="text-sm font-bold">{brand.nameKo}</p>
          <p className="text-[11px] text-fg-subtle">
            {t(`country.${brand.country}`)} · {brand.modelCount}
            {t("nav.models").slice(0, 2)}
          </p>
        </div>
      </Link>
    </Card>
  );
}
