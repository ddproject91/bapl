/** 전역 네비게이션 정의 — 서버/클라이언트 양쪽에서 import 가능하도록 별도 모듈로 분리. */
export const NAV_ITEMS = [
  { key: "brands", href: "/brands" },
  { key: "models", href: "/models" },
  { key: "community", href: "/community" },
  { key: "riding", href: "/riding" },
  { key: "market", href: "/market" },
  { key: "garage", href: "/garage" },
  { key: "news", href: "/news" },
] as const;
