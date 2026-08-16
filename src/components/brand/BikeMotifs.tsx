import { cn } from "@/lib/utils";

/**
 * 바이크/모터스포츠 디자인 요소 (순수 SVG, currentColor 틴트).
 * 블루프린트 라인아트 무드 — 다크/라이트 테마 모두에서 데코로 사용.
 */

/** 측면 바이크 라인아트(블루프린트) */
export function BikeBlueprint({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 150"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* 바퀴 */}
      <circle cx="58" cy="108" r="34" />
      <circle cx="58" cy="108" r="7" />
      <circle cx="202" cy="108" r="34" />
      <circle cx="202" cy="108" r="7" />
      {/* 스포크 */}
      <path d="M58 108 58 76 M58 108 86 124 M58 108 30 124" opacity="0.6" />
      <path d="M202 108 202 76 M202 108 230 124 M202 108 174 124" opacity="0.6" />
      {/* 스윙암 / 배기 */}
      <path d="M58 108 118 98" />
      <path d="M120 100 176 108" opacity="0.7" />
      {/* 시트·탱크 상단 */}
      <path d="M74 90 108 74 150 72" />
      <path d="M108 74 C118 60 142 56 152 72" />
      {/* 엔진 블록 */}
      <path d="M104 98 150 98 150 74" opacity="0.85" />
      {/* 프론트 포크 */}
      <path d="M202 108 178 66" />
      {/* 핸들바 / 프론트 카울 */}
      <path d="M178 66 150 72 M178 66 196 58" />
    </svg>
  );
}

/** 스피드 스트릭 라인 */
export function SpeedLines({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      stroke="currentColor"
      strokeWidth={4}
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M8 16 H86" opacity="0.9" />
      <path d="M20 30 H104" opacity="0.6" />
      <path d="M4 44 H72" opacity="0.35" />
    </svg>
  );
}

/** 체커드 플래그 스트립 (레이싱 모티프) */
export function CheckeredStrip({
  className,
  rows = 2,
  cols = 16,
}: {
  className?: string;
  rows?: number;
  cols?: number;
}) {
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r + c) % 2 === 0) {
        cells.push(
          <rect
            key={`${r}-${c}`}
            x={c * (100 / cols)}
            y={r * (100 / rows)}
            width={100 / cols}
            height={100 / rows}
          />,
        );
      }
    }
  }
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      {cells}
    </svg>
  );
}

/** 육각 기어/피스톤 마크 */
export function GearMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M24 6 39.6 15 39.6 33 24 42 8.4 33 8.4 15Z" />
      <circle cx="24" cy="24" r="8" />
    </svg>
  );
}

/** 얇은 네온 구분선 (좌우로 페이드) */
export function NeonDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-px w-full", className)}
      style={{
        background:
          "linear-gradient(90deg, transparent, var(--neon), transparent)",
        opacity: 0.5,
      }}
      aria-hidden
    />
  );
}
