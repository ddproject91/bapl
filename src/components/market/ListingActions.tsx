"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";

/**
 * 매물 액션 — 1:1 채팅(데모) / 찜(실제 저장, likes 테이블 target_type="listing").
 * 비로그인 시 로그인 모달을 연다(openLogin).
 */
export function ListingActions({ listingId }: { listingId: string }) {
  const t = useTranslations("market");
  const { user, openLogin } = useAuth();
  const [supabase] = useState(() => createClient());
  const [wishlisted, setWishlisted] = useState(false);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!user) {
      setWishlisted(false);
      return;
    }
    supabase
      .from("likes")
      .select("user_id")
      .eq("user_id", user.id)
      .eq("target_type", "listing")
      .eq("target_id", listingId)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setWishlisted(!!data);
      });
    return () => {
      active = false;
    };
  }, [user, listingId, supabase]);

  function handleChat() {
    if (!user) {
      setNotice(t("action.loginRequired"));
      openLogin();
      return;
    }
    setNotice(t("action.chatDemo"));
  }

  async function toggleWishlist() {
    if (!user) {
      setNotice(t("action.loginRequired"));
      openLogin();
      return;
    }
    if (pending) return;
    setPending(true);
    if (wishlisted) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("target_type", "listing")
        .eq("target_id", listingId);
      if (!error) {
        setWishlisted(false);
        setNotice(t("action.wishlistRemoved"));
      }
    } else {
      const { error } = await supabase
        .from("likes")
        .insert({ user_id: user.id, target_type: "listing", target_id: listingId });
      if (!error) {
        setWishlisted(true);
        setNotice(t("action.wishlistAdded"));
      }
    }
    setPending(false);
  }

  return (
    <div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleChat}
          className="flex-1 rounded-xl bg-neon px-4 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-95"
        >
          💬 {t("action.chat")}
        </button>
        <button
          type="button"
          onClick={toggleWishlist}
          disabled={pending}
          className={
            "rounded-xl border px-5 py-3 text-sm font-bold transition-colors disabled:opacity-60 " +
            (wishlisted
              ? "border-neon/60 bg-neon/10 text-neon"
              : "border-border-strong hover:border-neon/50 hover:text-neon")
          }
        >
          {wishlisted ? "♥" : "♡"} {t("action.wishlist")}
        </button>
      </div>
      {notice && (
        <p className="mt-2 text-center text-xs text-fg-subtle">{notice}</p>
      )}
    </div>
  );
}
