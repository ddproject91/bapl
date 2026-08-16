import { getTranslations } from "next-intl/server";
import type { VerifySlot } from "@/lib/types";
import { REQUIRED_SLOTS } from "@/lib/types";
import { BikeThumb } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/**
 * 필수 인증 사진 슬롯 표시(7종: 전면/후면/좌측면/우측면/계기반/차대번호/키·서류).
 * SlotChips — 카드용 컴팩트 표시. SlotGallery — 상세 페이지용 갤러리 그리드.
 */

export async function SlotChips({ filled }: { filled?: VerifySlot[] }) {
  const t = await getTranslations("market");
  const set = new Set(filled ?? []);
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1">
      <span className="mr-1 text-[10px] font-medium text-fg-subtle">
        {t("slot.filled", { count: set.size, total: REQUIRED_SLOTS.length })}
      </span>
      {REQUIRED_SLOTS.map((slot) => {
        const on = set.has(slot);
        return (
          <span
            key={slot}
            title={t(`slot.${slot}`)}
            className={cn(
              "inline-flex h-4 w-4 items-center justify-center rounded-[4px] text-[9px] font-bold",
              on
                ? "bg-neon/20 text-neon ring-1 ring-neon/40"
                : "bg-bg-elevated text-fg-subtle",
            )}
          >
            {on ? "✓" : "·"}
          </span>
        );
      })}
    </div>
  );
}

export async function SlotGallery({
  color,
  filled,
}: {
  color: string;
  filled?: VerifySlot[];
}) {
  const t = await getTranslations("market");
  const set = new Set(filled ?? []);
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {REQUIRED_SLOTS.map((slot) => {
        const on = set.has(slot);
        return (
          <div key={slot} className="relative">
            <BikeThumb color={color} ratio="aspect-[4/3]" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 rounded-b-xl bg-bg/70 px-2 py-1 backdrop-blur">
              <span className="text-[11px] font-bold">{t(`slot.${slot}`)}</span>
              <span
                className={cn(
                  "inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold",
                  on ? "bg-neon text-black" : "bg-fg-subtle/30 text-fg-subtle",
                )}
              >
                {on ? "✓" : "·"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
