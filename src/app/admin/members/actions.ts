"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ADMIN_COOKIE_NAME, expectedAdminCookieValue } from "@/lib/adminAuth";
import type { Role, Tier } from "@/components/auth/AuthProvider";

async function assertAdmin() {
  const expected = await expectedAdminCookieValue();
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!expected || cookie !== expected) {
    throw new Error("관리자 인증이 필요합니다.");
  }
}

export async function updateMemberAction(
  userId: string,
  patch: { role: Role; tier: Tier; isRiderVerified: boolean },
): Promise<{ ok: true } | { ok: false; error: string }> {
  await assertAdmin();
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, error: "Supabase가 설정되지 않았습니다." };
  }
  const { error } = await supabase
    .from("profiles")
    .update({
      role: patch.role,
      tier: patch.tier,
      is_rider_verified: patch.isRiderVerified,
    })
    .eq("id", userId);
  if (error) {
    return { ok: false, error: error.message };
  }
  revalidatePath("/admin/members");
  return { ok: true };
}
