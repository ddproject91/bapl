"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";

/** 글쓰기 버튼 — 비로그인 시 로그인 모달 오픈, 로그인 시 글쓰기 페이지로 이동. */
export function WriteButton({
  full = false,
  boardSlug,
}: {
  full?: boolean;
  boardSlug?: string;
}) {
  const t = useTranslations("community");
  const { user, openLogin } = useAuth();
  const router = useRouter();

  function handleClick() {
    if (!user) {
      openLogin();
      return;
    }
    router.push(boardSlug ? `/community/write?board=${boardSlug}` : "/community/write");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        (full ? "w-full justify-center " : "") +
        "inline-flex items-center gap-1.5 rounded-xl bg-neon px-4 py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.03] active:scale-95"
      }
    >
      <span aria-hidden>✏️</span>
      {t("write")}
    </button>
  );
}
