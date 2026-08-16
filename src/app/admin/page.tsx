import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getAllContent } from "@/lib/content";
import { COLLECTIONS } from "./collections";
import { logoutAction } from "./login/actions";

function countOf(data: unknown): string {
  if (Array.isArray(data)) return `${data.length}개`;
  if (data && typeof data === "object") return `${Object.keys(data).length}개`;
  return "-";
}

export default async function AdminHomePage() {
  const configured = Boolean(getSupabaseAdmin());
  const rows = configured ? await getAllContent() : {};

  const groups = Array.from(new Set(COLLECTIONS.map((c) => c.group)));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight">BAPL 콘텐츠 관리</h1>
          <p className="mt-1 text-sm text-fg-muted">
            컬렉션을 선택해 항목을 추가·수정·삭제하세요. 저장하면 사이트에 바로 반영됩니다.
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-fg-muted hover:border-border-strong hover:text-fg"
          >
            로그아웃
          </button>
        </form>
      </div>

      {!configured && (
        <div className="mb-6 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-fg">
          Supabase 환경변수(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)가 설정되지 않아
          현재는 저장이 비활성화되어 있습니다. 사이트는 목업 데이터로 정상 동작합니다.
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Link
          href="/admin/members"
          className="flex items-center justify-between rounded-xl border border-border bg-bg-card px-4 py-3 text-sm transition-colors hover:border-neon/40"
        >
          <span className="font-medium">회원 관리 (권한/등급)</span>
          <span className="text-xs text-fg-subtle">→</span>
        </Link>
        <Link
          href="/admin/community"
          className="flex items-center justify-between rounded-xl border border-border bg-bg-card px-4 py-3 text-sm transition-colors hover:border-neon/40"
        >
          <span className="font-medium">커뮤니티 관리 (신고/삭제)</span>
          <span className="text-xs text-fg-subtle">→</span>
        </Link>
        <Link
          href="/admin/partnership"
          className="flex items-center justify-between rounded-xl border border-border bg-bg-card px-4 py-3 text-sm transition-colors hover:border-neon/40"
        >
          <span className="font-medium">제휴·입점 문의</span>
          <span className="text-xs text-fg-subtle">→</span>
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <div key={group}>
            <h2 className="mb-2 text-sm font-bold text-fg-muted">{group}</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {COLLECTIONS.filter((c) => c.group === group).map((c) => (
                <Link
                  key={c.key}
                  href={`/admin/${c.key}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-bg-card px-4 py-3 text-sm transition-colors hover:border-neon/40"
                >
                  <span className="font-medium">{c.label}</span>
                  <span className="text-xs text-fg-subtle">
                    {countOf(rows[c.key]?.data)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
