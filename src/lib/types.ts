/**
 * BAPL 도메인 타입 — Phase 0 목업용.
 * DB 스키마(CLAUDE.md)와 필드명을 정렬하여 Phase 1에서 Supabase 자동생성 타입으로
 * 매끄럽게 교체할 수 있도록 설계.
 */

// ─── 분류 축 ───────────────────────────────────────────────
export type BikeCategory =
  | "naked"
  | "sport"
  | "tourer"
  | "adventure"
  | "cruiser"
  | "scooter"
  | "classic";

export const BIKE_CATEGORIES: BikeCategory[] = [
  "naked",
  "sport",
  "tourer",
  "adventure",
  "cruiser",
  "scooter",
  "classic",
];

export type DisplacementClass =
  | "u125"
  | "126_250"
  | "251_400"
  | "401_700"
  | "701_1000"
  | "o1000";

export const DISPLACEMENT_CLASSES: DisplacementClass[] = [
  "u125",
  "126_250",
  "251_400",
  "401_700",
  "701_1000",
  "o1000",
];

export type Country = "DE" | "JP" | "IT" | "AT" | "US" | "GB" | "KR";

// ─── 브랜드 / 모델 ─────────────────────────────────────────
export interface Brand {
  id: string;
  name: string;
  nameKo: string;
  country: Country;
  logoText: string; // logoUrl 없을 때 폴백 텍스트 마크
  logoUrl?: string; // 브랜드 로고 이미지
  accent: string; // 브랜드 대표 컬러(HEX)
  description: string;
  foundedYear: number;
  modelCount: number;
  // 공식 채널 링크 (비어 있으면 노출 안 함)
  homepage?: string;
  blog?: string;
  instagram?: string;
  youtube?: string;
}

export interface Electronics {
  ridingModes?: string;
  tractionControl?: boolean;
  abs?: "standard" | "cornering" | "none";
  quickshifter?: boolean;
  cruise?: boolean;
  tft?: boolean;
}

export interface ModelSpec {
  // 엔진
  engineType: string;
  engineCc: number;
  powerHp: number;
  powerRpm: number;
  torqueNm: number;
  torqueRpm: number;
  cooling: string;
  // 차체
  frameType: string;
  lengthMm?: number;
  widthMm?: number;
  heightMm?: number;
  wheelbaseMm: number;
  seatHeightMm: number;
  weightDryKg?: number;
  weightWetKg?: number;
  // 주행
  fuelCapacityL: number;
  fuelEconomy?: number; // km/L 공인연비
  suspensionFront: string;
  suspensionRear: string;
  brakeFront: string;
  brakeRear: string;
  tireFront: string;
  tireRear: string;
  // 전자장비
  electronics: Electronics;
  // 기타
  insuranceClass?: string;
}

export interface ModelYear {
  year: number;
  priceKrw: number; // 국내 출시가
  changes?: string;
}

export interface Colorway {
  name: string;
  hex: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1~5
  ownershipPeriod?: string;
  content: string;
  createdAt: string;
  isEditorial?: boolean; // 에디토리얼 시승기
}

export interface PricePoint {
  year: number;
  soldPriceManwon: number; // 판매완료 시세(만원)
  mileageKm: number;
}

export interface Model {
  id: string;
  imageUrl?: string; // 모델 대표(누끼) 이미지. 없으면 그래픽 폴백.
  brandId: string;
  name: string;
  nameKo: string;
  category: BikeCategory;
  displacementClass: DisplacementClass;
  tagline: string;
  heroColor: string; // 히어로 카드 그라디언트 베이스
  spec: ModelSpec;
  years: ModelYear[];
  colorways: Colorway[];
  reviews: Review[];
  ratingAvg: number;
  ratingCount: number;
  // 탭 콘텐츠(목업)
  maintenance: string[]; // 정비 포인트/고질병
  tuning: string[]; // 튜닝 사례
  faq: { q: string; a: string }[];
  gallery: number; // 갤러리 사진 수(목업)
  priceHistory: PricePoint[];
  isPopular?: boolean;
  isNew?: boolean;
}

// ─── 뉴스 ──────────────────────────────────────────────────
export type NewsCategory = "law" | "newbike" | "recall" | "industry" | "blog";

