"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ADMIN_COOKIE_NAME, expectedAdminCookieValue } from "@/lib/adminAuth";

async function assertAdmin() {
  const expected = await expectedAdminCookieValue();
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!expected || cookie !== expected) {
    throw new Error("관리자 인증이 필요합니다.");
  }
}

export async function deletePostAction(
  postId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await assertAdmin();
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "Supabase가 설정되지 않았습니다." };

  await supabase.from("comments").delete().eq("post_id", postId);
  await supabase.from("likes").delete().eq("target_type", "post").eq("target_id", postId);
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/community");
  return { ok: true };
}

export async function deleteCommentAction(
  commentId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await assertAdmin();
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "Supabase가 설정되지 않았습니다." };

  const { error } = await supabase.from("comments").delete().eq("id", commentId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/community");
  return { ok: true };
}

export async function updateReportStatusAction(
  reportId: string,
  status: "reviewed" | "dismissed",
): Promise<{ ok: true } | { ok: false; error: string }> {
  await assertAdmin();
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "Supabase가 설정되지 않았습니다." };

  const { error } = await supabase.from("reports").update({ status }).eq("id", reportId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/community");
  return { ok: true };
}
