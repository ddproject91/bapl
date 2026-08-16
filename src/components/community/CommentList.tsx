"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/Badge";
import { compactNumber } from "@/lib/utils";
import type { CommunityComment } from "@/data/mock/community";

export function CommentList({ comments }: { comments: CommunityComment[] }) {
  const t = useTranslations("community");
  const { user, openLogin } = useAuth();
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reportTargetId, setReportTargetId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportSubmitting, setReportSubmitting] = useState(false);

  function startEdit(cm: CommunityComment) {
    setEditingId(cm.id);
    setDraft(cm.content);
  }

  async function saveEdit(id: string) {
    if (!draft.trim()) return;
    setBusyId(id);
    const { error } = await supabase.from("comments").update({ content: draft.trim() }).eq("id", id);
    setBusyId(null);
    if (!error) {
      setEditingId(null);
      router.refresh();
    }
  }

  async function removeComment(id: string) {
    if (!confirm(t("actions.deleteCommentConfirm"))) return;
    setBusyId(id);
    const { error } = await supabase.from("comments").delete().eq("id", id);
    setBusyId(null);
    if (!error) router.refresh();
  }

  function openReport(id: string) {
    if (!user) {
      openLogin();
      return;
    }
    setReportTargetId(id);
    setReportReason("");
    setReportError(null);
  }

  async function submitReport() {
    if (!user || !reportTargetId) return;
    if (!reportReason.trim()) {
      setReportError(t("actions.reportValidation"));
      return;
    }
    setReportSubmitting(true);
    setReportError(null);
    const { error } = await supabase
      .from("reports")
      .insert({
        reporter_id: user.id,
        target_type: "comment",
        target_id: reportTargetId,
        reason: reportReason.trim(),
      });
    setReportSubmitting(false);
    if (error) {
      setReportError(t("actions.reportError"));
      return;
    }
    setReportTargetId(null);
  }

  return (
    <div className="space-y-3">
      {comments.map((cm) => {
        const isOwner = !!user && !!cm.authorId && user.id === cm.authorId;
        const isEditing = editingId === cm.id;
        return (
          <Card
            key={cm.id}
            className={"p-4 " + (cm.isAccepted ? "border-neon/40 bg-neon/[0.05]" : "")}
          >
            {cm.isAccepted && (
              <div className="mb-2">
                <Badge variant="neon" glow>
                  ✓ {t("post.acceptedComment")}
                </Badge>
              </div>
            )}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 font-bold text-fg">
                  {cm.author}
                  {cm.authorVerified && (
                    <span className="text-neon" title={t("badge.riderVerified")}>
                      ✔
                    </span>
                  )}
                </span>
                <span className="text-fg-subtle">{cm.createdAt}</span>
              </div>
              <div className="flex items-center gap-2">
                {isOwner ? (
                  <>
                    <button
                      type="button"
                      onClick={() => (isEditing ? saveEdit(cm.id) : startEdit(cm))}
                      disabled={busyId === cm.id}
                      className="text-[11px] font-medium text-fg-subtle transition-colors hover:text-fg disabled:opacity-50"
                    >
                      {isEditing ? "저장" : t("actions.edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeComment(cm.id)}
                      disabled={busyId === cm.id}
                      className="text-[11px] font-medium text-fg-subtle transition-colors hover:text-danger disabled:opacity-50"
                    >
                      {t("actions.delete")}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => openReport(cm.id)}
                    className="text-[11px] font-medium text-fg-subtle transition-colors hover:text-danger"
                  >
                    {t("actions.report")}
                  </button>
                )}
              </div>
            </div>
            {isEditing ? (
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                className="mt-2 w-full resize-none rounded-xl border border-border bg-bg-elevated px-3 py-2 text-sm outline-none focus:border-neon"
              />
            ) : (
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-fg">{cm.content}</p>
            )}
            <div className="mt-2 text-[11px] text-fg-subtle">👍 {compactNumber(cm.likeCount)}</div>
          </Card>
        );
      })}

      {reportTargetId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setReportTargetId(null)}
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
                onClick={() => setReportTargetId(null)}
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
