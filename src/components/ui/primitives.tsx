import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 페이지 상단 타이틀 블록 */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-border pb-5">
      <div>
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-fg-muted">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** 섹션 헤더 (홈/목록의 소제목 + 전체보기) */
export function SectionHeader({
  title,
  href,
  moreLabel,
  accent,
}: {
  title: string;
  href?: string;
  moreLabel?: string;
  accent?: boolean;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2
        className={cn(
          "text-lg font-bold tracking-tight md:text-xl",
          accent && "text-neon",
        )}
      >
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-xs font-medium text-fg-muted transition-colors hover:text-neon"
        >
          {moreLabel ?? "전체 보기"} →
        </Link>
      )}
    </div>
  );
}

/** 기본 카드 컨테이너 */
export function Card({
  children,
  className,
  hover = false,
  as,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "article" | "li";
}) {
  const Comp = as ?? "div";
  return (
    <Comp
      className={cn(
        "rounded-2xl border border-border bg-bg-card",
        hover &&
          "transition-all duration-200 hover:border-neon/40 hover:shadow-[0_0_0_1px_var(--neon-glow)]",
        className,
      )}
    >
      {children}
    </Comp>
  );
}

/** 별점 표시 */
export function RatingStars({
  rating,
  count,
  size = "sm",
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const full = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className={cn(
          "text-neon tracking-tight",
          size === "sm" ? "text-xs" : "text-sm",
        )}
        aria-hidden
      >
        {"★".repeat(full)}
        <span className="text-fg-subtle">{"★".repeat(5 - full)}</span>
      </span>
      <span
        className={cn(
          "font-mono font-medium",
          size === "sm" ? "text-xs" : "text-sm",
        )}
      >
        {rating.toFixed(1)}
      </span>
      {count != null && (
        <span className="text-xs text-fg-subtle">({count})</span>
      )}
    </span>
  );
}

/**
 * 바이크/이미지 플레이스홀더 — Phase 0엔 실제 누끼 이미지가 없으므로
 * 브랜드/모델 대표색 그라디언트 + 실루엣 느낌으로 대체.
 */
export function BikeThumb({
  color,
  label,
  className,
  ratio = "aspect-[4/3]",
  src,
  alt,
}: {
  color: string;
  label?: string;
  className?: string;
  ratio?: string;
  /** 모델 누끼 이미지 URL. 있으면 사진 표시, 없으면 그래픽 폴백. */
  src?: string;
  alt?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-xl",
        ratio,
        className,
      )}
      style={{
        background: `radial-gradient(120% 120% at 20% 0%, ${color}2e 0%, transparent 55%), linear-gradient(135deg, #eef0f3 0%, #e2e5ea 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(60% 50% at 80% 100%, ${color}26 0%, transparent 70%)`,
        }}
      />
      {src ? (
        // 실제 모델 사진 — 타일을 꽉 채워 이미지 카드처럼 표시.
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw"
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="relative text-4xl opacity-70 md:text-5xl"
          style={{ filter: `drop-shadow(0 0 12px ${color}66)` }}
        >
          🏍️
        </span>
      )}
      {label && (
        <span className="absolute bottom-2 left-3 text-[11px] font-medium text-fg-subtle">
          {label}
        </span>
      )}
    </div>
  );
}

/** 빈 상태 */
export function EmptyState({
  title,
  hint,
  icon = "🗂️",
}: {
  title: string;
  hint?: string;
  icon?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
      <span className="mb-3 text-3xl opacity-60">{icon}</span>
      <p className="text-sm font-medium text-fg-muted">{title}</p>
      {hint && <p className="mt-1 text-xs text-fg-subtle">{hint}</p>}
    </div>
  );
}

/** [입점]/[제휴] 준비중 오버레이 카드 */
export function ComingSoonCard({
  title,
  description,
  tag,
}: {
  title: string;
  description?: string;
  tag?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-border-strong bg-bg-elevated p-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-full bg-fg-subtle/15 px-2 py-0.5 text-[11px] font-medium text-fg-subtle">
          준비중
        </span>
        {tag && (
          <span className="text-[11px] font-medium text-fg-subtle">{tag}</span>
        )}
      </div>
      <h3 className="text-base font-bold">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-fg-muted">{description}</p>
      )}
    </div>
  );
}

/** 얇은 pill 링크(칩) */
export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-neon bg-neon/15 text-neon"
          : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
