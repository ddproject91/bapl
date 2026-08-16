"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAdmin } from "@/lib/supabase";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
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
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/** 게시글 첨부 사진 업로드 — 로그인한 회원만 가능. */
export async function uploadPostImageAction(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const userId = await getSessionUserId();
  if (!userId) {
    return { ok: false, error: "로그인이 필요합니다." };
  }

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
  const path = `posts/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

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
