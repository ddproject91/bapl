import type { NewsCategory } from "@/lib/types";

/**
 * 뉴스 카테고리 → Badge variant 매핑.
 * 서버/클라이언트 양쪽에서 import하므로 "use client" 없는 순수 모듈로 분리.
 */
export function categoryVariant(
  category: NewsCategory,
): "warning" | "danger" | "neon" | "outline" {
  if (category === "law") return "warning";
  if (category === "recall") return "danger";
  if (category === "newbike") return "neon";
  return "outline";
}
