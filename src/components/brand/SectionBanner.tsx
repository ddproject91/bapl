import Image from "next/image";
import { CheckeredStrip, BikeBlueprint } from "@/components/brand/BikeMotifs";
import { cn } from "@/lib/utils";

/**
 * 섹션 상단 히어로 배너 — 바이크 사진 배경 + 체커드 스트립 + 블루프린트 모티프.
 * 사진 위 다크 오버레이 + 화이트 텍스트(테마 무관 가독성).
 */
export function SectionBanner({
  title,
  subtitle,
  imageUrl,
  accentColor = "var(--neon)",
  stat,
  className,
}: {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  accentColor?: string;
  stat?: { value: string; label: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border",
        className,
      )}
    >
      {/* 배경 사진 */}
      {imageUrl && (
        <Image src={imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
      )}
      {/* 다크 그라디언트 오버레이 (사진 없으면 이 자체가 배경) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,9,11,0.92) 0%, rgba(8,9,11,0.72) 45%, rgba(8,9,11,0.35) 100%)",
        }}
      />
      {/* 네온 라인 */}
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ background: accentColor, opacity: 0.9 }}
      />
      {/* 블루프린트 모티프 */}
      <BikeBlueprint className="absolute -bottom-6 right-2 w-64 max-w-[45%] text-white opacity-[0.12]" />
      {/* 체커드 스트립 */}
      <CheckeredStrip
        className="absolute bottom-0 left-0 h-4 w-40 text-white/25"
        rows={2}
        cols={20}
      />

      <div className="relative flex min-h-[180px] flex-col justify-center gap-2 p-6 md:min-h-[220px] md:p-8">
        <span
          className="text-[11px] font-bold uppercase tracking-[0.2em]"
          style={{ color: accentColor }}
        >
          BAPL
        </span>
        <h1 className="text-2xl font-black tracking-tight text-white md:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="max-w-md text-sm text-white/70">{subtitle}</p>
        )}
        {stat && (
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className="font-mono text-3xl font-black"
              style={{ color: accentColor }}
            >
              {stat.value}
            </span>
            <span className="text-xs text-white/60">{stat.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
