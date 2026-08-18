import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { MembersEditor, type MemberRow } from "./MembersEditor";

export default async function AdminMembersPage() {
  const supabase = getSupabaseAdmin();

  let members: MemberRow[] = [];
  let configured = Boolean(supabase);

  if (supabase) {
    const [
      { data: usersData, error: usersError },
      { data: profiles, error: profilesError },
      { data: notes },
    ] = await Promise.all([
      supabase.auth.admin.listUsers(),
      supabase
        .from("profiles")
        .select(
          "id, nickname, region, points, is_rider_verified, role, tier, avatar_url, bike_model, created_at",
        ),
      supabase.from("profile_admin_notes").select("user_id, memo"),
    ]);

    if (usersError || profilesError) {
      configured = false;
    } else {
      const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
      const memoById = new Map((notes ?? []).map((n) => [n.user_id, n.memo]));
      members = usersData.users
        .map((u) => {
          const p = profileById.get(u.id);
          if (!p) return null;
          return {
            id: u.id,
            email: u.email ?? "-",
            nickname: p.nickname,
            role: p.role,
            tier: p.tier,
            points: p.points,
            isRiderVerified: p.is_rider_verified,
            avatarUrl: p.avatar_url ?? "",
            bikeModel: p.bike_model ?? "",
            createdAt: p.created_at,
            memo: memoById.get(u.id) ?? "",
          } satisfies MemberRow;
        })
        .filter((m): m is MemberRow => m !== null)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/admin"
        className="mb-4 inline-block text-xs font-medium text-fg-muted hover:text-neon"
      >
        ← 전체 컬렉션
      </Link>
      <h1 className="mb-1 text-xl font-black tracking-tight">회원 관리</h1>
      <p className="mb-6 text-sm text-fg-muted">
        가입한 회원의 권한(role)과 등급(tier), 라이더 인증 여부를 설정하세요. 메모는 관리자만 볼 수 있어요.
      </p>

      {!configured && (
        <div className="mb-6 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-fg">
          Supabase 환경변수가 설정되지 않았거나 회원 조회에 실패했습니다.
        </div>
      )}

      {configured && members.length === 0 && (
        <p className="text-sm text-fg-subtle">아직 가입한 회원이 없습니다.</p>
      )}

      {members.length > 0 && <MembersEditor initialMembers={members} />}
    </div>
  );
}
