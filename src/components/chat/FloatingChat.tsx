"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type Topic = "general" | "insurance" | "loan";

/** 전역 플로팅 채팅 문의 — 보험/금융 상담[제휴] + 일반 문의 */
export function FloatingChat() {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<Topic | null>(null);

  const topics: { key: Topic; partner?: boolean }[] = [
    { key: "general" },
    { key: "insurance", partner: true },
    { key: "loan", partner: true },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-20 right-4 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-neon text-black shadow-[0_8px_24px_-4px_var(--neon-glow)] transition-transform hover:scale-105 active:scale-95 md:bottom-6 md:right-6"
        style={{ height: 52, width: 52 }}
        aria-label={t("chat.title")}
      >
        <span className="text-xl">{open ? "✕" : "💬"}</span>
      </button>

      {open && (
        <div className="animate-fade-up fixed bottom-36 right-4 z-40 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-border bg-bg-card shadow-2xl md:bottom-24 md:right-6">
          <div className="border-b border-border p-4">
            <p className="text-sm font-bold">{t("chat.title")}</p>
            <p className="text-xs text-fg-muted">{t("chat.subtitle")}</p>
          </div>

          {!topic ? (
            <div className="space-y-2 p-4">
              {topics.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTopic(item.key)}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-bg-elevated px-3.5 py-3 text-left transition-colors hover:border-neon/40"
                >
                  <span>
                    <span className="block text-sm font-medium">
                      {t(`chat.${item.key}`)}
                    </span>
                    {item.key !== "general" && (
                      <span className="block text-[11px] text-fg-subtle">
                        {t(`chat.${item.key}Desc`)}
                      </span>
                    )}
                  </span>
                  {item.partner && <Badge variant="partner">{t("badge.partner")}</Badge>}
                </button>
              ))}
              <p className="pt-1 text-[11px] leading-relaxed text-fg-subtle">
                {t("chat.partnerNote")}
              </p>
            </div>
          ) : (
            <div className="p-4">
              <button
                type="button"
                onClick={() => setTopic(null)}
                className="mb-3 text-xs text-fg-muted hover:text-fg"
              >
                ← {t("action.back")}
              </button>
              <div className="mb-3 rounded-xl bg-bg-elevated p-3 text-xs text-fg-muted">
                <p className="mb-1 font-medium text-fg">
                  {t(`chat.${topic}`)}
                </p>
                {t("chat.demoReply")}
              </div>
              <div className="flex gap-2">
                <input
                  disabled
                  placeholder={t("chat.placeholder")}
                  className={cn(
                    "flex-1 rounded-xl border border-border bg-bg-elevated px-3 py-2 text-sm",
                    "cursor-not-allowed opacity-60",
                  )}
                />
                <button
                  type="button"
                  disabled
                  className="rounded-xl bg-neon/40 px-3 py-2 text-sm font-bold text-black/60"
                >
                  {t("action.chat")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
