import type { ContentKey } from "@/lib/content";

export interface CollectionMeta {
  key: ContentKey;
  label: string;
  group: string;
  /** 실제로 노출되는 공개 페이지 경로(있는 경우) — 어드민에서 "사이트에서 보기" 링크로 사용 */
  viewUrl?: string;
}

export const COLLECTIONS: CollectionMeta[] = [
  { key: "brands", label: "브랜드", group: "브랜드관", viewUrl: "/brands" },
  { key: "models", label: "모델", group: "모델관", viewUrl: "/models" },
  { key: "news", label: "뉴스", group: "뉴스", viewUrl: "/news" },
  { key: "community.boards", label: "게시판", group: "커뮤니티", viewUrl: "/community" },
  { key: "community.posts", label: "게시글", group: "커뮤니티", viewUrl: "/community" },
  { key: "community.comments", label: "댓글", group: "커뮤니티" },
  { key: "market.listings", label: "매물", group: "마켓", viewUrl: "/market" },
  {
    key: "market.groupbuyMeta",
    label: "공동구매 진행현황",
    group: "마켓",
    viewUrl: "/market/groupbuy",
  },
  { key: "market.auctionMeta", label: "경매 진행현황", group: "마켓", viewUrl: "/market/auction" },
  { key: "riding.meetups", label: "라이딩 모임", group: "라이딩", viewUrl: "/riding/meetups" },
  { key: "riding.courses", label: "라이딩 코스", group: "라이딩", viewUrl: "/riding/courses" },
  { key: "riding.events", label: "행사/대회", group: "라이딩", viewUrl: "/riding/events" },
  { key: "riding.places", label: "라이더 플레이스", group: "라이딩", viewUrl: "/riding/places" },
  { key: "riding.tourPackages", label: "투어 패키지", group: "라이딩", viewUrl: "/riding/tours" },
  {
    key: "garage.maintenanceGuides",
    label: "정비 매뉴얼",
    group: "정비/관리",
    viewUrl: "/garage/manuals",
  },
  {
    key: "garage.consumableCycles",
    label: "소모품 교체 주기",
    group: "정비/관리",
    viewUrl: "/garage/cycles",
  },
  { key: "garage.repairCosts", label: "정비 비용 정보", group: "정비/관리", viewUrl: "/garage/costs" },
  {
    key: "garage.diagnosisFlows",
    label: "고장 진단 가이드",
    group: "정비/관리",
    viewUrl: "/garage/diagnosis",
  },
  { key: "garage.faq", label: "정비 FAQ", group: "정비/관리", viewUrl: "/garage/faq" },
  { key: "garage.shopPreviews", label: "정비 업체", group: "정비/관리", viewUrl: "/garage/shops" },
  { key: "media.bikePhotos", label: "배경/배너 사진", group: "미디어", viewUrl: "/" },
  { key: "site.popupBanner", label: "팝업 배너", group: "사이트 설정", viewUrl: "/" },
  { key: "site.mainBanner", label: "메인 배너", group: "사이트 설정", viewUrl: "/" },
];

export function findCollection(key: string): CollectionMeta | undefined {
  return COLLECTIONS.find((c) => c.key === key);
}
