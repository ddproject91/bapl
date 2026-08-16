"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAdmin } from "@/lib/supabase";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** 회원가입 프로필 사진 업로드 (계정 생성 전이라 인증 없이 호출됨). */
export async function uploadAvatarAction(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
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
  const path = `avatars/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

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

/** 회원 탈퇴 — 쿠키의 실제 로그인 세션에서 본인 확인 후 auth 계정을 삭제한다.
 * profiles/posts/comments/likes/checkins/user_bikes/notifications/reports는
 * 전부 auth.users(id) FK에 on delete cascade로 걸려 있어 함께 삭제된다. */
export async function deleteAccountAction(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const cookieStore = await cookies();
  const supabaseSession = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabaseSession.auth.getUser();
  if (!user) {
    return { ok: false, error: "로그인이 필요합니다." };
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return { ok: false, error: "Supabase가 설정되지 않았습니다." };
  }

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return { ok: false, error: error.message };
  }

  await supabaseSession.auth.signOut();
  return { ok: true };
}
