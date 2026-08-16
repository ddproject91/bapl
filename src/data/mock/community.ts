import type { Board, Post } from "@/lib/types";
import { getContent } from "@/lib/content";
import { getSupabaseAdmin } from "@/lib/supabase";
import { boardsFallback, postsFallback } from "./community-data";

/**
 * Phase 0 목업 — 커뮤니티(Supabase 미설정 시 폴백).
 * 게시판/글 순수 데이터는 community-data.ts로 분리(클라이언트 컴포넌트에서도 import 가능하게).
 * 이 파일은 서버 전용 조회 함수(mock + 실제 회원 글 병합)를 담당한다.
 */
export { boardsFallback, postsFallback };

// ─── 댓글 ──────────────────────────────────────────────────
export interface CommunityComment {
  id: string;
  postId: string;
  author: string;
  authorId?: string; // 실제 회원 댓글일 때만 존재 — 본인 댓글 수정/삭제 권한 판별용
  authorVerified?: boolean;
  content: string;
  createdAt: string;
  likeCount: number;
  isAccepted?: boolean; // qna 채택 답변
}

export const commentsFallback: CommunityComment[] = [
  // free-2 첫 출고 축하
  {
    id: "cm-1",
    postId: "c-free-2",
    author: "10년째라이딩",
    authorVerified: true,
    content:
      "출고 축하드립니다! 처음엔 저속 밸런스가 제일 어려운데 넓은 공터에서 8자 연습 많이 하세요. 금방 늡니다.",
    createdAt: "2026-06-25",
    likeCount: 34,
  },
  {
    id: "cm-2",
    postId: "c-free-2",
    author: "월급도둑라이더",
    content: "조언 감사합니다! 이번 주말에 공터 나가서 연습해볼게요.",
    createdAt: "2026-06-25",
    likeCount: 5,
  },
  {
    id: "cm-3",
    postId: "c-free-2",
    author: "안전장비필수",
    content: "장비는 아끼지 마세요. 특히 헬멧이랑 장갑은 꼭 좋은 걸로!",
    createdAt: "2026-06-26",
    likeCount: 18,
  },

  // accident-1 후방 추돌 과실
  {
    id: "cm-4",
    postId: "c-accident-1",
    author: "방어운전코치",
    authorVerified: true,
    content:
      "정지 상태에서의 후방 추돌은 일반적으로 뒤차 과실이 크게 인정되는 편입니다. 다만 구체적 비율은 상황·자료에 따라 달라지니 블랙박스 원본을 잘 보관하시고 필요 시 전문가 상담을 받아보세요.",
    createdAt: "2026-06-26",
    likeCount: 41,
  },
  {
    id: "cm-5",
    postId: "c-accident-1",
    author: "경험담공유",
    content:
      "저도 비슷한 일 겪었는데 병원 진료 기록 꼭 남겨두세요. 당장 안 아파도 나중에 증상 나올 수 있어요.",
    createdAt: "2026-06-27",
    likeCount: 22,
  },

  // qna-1 첫차 미들급 (채택)
  {
    id: "cm-6",
    postId: "c-qna-1",
    author: "미들급오너",
    authorVerified: true,
    isAccepted: true,
    content:
      "충분히 가능합니다. 다만 출력에 압도되지 않게 초반엔 라이딩 모드를 낮게 두고, 저속 밸런스와 급제동 연습을 충분히 하세요. 체격보단 습관이 안전을 좌우합니다. 안전 장비는 필수고요!",
    createdAt: "2026-06-24",
    likeCount: 56,
  },
  {
    id: "cm-7",
    postId: "c-qna-1",
    author: "신중파",
    content:
      "무리는 아니지만 첫 한 달은 정말 조심하세요. 익숙해지기 전까진 무게가 부담스러울 수 있어요.",
    createdAt: "2026-06-24",
    likeCount: 12,
  },

  // qna-2 체인 관리 (채택)
  {
    id: "cm-8",
    postId: "c-qna-2",
    author: "정비고수",
    authorVerified: true,
    isAccepted: true,
    content:
      "보통 500~800km 주기로 청소·윤활을 권장하지만, 주행 환경에 따라 조절하세요. 우천 주행 후엔 물기와 이물질을 닦고 다시 윤활해주는 게 체인 수명에 좋습니다. 방치가 제일 안 좋아요.",
    createdAt: "2026-06-21",
    likeCount: 38,
  },

  // diy-1 엔진오일 셀프
  {
    id: "cm-9",
    postId: "c-diy-1",
    author: "폐유주의",
    content:
      "정리 감사합니다! 폐유 처리 강조하신 부분 정말 중요해요. 하수구에 버리면 절대 안 됩니다.",
    createdAt: "2026-06-26",
    likeCount: 27,
  },
  {
    id: "cm-10",
    postId: "c-diy-1",
    author: "토크렌치필수",
    authorVerified: true,
    content:
      "드레인 볼트는 꼭 규정 토크로! 과조임하면 오일팬 나사산 나갑니다. 경험에서 우러난 조언입니다ㅠ",
    createdAt: "2026-06-27",
    likeCount: 19,
  },

  // tour-1 동해안
  {
    id: "cm-11",
    postId: "c-tour-1",
    author: "바다보러가자",
    content: "사진만 봐도 힐링되네요. 다음 주말에 저도 다녀와야겠어요!",
    createdAt: "2026-06-24",
    likeCount: 15,
  },
  {
    id: "cm-12",
    postId: "c-tour-1",
    author: "동해안러너",
    authorVerified: true,
    content: "이른 아침에 출발하시면 정말 한적해요. 안전 라이딩 하세요!",
    createdAt: "2026-06-24",
    likeCount: 8,
  },

  // tuning-1 슬립온
  {
    id: "cm-13",
    postId: "c-tuning-1",
    author: "사운드러버",
    content: "인증 제품 강조하신 부분 좋네요. 소음 기준 지키는 게 서로를 위한 배려죠.",
    createdAt: "2026-06-25",
    likeCount: 21,
  },
];

