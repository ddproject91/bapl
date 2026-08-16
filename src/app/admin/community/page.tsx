import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { CommunityModerator, type PostRow, type CommentRow, type ReportRow } from "./CommunityModerator";

export default async function AdminCommunityPage() {
  const supabase = getSupabaseAdmin();
  const configured = Boolean(supabase);

  let posts: PostRow[] = [];
  let comments: CommentRow[] = [];
  let reports: ReportRow[] = [];

  if (supabase) {
    const [{ data: postRows }, { data: commentRows }, { data: reportRows }] = await Promise.all([
      supabase
        .from("posts")
        .select("id, board_slug, author_id, title, content, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("comments")
        .select("id, post_id, author_id, content, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("reports")
        .select("id, reporter_id, target_type, target_id, reason, status, created_at")
        .order("created_at", { ascending: false }),
    ]);

    const authorIds = Array.from(
      new Set([
        ...(postRows ?? []).map((r) => r.author_id),
        ...(commentRows ?? []).map((r) => r.author_id),
        ...(reportRows ?? []).map((r) => r.reporter_id),
      ]),
    );
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, nickname")
      .in("id", authorIds.length > 0 ? authorIds : [""]);
    const nicknameById = new Map((profiles ?? []).map((p) => [p.id, p.nickname]));

    posts = (postRows ?? []).map((r) => ({
      id: r.id,
      boardSlug: r.board_slug,
      title: r.title,
      content: r.content,
      authorNickname: nicknameById.get(r.author_id) ?? "탈퇴/알수없음",
      createdAt: r.created_at,
    }));
    comments = (commentRows ?? []).map((r) => ({
      id: r.id,
      postId: r.post_id,
      content: r.content,
      authorNickname: nicknameById.get(r.author_id) ?? "탈퇴/알수없음",
      createdAt: r.created_at,
    }));
    reports = (reportRows ?? []).map((r) => ({
      id: r.id,
      reporterNickname: nicknameById.get(r.reporter_id) ?? "탈퇴/알수없음",
      targetType: r.target_type,
      targetId: r.target_id,
      reason: r.reason,
      status: r.status,
      createdAt: r.created_at,
    }));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/admin"
        className="mb-4 inline-block text-xs font-medium text-fg-muted hover:text-neon"
      >
        ← 전체 컬렉션
      </Link>
      <h1 className="mb-1 text-xl font-black tracking-tight">커뮤니티 관리</h1>
      <p className="mb-6 text-sm text-fg-muted">
        실제 회원이 작성한 게시글·댓글을 삭제하고, 접수된 신고를 처리하세요.
      </p>

      {!configured && (
        <div className="mb-6 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-fg">
          Supabase 환경변수가 설정되지 않았거나 조회에 실패했습니다.
        </div>
      )}

      {configured && (
        <CommunityModerator initialPosts={posts} initialComments={comments} initialReports={reports} />
      )}
    </div>
  );
}
