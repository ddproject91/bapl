"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const DISMISS_KEY = "bapl_popup_dismissed_until";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function PopupBannerModal({
  imageUrl,
  linkUrl,
}: {
  imageUrl: string;
  linkUrl: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(DISMISS_KEY) === todayKey()) return;
    } catch {
      // localStorage 접근 불가 시(사생활 보호 모드 등) 그냥 노출
    }
    setOpen(true);
  }, []);

  function close() {
    setOpen(false);
  }

  function dismissToday() {
    try {
      window.localStorage.setItem(DISMISS_KEY, todayKey());
    } catch {
      // 무시
    }
    setOpen(false);
  }

  if (!open) return null;

  const image = (
    <div className="relative w-full" style={{ height: "min(70vh, 480px)" }}>
      <Image src={imageUrl} alt="" fill sizes="360px" className="object-contain" />
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-black/70 backdrop-blur-sm"
      onClick={close}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="animate-fade-up w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-bg-card"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-black">
            <button
              type="button"
              onClick={close}
              aria-label="닫기"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
            >
              ✕
            </button>
            {linkUrl ? (
              <Link href={linkUrl} onClick={close}>
                {image}
              </Link>
            ) : (
              image
            )}
          </div>
          <div className="flex items-center justify-between p-3">
            <button
              type="button"
              onClick={dismissToday}
              className="text-xs font-medium text-fg-muted hover:text-fg"
            >
              오늘 하루 그만보기
            </button>
            <button
              type="button"
              onClick={close}
              className="text-xs font-medium text-fg-muted hover:text-fg"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
