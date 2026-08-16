"use server";

import { cookies } from "next/headers";
import { CONTENT_KEYS, setContent, type ContentKey } from "@/lib/content";
import { ADMIN_COOKIE_NAME, expectedAdminCookieValue } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabase";

async function assertAdmin() {
  const expected = await expectedAdminCookieValue();
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!expected || cookie !== expected) {
    throw new Error("관리자 인증이 필요합니다.");
  }
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export async function uploadImageAction(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  await assertAdmin();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "파일이 없습니다." };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "이미지 파일만 업로드할 수 있어요." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "파일이 너무 커요 (최대 5MB)." };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, error: "Supabase가 설정되지 않았습니다." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from("images").upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
  });
  if (error) {
    return { ok: false, error: error.message };
  }

  const { data } = supabase.storage.from("images").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

export async function saveCollectionAction(
  key: string,
  data: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await assertAdmin();
  if (!CONTENT_KEYS.includes(key as ContentKey)) {
    return { ok: false, error: `알 수 없는 컬렉션: ${key}` };
  }
  try {
    await setContent(key as ContentKey, data);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
