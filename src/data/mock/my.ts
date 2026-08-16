import type { Notification, UserBike } from "@/lib/types";

/**
 * Phase 0 목업 — 마이페이지 데이터.
 * modelId는 models.ts의 실제 id를 사용. 내용은 창작(실존 인물/타 커뮤니티 복붙 없음).
 * Phase 1에서 user_bikes / notifications / point_logs 등 테이블로 교체될 자리.
 */

// ─── 내 바이크 ──────────────────────────────────────────────
export const userBikes: UserBike[] = [
  {
    id: "ub1",
    modelId: "yamaha-mt09",
    nickname: "애마",
    odometerKm: 18420,
    purchasedAt: "2024-03-15",
  },
  {
    id: "ub2",
    modelId: "ktm-390duke",
    nickname: "연습용 세컨드",
    odometerKm: 7250,
    purchasedAt: "2025-08-02",
  },
];

// ─── 알림 ──────────────────────────────────────────────────
export const notifications: Notification[] = [
  {
    id: "nt1",
    type: "comment",
    message: "회원님의 글 '첫 미들급 고민'에 새 댓글이 달렸습니다.",
    createdAt: "2026-07-04T09:12:00",
    read: false,
  },
  {
    id: "nt2",
    type: "consumable",
    message: "MT-09 체인 급유 주기가 다가옵니다. (주행거리 18,420km)",
    createdAt: "2026-07-03T18:40:00",
    read: false,
  },
  {
    id: "nt3",
    type: "like",
    message: "'와인딩 코스 추천' 글이 좋아요 12개를 받았습니다.",
    createdAt: "2026-07-02T21:05:00",
    read: false,
  },
  {
    id: "nt4",
    type: "chat",
    message: "판매자 '라이더샵'님이 매물 문의에 답장했습니다.",
    createdAt: "2026-07-01T13:22:00",
    read: true,
  },
  {
    id: "nt5",
    type: "notice",
    message: "[공지] 여름철 라이딩 안전 캠페인 이벤트가 시작되었습니다.",
    createdAt: "2026-06-29T10:00:00",
    read: true,
  },
  {
    id: "nt6",
    type: "consumable",
    message: "390 듀크 엔진오일 교체 권장 시점입니다. (주행거리 7,250km)",
    createdAt: "2026-06-27T08:15:00",
    read: true,
  },
];

// ─── 내 게시글 ─────────────────────────────────────────────
export interface MyPost {
  id: string;
  boardSlug: string;
  boardName: string;
  title: string;
  createdAt: string;
  commentCount: number;
  likeCount: number;
}

export const myPosts: MyPost[] = [
  {
    id: "p1",
    boardSlug: "qna",
    boardName: "질문/지식인",
    title: "첫 미들급, MT-09와 Z900 사이에서 고민입니다",
    createdAt: "2026-06-30",
    commentCount: 14,
    likeCount: 8,
  },
  {
    id: "p2",
    boardSlug: "tour",
    boardName: "투어/여행",
    title: "강원도 와인딩 코스 추천 — 초보도 무난한 루트",
    createdAt: "2026-06-21",
    commentCount: 6,
    likeCount: 12,
  },
  {
    id: "p3",
    boardSlug: "diy",
    boardName: "정비/DIY",
    title: "체인 셀프 급유 후기 (사진 첨부)",
    createdAt: "2026-06-10",
    commentCount: 3,
    likeCount: 5,
  },
];

// ─── 내 댓글 ───────────────────────────────────────────────
export interface MyComment {
  id: string;
  postTitle: string;
  excerpt: string;
  createdAt: string;
}

export const myComments: MyComment[] = [
  {
    id: "c1",
    postTitle: "2종소형 실기 팁 공유",
    excerpt: "저도 저상 코스에서 많이 넘어졌는데 반클러치 감을 잡으니 확실히 편해졌어요.",
    createdAt: "2026-07-02",
  },
  {
    id: "c2",
    postTitle: "여름 메쉬 자켓 추천 부탁드립니다",
    excerpt: "통풍 좋은 제품으로 3년째 잘 입고 있습니다. 방수는 기대하지 마세요.",
    createdAt: "2026-06-25",
  },
  {
    id: "c3",
    postTitle: "브이스트롬 650 장거리 후기",
    excerpt: "연비 정말 좋죠. 20L 탱크라 급유 스트레스가 거의 없습니다.",
    createdAt: "2026-06-18",
  },
];

// ─── 찜한 매물 ─────────────────────────────────────────────
export interface BookmarkedListing {
  id: string;
  title: string;
  priceManwon: number;
  region: string;
  status: "active" | "reserved" | "sold";
  isVerified: boolean;
}

export const bookmarkedListingTitles: BookmarkedListing[] = [
  {
    id: "bk1",
    title: "야마하 MT-09 2022 무사고 풀튜닝",
    priceManwon: 1050,
    region: "서울 강남",
    status: "active",
    isVerified: true,
  },
  {
    id: "bk2",
    title: "KTM 390 듀크 2023 저주행 급매",
    priceManwon: 560,
    region: "경기 성남",
    status: "reserved",
    isVerified: true,
  },
  {
    id: "bk3",
    title: "혼다 CB650R 2022 순정 상태 최상",
    priceManwon: 890,
    region: "부산 해운대",
    status: "active",
    isVerified: false,
  },
  {
    id: "bk4",
    title: "가와사키 Z900 2021 튜닝 다수",
    priceManwon: 830,
    region: "인천 남동",
    status: "sold",
    isVerified: false,
  },
];

// ─── 포인트 로그 ───────────────────────────────────────────
export interface PointLog {
  id: string;
  action: "post" | "comment" | "checkin" | "verify" | "review";
  points: number;
  createdAt: string;
}

export const pointLogs: PointLog[] = [
  { id: "pl1", action: "checkin", points: 10, createdAt: "2026-07-04" },
  { id: "pl2", action: "post", points: 30, createdAt: "2026-06-30" },
  { id: "pl3", action: "comment", points: 5, createdAt: "2026-07-02" },
  { id: "pl4", action: "review", points: 20, createdAt: "2026-06-24" },
  { id: "pl5", action: "verify", points: 100, createdAt: "2026-05-10" },
];

// ─── 랭킹 ──────────────────────────────────────────────────
export interface RankingEntry {
  rank: number;
  nickname: string;
  points: number;
  isMe?: boolean;
}

export const weeklyRanking: RankingEntry[] = [
  { rank: 1, nickname: "슈퍼모토킹", points: 3120 },
  { rank: 2, nickname: "와인딩장인", points: 2680 },
  { rank: 3, nickname: "직사매니아", points: 2140 },
  { rank: 4, nickname: "데모라이더", points: 1240, isMe: true },
  { rank: 5, nickname: "출근길라이더", points: 1080 },
];

// ─── 활동 요약 ─────────────────────────────────────────────
export const activityStats = {
  rank: 4,
  weeklyRank: 4,
  postCount: myPosts.length,
  commentCount: myComments.length,
  likeReceived: 25,
  checkinStreak: 7,
};

// ─── 헬퍼 ──────────────────────────────────────────────────
export function getUnreadNotificationCount(): number {
  return notifications.filter((n) => !n.read).length;
}

/** 라이딩 입문 연도(목업) — 프로필 경력 표시용. */
export const RIDING_SINCE_YEAR = 2021;