// ─── 헬퍼 ──────────────────────────────────────────────────
export async function getBoards(): Promise<Board[]> {
  return getContent("community.boards", boardsFallback);
}

/** 실제 회원이 작성한 글(Supabase posts 테이블) — 목업 site_content 글과 별도로 관리. */
async function getRealPosts(): Promise<Post[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data: rows } = await supabase
    .from("posts")
    .select("id, board_slug, author_id, title, content, image_urls, view_count, created_at")
    .order("created_at", { ascending: false });
  if (!rows || rows.length === 0) return [];

  const postIds = rows.map((r) => r.id);
  const authorIds = Array.from(new Set(rows.map((r) => r.author_id)));

  const [{ data: profiles }, { data: comments }, { data: likes }] = await Promise.all([
    supabase.from("profiles").select("id, nickname, is_rider_verified").in("id", authorIds),
    supabase.from("comments").select("post_id").in("post_id", postIds),
    supabase.from("likes").select("target_id").eq("target_type", "post").in("target_id", postIds),
  ]);

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
  const commentCountById = new Map<string, number>();
  (comments ?? []).forEach((c) =>
    commentCountById.set(c.post_id, (commentCountById.get(c.post_id) ?? 0) + 1),
  );
  const likeCountById = new Map<string, number>();
  (likes ?? []).forEach((l) =>
    likeCountById.set(l.target_id, (likeCountById.get(l.target_id) ?? 0) + 1),
  );

  return rows.map((r) => {
    const profile = profileById.get(r.author_id);
    return {
      id: r.id,
      boardSlug: r.board_slug,
      author: profile?.nickname ?? "라이더",
      authorId: r.author_id,
      authorVerified: profile?.is_rider_verified ?? false,
      title: r.title,
      excerpt: r.content.slice(0, 80),
      content: r.content,
      imageUrls: r.image_urls ?? [],
      viewCount: r.view_count ?? 0,
      likeCount: likeCountById.get(r.id) ?? 0,
      commentCount: commentCountById.get(r.id) ?? 0,
      createdAt: r.created_at.slice(0, 10),
    } satisfies Post;
  });
}

/** 실제 회원이 작성한 댓글(Supabase comments 테이블). */
async function getRealComments(): Promise<CommunityComment[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data: rows } = await supabase
    .from("comments")
    .select("id, post_id, author_id, content, created_at")
    .order("created_at", { ascending: true });
  if (!rows || rows.length === 0) return [];

  const authorIds = Array.from(new Set(rows.map((r) => r.author_id)));
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, nickname, is_rider_verified")
    .in("id", authorIds);
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  return rows.map((r) => {
    const profile = profileById.get(r.author_id);
    return {
      id: r.id,
      postId: r.post_id,
      author: profile?.nickname ?? "라이더",
      authorId: r.author_id,
      authorVerified: profile?.is_rider_verified ?? false,
      content: r.content,
      createdAt: r.created_at.slice(0, 10),
      likeCount: 0,
    } satisfies CommunityComment;
  });
}

export async function getPosts(): Promise<Post[]> {
  const [mock, real] = await Promise.all([
    getContent("community.posts", postsFallback),
    getRealPosts(),
  ]);
  return [...real, ...mock];
}

export async function getComments(): Promise<CommunityComment[]> {
  const [mock, real] = await Promise.all([
    getContent("community.comments", commentsFallback),
    getRealComments(),
  ]);
  return [...mock, ...real];
}

export async function getBoard(slug: string): Promise<Board | undefined> {
  const boards = await getBoards();
  return boards.find((b) => b.slug === slug);
}

export async function getPost(id: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((p) => p.id === id);
}

export async function getPostsByBoard(slug: string): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((p) => p.boardSlug === slug);
}

export async function getCommentsByPost(postId: string): Promise<CommunityComment[]> {
  const comments = await getComments();
  return comments.filter((c) => c.postId === postId);
}

/** 게시판별 글 수 */
export async function getPostCount(slug: string): Promise<number> {
  const posts = await getPosts();
  return posts.filter((p) => p.boardSlug === slug).length;
}

/** 실제 회원 글의 조회수를 원자적으로 1 증가시킨다. 목업 글은 대상이 아니다. */
export async function incrementPostViewCount(postId: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  await supabase.rpc("increment_post_view_count", { post_id: postId });
}
