"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import type { Board } from "@/lib/types";
import { PageHeader } from "@/components/ui/primitives";

export function WriteForm({
  boards,
  defaultSlug,
}: {
  boards: Board[];
  defaultSlug?: string;
}) {
  const t = useTranslations("community");
  const { user, openLogin } = useAuth();
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const initialSlug =
    defaultSlug && boards.some((b) => b.slug === defaultSlug) ? defaultSlug : boards[0]?.slug ?? "";
  const [boardSlug, setBoardSlug] = useState(initialSlug);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-dashed border-border-strong bg-bg-card px-6 py-16 text-center">
        <span className="mb-4 text-4xl">🔑</span>
        <h1 className="text-xl font-black">{t("writePage.loginTitle")}</h1>
        <p className="mt-2 text-sm text-fg-muted">{t("writePage.loginHint")}</p>
        <button
          type="button"
          onClick={openLogin}
          className="mt-6 rounded-xl bg-neon px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.03] active:scale-95"
        >
          {t("writePage.loginButton")}
        </button>
      </div>
    );
  }

  async function submit() {
    if (!user) return;
    if (!title.trim() || !content.trim()) {
      setError(t("writePage.validation"));
      return;
    }
    setSubmitting(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("posts")
      .insert({
        board_slug: boardSlug,
        author_id: user.id,
        title: title.trim(),
        content: content.trim(),
      })
      .select("id")
      .single();
    setSubmitting(false);
    if (err || !data) {
      setError(err?.message ?? t("writePage.error"));
      return;
    }
    await fetch("/api/revalidate-community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardSlug, postId: data.id }),
    }).catch(() => {});
    router.push(`/community/posts/${data.id}`);
  }

  return (
    <div>
      <PageHeader title={t("writePage.title")} description={t("writePage.description")} />
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
            placeholder={t("writePage.titlePlaceholder")}
            className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-fg-muted">{t("writePage.contentLabel")}</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            placeholder={t("writePage.contentPlaceholder")}
            className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
          />
        </label>
        {error && <p className="text-xs font-medium text-danger">{error}</p>}
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="mt-2 self-start rounded-xl bg-neon px-5 py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-40"
        >
          {submitting ? t("writePage.submitting") : t("writePage.submit")}
        </button>
      </div>
    </div>
  );
}
