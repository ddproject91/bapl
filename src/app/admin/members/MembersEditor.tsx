"use client";

import { useState } from "react";
import Image from "next/image";
import type { Role, Tier } from "@/components/auth/AuthProvider";
import { updateMemberAction } from "./actions";

export interface MemberRow {
  id: string;
  email: string;
  nickname: string;
  role: Role;
  tier: Tier;
  points: number;
  isRiderVerified: boolean;
  avatarUrl: string;
  bikeModel: string;
  createdAt: string;
  memo: string;
}

const ROLES: Role[] = ["user", "vendor", "seller", "admin"];
const TIERS: Tier[] = ["bronze", "silver", "gold", "platinum"];

export function MembersEditor({ initialMembers }: { initialMembers: MemberRow[] }) {
  const [members, setMembers] = useState(initialMembers);
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());
  const [savingId, setSavingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});

  function patch(id: string, changes: Partial<MemberRow>) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...changes } : m)));
    setDirtyIds((prev) => new Set(prev).add(id));
  }

  async function save(id: string) {
    const member = members.find((m) => m.id === id);
    if (!member) return;
    setSavingId(id);
    const result = await updateMemberAction(id, {
      role: member.role,
      tier: member.tier,
      isRiderVerified: member.isRiderVerified,
      memo: member.memo,
    });
    setSavingId(null);
    if (result.ok) {
      setDirtyIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setMessages((prev) => ({ ...prev, [id]: "저장됨" }));
    } else {
      setMessages((prev) => ({ ...prev, [id]: result.error }));
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-bg-elevated text-xs text-fg-muted">
            <th className="px-4 py-3 font-medium">닉네임</th>
            <th className="px-4 py-3 font-medium">이메일</th>
            <th className="px-4 py-3 font-medium">보유 바이크</th>
            <th className="px-4 py-3 font-medium">권한</th>
            <th className="px-4 py-3 font-medium">등급</th>
            <th className="px-4 py-3 font-medium">라이더 인증</th>
            <th className="px-4 py-3 font-medium">포인트</th>
            <th className="px-4 py-3 font-medium">메모 (관리자 전용)</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-b border-border last:border-b-0">
              <td className="px-4 py-3 font-medium">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neon/20 text-[10px] font-bold text-neon">
                    {m.avatarUrl ? (
                      <Image src={m.avatarUrl} alt="" fill sizes="24px" className="object-cover" />
                    ) : (
                      m.nickname.slice(0, 1)
                    )}
                  </span>
                  {m.nickname}
                </div>
              </td>
              <td className="px-4 py-3 text-fg-muted">{m.email}</td>
              <td className="px-4 py-3 text-fg-muted">{m.bikeModel || "-"}</td>
              <td className="px-4 py-3">
                <select
                  value={m.role}
                  onChange={(e) => patch(m.id, { role: e.target.value as Role })}
                  className="rounded-lg border border-border bg-bg px-2 py-1.5 text-xs outline-none focus:border-neon"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                <select
                  value={m.tier}
                  onChange={(e) => patch(m.id, { tier: e.target.value as Tier })}
                  className="rounded-lg border border-border bg-bg px-2 py-1.5 text-xs outline-none focus:border-neon"
                >
                  {TIERS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={m.isRiderVerified}
                  onChange={(e) => patch(m.id, { isRiderVerified: e.target.checked })}
                  className="h-4 w-4"
                />
              </td>
              <td className="px-4 py-3 font-mono text-xs">{m.points}</td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={m.memo}
                  onChange={(e) => patch(m.id, { memo: e.target.value })}
                  placeholder="예: 지인, 요주의 등"
                  className="w-40 rounded-lg border border-border bg-bg px-2 py-1.5 text-xs outline-none focus:border-neon"
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => save(m.id)}
                    disabled={!dirtyIds.has(m.id) || savingId === m.id}
                    className="rounded-lg bg-neon px-3 py-1.5 text-xs font-bold text-black disabled:opacity-40"
                  >
                    {savingId === m.id ? "저장 중..." : "저장"}
                  </button>
                  {messages[m.id] && (
                    <span className="text-[11px] text-fg-subtle">{messages[m.id]}</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
