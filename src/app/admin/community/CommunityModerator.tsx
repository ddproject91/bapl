"use client";

import { useState } from "react";
import { deleteCommentAction, deletePostAction, updateReportStatusAction } from "./actions";

export interface PostRow {
  id: string;
  boardSlug: string;
  title: string;
  content: string;
  authorNickname: string;
  createdAt: string;
}

export interface CommentRow {
  id: string;
  postId: string;
  content: string;
  authorNickname: string;
  createdAt: string;
}

export interface ReportRow {
  id: string;
  reporterNickname: string;
  targetType: string;
  targetId: string;
  reason: string;
  status: string;
  createdAt: string;
}

type Tab = "posts" | "comments" | "reports";

function fmt(iso: string): string {
  return iso.slice(0, 16).replace("T", " ");
}

export function CommunityModerator({
  initialPosts,
  initialComments,
  initialReports,
}: {
  initialPosts: PostRow[];
  initialComments: CommentRow[];
  initialReports: ReportRow[];
}) {
  const [tab, setTab] = useState<Tab>("reports");
  const [posts, setPosts] = useState(initialPosts);
  const [comments, setComments] = useState(initialComments);
  const [reports, setReports] = useState(initialReports);
  const [busyId, setBusyId] = useState<string | null>(null);

  const pendingCount = reports.filter((r) => r.status === "pending").length;

  async function removePost(id: string) {
    if (!confirm("이 게시글과 딸린 댓글/좋아요를 전부 삭제합니다. 계속할까요?")) return;
    setBusyId(id);
    const result = await deletePostAction(id);
    setBusyId(null);
    if (result.ok) setPosts((prev) => prev.filter((p) => p.id !== id));
    else alert(result.error);
  }

  async function removeComment(id: string) {
    if (!confirm("이 댓글을 삭제합니다. 계속할까요?")) return;
    setBusyId(id);
    const result = await deleteCommentAction(id);
    setBusyId(null);
    if (result.ok) setComments((prev) => prev.filter((c) => c.id !== id));
    else alert(result.error);
  }

  async function setReportStatus(id: string, status: "reviewed" | "dismissed") {
    setBusyId(id);
    const result = await updateReportStatusAction(id, status);
    setBusyId(null);
    if (result.ok) {
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } else {
      alert(result.error);
    }
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "reports", label: `신고 (${pendingCount})` },
    { key: "posts", label: `게시글 (${posts.length})` },
    { key: "comments", label: `댓글 (${comments.length})` },
  ];

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={
              "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors " +
              (tab === t.key
                ? "border-neon bg-neon/15 text-neon"
                : "border-border text-fg-muted hover:border-border-strong hover:text-fg")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "reports" && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-elevated text-xs text-fg-muted">
                <th className="px-4 py-3 font-medium">신고자</th>
                <th className="px-4 py-3 font-medium">대상</th>
                <th className="px-4 py-3 font-medium">사유</th>
                <th className="px-4 py-3 font-medium">상태</th>
                <th className="px-4 py-3 font-medium">일시</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-fg-subtle">
                    접수된 신고가 없습니다.
                  </td>
                </tr>
              )}
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 font-medium">{r.reporterNickname}</td>
                  <td className="px-4 py-3 text-fg-muted">
                    {r.targetType === "post" ? "게시글" : "댓글"} · {r.targetId.slice(0, 8)}
                  </td>
                  <td className="max-w-xs px-4 py-3">{r.reason}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "rounded-full px-2 py-0.5 text-[11px] font-medium " +
                        (r.status === "pending"
                          ? "bg-warning/15 text-warning"
                          : r.status === "reviewed"
                            ? "bg-neon/15 text-neon"
                            : "bg-bg-elevated text-fg-muted")
                      }
                    >
                      {r.status === "pending" ? "대기" : r.status === "reviewed" ? "처리완료" : "반려"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-fg-subtle">{fmt(r.createdAt)}</td>
                  <td className="px-4 py-3">
                    {r.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setReportStatus(r.id, "reviewed")}
                          disabled={busyId === r.id}
                          className="rounded-lg bg-neon px-2.5 py-1 text-[11px] font-bold text-black disabled:opacity-40"
                        >
                          처리완료
                        </button>
                        <button
                          type="button"
                          onClick={() => setReportStatus(r.id, "dismissed")}
                          disabled={busyId === r.id}
                          className="rounded-lg border border-border-strong px-2.5 py-1 text-[11px] font-bold disabled:opacity-40"
                        >
                          반려
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "posts" && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-elevated text-xs text-fg-muted">
                <th className="px-4 py-3 font-medium">게시판</th>
                <th className="px-4 py-3 font-medium">제목</th>
                <th className="px-4 py-3 font-medium">작성자</th>
                <th className="px-4 py-3 font-medium">일시</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-fg-subtle">
                    실제 회원이 작성한 글이 없습니다.
                  </td>
                </tr>
              )}
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-fg-muted">{p.boardSlug}</td>
                  <td className="max-w-sm truncate px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-fg-muted">{p.authorNickname}</td>
                  <td className="px-4 py-3 text-fg-subtle">{fmt(p.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => removePost(p.id)}
                      disabled={busyId === p.id}
                      className="rounded-lg border border-danger/40 px-2.5 py-1 text-[11px] font-bold text-danger hover:bg-danger/10 disabled:opacity-40"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "comments" && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-elevated text-xs text-fg-muted">
                <th className="px-4 py-3 font-medium">내용</th>
                <th className="px-4 py-3 font-medium">작성자</th>
                <th className="px-4 py-3 font-medium">일시</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {comments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-fg-subtle">
                    실제 회원이 작성한 댓글이 없습니다.
                  </td>
                </tr>
              )}
              {comments.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-b-0">
                  <td className="max-w-md truncate px-4 py-3">{c.content}</td>
                  <td className="px-4 py-3 text-fg-muted">{c.authorNickname}</td>
                  <td className="px-4 py-3 text-fg-subtle">{fmt(c.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => removeComment(c.id)}
                      disabled={busyId === c.id}
                      className="rounded-lg border border-danger/40 px-2.5 py-1 text-[11px] font-bold text-danger hover:bg-danger/10 disabled:opacity-40"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
