"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import type { Board } from "@/lib/types";
import { PageHeader } from "@/components/ui/primitives";

type LoadState = "loading" | "ready" | "not-found" | "forbidden";

export function EditPostForm({ postId, boards }: { postId: string; boards: Board[] }) {
  const t = useTranslations("community");
  const { user, loading: authLoading, openLogin } = useAuth();
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [state, setState] = useState<LoadState>("loading");
  const [boardSlug, setBoardSlug] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setState("forbidden");
      return;
    }
    let active = true;
    supabase
      .from("posts")
      .select("board_slug, author_id, title, content")
      .eq("id", postId)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        if (!data) {
          setState("not-found");
          return;
        }
        if (data.author_id !== user.id) {
          setState("forbidden");
          return;
        }
        setBoardSlug(data.board_slug);
        setTitle(data.title);
        setContent(data.content);
        setState("ready");
      });
    return () => {
      active = false;
    };
  }, [authLoading, user, postId, supabase]);

  async function submit() {
    if (!title.trim() || !content.trim()) {
      setError(t("writePage.validation"));
      return;
    }
    setSubmitting(true);
    setError(null);
    const { error: err } = await supabase
      .from("posts")
      .update({ board_slug: boardSlug, title: title.trim(), content: content.trim() })
      .eq("id", postId);
    setSubmitting(false);
    if (err) {
      setError(t("writePage.error"));
      return;
    }
    router.push(`/community/posts/${postId}`);
    router.refresh();
  }

  if (state === "loading" || authLoading) {
    return <p className="py-16 text-center text-sm text-fg-subtle">불러오는 중...</p>;
  }

  if (state === "not-found") {
    return <p className="py-16 text-center text-sm text-fg-subtle">글을 찾을 수 없습니다.</p>;
  }

  if (state === "forbidden") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-dashed border-border-strong bg-bg-card px-6 py-16 text-center">
        <span className="mb-4 text-4xl">🔒</span>
        <h1 className="text-xl font-black">
          {user ? "수정 권한이 없습니다" : t("writePage.loginTitle")}
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          {user ? "본인이 작성한 글만 수정할 수 있습니다." : t("writePage.loginHint")}
        </p>
        {!user && (
          <button
            type="button"
            onClick={openLogin}
            className="mt-6 rounded-xl bg-neon px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.03] active:scale-95"
          >
            {t("writePage.loginButton")}
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="글 수정" description="내용을 고치고 저장하세요." />
      <div className="mt-6 flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-fg-muted">{t("writePage.board")}</span>
          <select
            value={boardSlug}
            onChange={(e) => setBoardSlug(e.target.value)}
            className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
          >
            {boards.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.icon} {b.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-fg-muted">{t("writePage.titleLabel")}</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-fg-muted">{t("writePage.contentLabel")}</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
          />
        </label>
        {error && <p className="text-xs font-medium text-danger">{error}</p>}
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="self-start rounded-xl bg-neon px-5 py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-40"
          >
            {submitting ? t("writePage.submitting") : "저장"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/community/posts/${postId}`)}
            className="self-start rounded-xl border border-border-strong px-5 py-2.5 text-sm font-bold text-fg-muted transition-colors hover:border-neon/50 hover:text-neon"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
