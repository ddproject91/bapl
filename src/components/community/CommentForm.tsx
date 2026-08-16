"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";

export function CommentForm({ postId }: { postId: string }) {
  const t = useTranslations("community");
  const { user, openLogin } = useAuth();
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!user) {
      openLogin();
      return;
    }
    if (!content.trim()) return;
    setSubmitting(true);
    setError(null);
    const { error: err } = await supabase
      .from("comments")
      .insert({ post_id: postId, author_id: user.id, content: content.trim() });
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    setContent("");
    await fetch("/api/revalidate-community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    }).catch(() => {});
    router.refresh();
  }

  return (
    <div id="comment-form" className="mt-4 rounded-2xl border border-border bg-bg-card p-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t("post.commentPlaceholder")}
        rows={2}
        className="w-full resize-none rounded-xl border border-border bg-bg px-3 py-2.5 text-xs outline-none focus:border-neon"
      />
      {error && <p className="mt-1.5 text-[11px] font-medium text-danger">{error}</p>}
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={submit}
          disabled={submitting || !content.trim()}
          className="rounded-xl bg-neon px-4 py-2 text-xs font-bold text-black transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-40"
        >
          {submitting ? t("post.commentSubmitting") : t("post.commentSubmit")}
        </button>
      </div>
    </div>
  );
}
