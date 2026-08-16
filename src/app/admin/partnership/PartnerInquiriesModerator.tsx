"use client";

import { useState } from "react";
import { updateInquiryStatusAction } from "./actions";

export interface InquiryRow {
  id: string;
  name: string;
  contact: string;
  company: string | null;
  inquiryType: string;
  message: string;
  status: string;
  createdAt: string;
}

const TYPE_LABEL: Record<string, string> = {
  dealer: "업체 입점",
  brand: "브랜드 입점",
  local: "로컬 업체 제휴",
  partnership: "제휴(보험·금융·투어)",
  other: "기타",
};

const STATUS_LABEL: Record<string, string> = {
  new: "신규",
  contacted: "연락완료",
  closed: "종료",
};

function fmt(iso: string): string {
  return iso.slice(0, 16).replace("T", " ");
}

export function PartnerInquiriesModerator({ initialRows }: { initialRows: InquiryRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setStatus(id: string, status: "contacted" | "closed") {
    setBusyId(id);
    const result = await updateInquiryStatusAction(id, status);
    setBusyId(null);
    if (result.ok) {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } else {
      alert(result.error);
    }
  }

  return (
    <div className="space-y-3">
      {rows.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-fg-subtle">
          접수된 문의가 없습니다.
        </p>
      )}
      {rows.map((r) => (
        <div key={r.id} className="rounded-xl border border-border bg-bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={
                  "rounded-full px-2 py-0.5 text-[11px] font-medium " +
                  (r.status === "new"
                    ? "bg-warning/15 text-warning"
                    : r.status === "contacted"
                      ? "bg-neon/15 text-neon"
                      : "bg-bg-elevated text-fg-muted")
                }
              >
                {STATUS_LABEL[r.status] ?? r.status}
              </span>
              <span className="text-xs font-bold text-fg">
                {TYPE_LABEL[r.inquiryType] ?? r.inquiryType}
              </span>
              <span className="text-xs text-fg-muted">{r.name}</span>
              {r.company && <span className="text-xs text-fg-subtle">({r.company})</span>}
            </div>
            <span className="text-[11px] text-fg-subtle">{fmt(r.createdAt)}</span>
          </div>
          <p className="mt-2 text-xs text-fg-muted">연락처: {r.contact}</p>
          <p className="mt-2 whitespace-pre-line text-sm text-fg">{r.message}</p>
          {r.status !== "closed" && (
            <div className="mt-3 flex gap-2">
              {r.status === "new" && (
                <button
                  type="button"
                  onClick={() => setStatus(r.id, "contacted")}
                  disabled={busyId === r.id}
                  className="rounded-lg bg-neon px-2.5 py-1 text-[11px] font-bold text-black disabled:opacity-40"
                >
                  연락완료로 표시
                </button>
              )}
              <button
                type="button"
                onClick={() => setStatus(r.id, "closed")}
                disabled={busyId === r.id}
                className="rounded-lg border border-border-strong px-2.5 py-1 text-[11px] font-bold disabled:opacity-40"
              >
                종료
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
