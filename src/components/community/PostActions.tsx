"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { compactNumber } from "@/lib/utils";

/**
 * 글 상세 액션 바 — 좋아요는 실제 토글(Supabase likes 테이블), 찜/공유/신고는 표시용(데모).
 */
export function PostActions({
  postId,
  likeCount,
  commentCount,
}: {
  postId: string;
  likeCount: number;
  commentCount: number;
}) {
  const t = useTranslations("community");
  const { user, openLogin } = useAuth();
  const [supabase] = useState(() => createClient());
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likeCount);
  const [pending, setPending] = useState(false);

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
      onClick: guarded(t("actions.demoReport")),
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
      </div>
    </div>
  );
}
