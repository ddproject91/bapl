"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { uploadPostImageAction } from "@/components/community/actions";
import type { Board } from "@/lib/types";
import { PageHeader } from "@/components/ui/primitives";

const MAX_IMAGES = 4;

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialSlug =
    defaultSlug && boards.some((b) => b.slug === defaultSlug) ? defaultSlug : boards[0]?.slug ?? "";
  const [boardSlug, setBoardSlug] = useState(initialSlug);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
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

  async function onImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setImageError(t("writePage.imageLimit", { max: MAX_IMAGES }));
      return;
    }
    setImageError(null);
    setImageUploading(true);
    for (const file of files.slice(0, remaining)) {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadPostImageAction(formData);
      if (result.ok) {
        setImages((prev) => [...prev, result.url]);
      } else {
        setImageError(result.error);
        break;
      }
    }
    setImageUploading(false);
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
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
        image_urls: images,
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

        <div>
          <span className="text-xs font-medium text-fg-muted">{t("writePage.images")}</span>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {images.map((url) => (
              <div key={url} className="relative h-20 w-20 overflow-hidden rounded-xl border border-border">
                <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs text-white"
                >
                  ×
                </button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploading}
                className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border-strong text-fg-subtle transition-colors hover:border-neon/50 hover:text-neon disabled:opacity-50"
              >
                <span className="text-lg">{imageUploading ? "…" : "+"}</span>
                <span className="text-[10px]">
                  {imageUploading ? t("writePage.imageUploading") : t("writePage.imageAdd")}
                </span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onImageSelect}
            className="hidden"
          />
          <p className="mt-1 text-[11px] text-fg-subtle">
            {t("writePage.imageHint", { max: MAX_IMAGES })}
          </p>
          {imageError && <p className="mt-1 text-[11px] font-medium text-danger">{imageError}</p>}
        </div>

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