export interface NewsItem {
  id: string;
  category: NewsCategory;
  title: string;
  summary: string;
  content: string;
  brandId?: string;
  modelId?: string;
  source: string;
  publishedAt: string;
  imageUrl?: string; // 카드 뉴스 썸네일. 없으면 카테고리 아이콘으로 폴백
}

// ─── 커뮤니티 ──────────────────────────────────────────────
export type BoardType =
  | "free"
  | "accident"
  | "qna"
  | "diy"
  | "tuning"
  | "tour"
  | "notice";

export interface Board {
  slug: string;
  name: string;
  type: BoardType;
  description: string;
  icon: string;
}

export interface Post {
  id: string;
  boardSlug: string;
  author: string;
  authorVerified?: boolean;
  title: string;
  excerpt: string;
  content: string;
  hasVideo?: boolean;
  isAcceptedAnswer?: boolean; // qna 채택됨
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  isNotice?: boolean;
}

// ─── 마켓 ──────────────────────────────────────────────────
export type ListingCategory =
  | "bike"
  | "gear"
  | "apparel"
  | "parts"
  | "dealer"
  | "groupbuy"
  | "auction";
export type ListingStatus = "active" | "reserved" | "sold";
export type VerifySlot =
  | "front"
  | "rear"
  | "left"
  | "right"
  | "dash"
  | "vin"
  | "docs";

export const REQUIRED_SLOTS: VerifySlot[] = [
  "front",
  "rear",
  "left",
  "right",
  "dash",
  "vin",
  "docs",
];

export interface Listing {
  id: string;
  category: ListingCategory;
  modelId?: string;
  title: string;
  priceManwon: number;
  year?: number;
  mileageKm?: number;
  region: string;
  status: ListingStatus;
  isVerified: boolean; // BAPL 인증
  filledSlots?: VerifySlot[];
  seller: string;
  sellerScore?: number; // 매너 점수
  isVendor?: boolean; // 입점 업체
  brandName?: string; // 입점 신품 브랜드
  createdAt: string;
  thumbColor: string;
  bookmarkCount: number;
}

// ─── 라이딩 ────────────────────────────────────────────────
export interface Meetup {
  id: string;
  type: "region" | "model";
  title: string;
  region: string;
  modelId?: string;
  host: string;
  meetAt: string;
  capacity: number;
  joined: number;
  description: string;
}

export interface Course {
  id: string;
  title: string;
  author: string;
  region: string;
  distanceKm: number;
  difficulty: "easy" | "medium" | "hard";
  roadCondition: string;
  rating: number;
  reviewCount: number;
  description: string;
  isBest?: boolean;
}

export interface RidingEvent {
  id: string;
  type: "festival" | "race";
  title: string;
  startsAt: string;
  location: string;
  description: string;
}

export interface Place {
  id: string;
  category: "food" | "cafe" | "wash";
  name: string;
  region: string;
  rating: number;
  bikeParking: boolean;
  isSponsored: boolean; // 입점
  description: string;
  imageUrl?: string; // 대표 썸네일. 없으면 카테고리 아이콘으로 폴백
}

export interface TourPackage {
  id: string;
  partner: string;
  title: string;
  priceFromManwon: number;
  description: string;
}

// ─── 정비/관리 ─────────────────────────────────────────────
export interface MaintenanceGuide {
  id: string;
  task: string;
  modelName?: string;
  difficulty: "easy" | "medium" | "hard";
  summary: string;
}

export interface ConsumableCycle {
  item: string;
  itemKo: string;
  intervalKm: number;
  intervalMonths: number;
  note: string;
}

export interface RepairCost {
  task: string;
  modelName?: string;
  costManwon: number;
  region: string;
}

export interface DiagnosisFlow {
  id: string;
  symptom: string;
  causes: { cause: string; action: string }[];
}

// ─── 마이페이지 ────────────────────────────────────────────
export interface UserBike {
  id: string;
  modelId: string;
  nickname: string;
  odometerKm: number;
  purchasedAt: string;
}

export interface Notification {
  id: string;
  type: "comment" | "like" | "chat" | "consumable" | "notice";
  message: string;
  createdAt: string;
  read: boolean;
}

// ─── FAQ (공통) ────────────────────────────────────────────
export interface Faq {
  q: string;
  a: string;
}
