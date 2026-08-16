"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { compactNumber } from "@/lib/utils";

/**
 * 글 상세 액션 바 — 좋아요/신고는 실제 저장(Supabase), 찜/공유는 표시용(데모).
 * 본인 글이면 수정/삭제 버튼도 노출.
 */
export function PostActions({
  postId,
  boardSlug,
  authorId,
  likeCount,
  commentCount,
}: {
  postId: string;
  boardSlug: string;
  authorId?: string;
  likeCount: number;
  commentCount: number;
}) {
  const t = useTranslations("community");
  const { user, openLogin } = useAuth();
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likeCount);
  const [pending, setPending] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportDone, setReportDone] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = !!user && !!authorId && user.id === authorId;

  useEffect(() => {
    let active = true;
    if (!user) {
      setLiked(false);
      return;
    }
    supabase
      .from("likes")
      .select("user_id")
      .eq("user_id", user.id)
      .eq("target_type", "post")
      .eq("target_id", postId)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setLiked(!!data);
      });
    return () => {
      active = false;
    };
  }, [user, postId, supabase]);

  async function toggleLike() {
    if (!user) {
      openLogin();
      return;
    }
    if (pending) return;
    setPending(true);
    if (liked) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("target_type", "post")
        .eq("target_id", postId);
      if (!error) {
        setLiked(false);
        setCount((c) => Math.max(0, c - 1));
      }
    } else {
      const { error } = await supabase
        .from("likes")
        .insert({ user_id: user.id, target_type: "post", target_id: postId });
      if (!error) {
        setLiked(true);
        setCount((c) => c + 1);
        if (authorId && authorId !== user.id) {
          await supabase.from("notifications").insert({
            user_id: authorId,
            type: "like",
            message: "회원님의 글에 좋아요를 눌렀습니다.",
            link: `/community/posts/${postId}`,
          });
        }
      }
    }
    setPending(false);
  }

  function guarded(demoMessage: string) {
    return () => {
      if (!user) {
        openLogin();
        return;
      }
      alert(demoMessage);
    };
  }

  function openReport() {
    if (!user) {
      openLogin();
      return;
    }
    setReportError(null);
    setReportOpen(true);
  }

  async function submitReport() {
    if (!user) return;
    if (!reportReason.trim()) {
      setReportError(t("actions.reportValidation"));
      return;
    }
    setReportSubmitting(true);
    setReportError(null);
    const { error } = await supabase
      .from("reports")
      .insert({ reporter_id: user.id, target_type: "post", target_id: postId, reason: reportReason.trim() });
    setReportSubmitting(false);
    if (error) {
      setReportError(t("actions.reportError"));
      return;
    }
    setReportOpen(false);
    setReportReason("");
    setReportDone(true);
  }

  async function deletePost() {
    if (!user) return;
    if (!confirm(t("actions.deleteConfirm"))) return;
    setDeleting(true);
    await supabase.from("comments").delete().eq("post_id", postId);
    await supabase.from("likes").delete().eq("target_type", "post").eq("target_id", postId);
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    setDeleting(false);
    if (error) {
      alert(t("actions.deleteError"));
      return;
    }
    router.push(`/community/${boardSlug}`);
    router.refresh();
  }

  const secondary = [
    {
      key: "bookmark",
      icon: "🔖",
      label: t("actions.bookmark"),
      onClick: guarded(t("actions.demoBookmark")),
    },
    {
      key: "share",
      icon: "🔗",
      label: t("actions.share"),
      onClick: guarded(t("actions.demoShare")),
    },
    {
      key: "report",
      icon: "🚨",
      label: t("actions.report"),
      onClick: openReport,
    },
  ] as const;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-bg-card p-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={toggleLike}
          disabled={pending}
          className={
            "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-60 " +
            (liked
              ? "border-neon/60 bg-neon/10 text-neon"
              : "border-border-strong text-fg-muted hover:border-neon/50 hover:text-neon")
          }
        >
          <span aria-hidden>👍</span>
          {t("actions.like")}
          <span className="font-mono text-xs font-bold text-fg">
            {compactNumber(count)}
          </span>
        </button>
        <a
          href="#comment-form"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border-strong px-3.5 py-2 text-sm font-medium text-fg-muted transition-colors hover:border-neon/50 hover:text-neon"
        >
          <span aria-hidden>💬</span>
          {t("actions.comment")}
          <span className="font-mono text-xs font-bold text-fg">
            {compactNumber(commentCount)}
          </span>
        </a>
      </div>
      <div className="flex items-center gap-2">
        {secondary.map((a) => (
          <button
            key={a.key}
            type="button"
            onClick={a.onClick}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-fg-subtle transition-colors hover:text-fg"
          >
            <span aria-hidden>{a.icon}</span>
            {a.label}
          </button>
        ))}
        {isOwner && (
          <>
            <Link
              href={`/community/posts/${postId}/edit`}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-fg-subtle transition-colors hover:text-fg"
            >
              <span aria-hidden>✏️</span>
              {t("actions.edit")}
            </Link>
            <button
              type="button"
              onClick={deletePost}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-danger transition-colors hover:text-danger disabled:opacity-50"
            >
              <span aria-hidden>🗑️</span>
              {deleting ? t("actions.deleting") : t("actions.delete")}
            </button>
          </>
        )}
      </div>

      {reportDone && (
        <p className="w-full text-center text-xs text-fg-subtle">{t("actions.reportDone")}</p>
      )}

      {reportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setReportOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border-strong bg-bg-card p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold">{t("actions.reportTitle")}</h3>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={4}
              placeholder={t("actions.reportPlaceholder")}
              className="mt-3 w-full resize-none rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
            />
            {reportError && <p className="mt-1.5 text-[11px] font-medium text-danger">{reportError}</p>}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={submitReport}
                disabled={reportSubmitting}
                className="flex-1 rounded-xl bg-neon py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40"
              >
                {reportSubmitting ? t("actions.reportSubmitting") : t("actions.reportSubmit")}
              </button>
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                className="rounded-xl border border-border-strong px-5 py-2.5 text-sm font-bold text-fg-muted transition-colors hover:border-neon/50 hover:text-neon"
              >
                {t("actions.reportCancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
