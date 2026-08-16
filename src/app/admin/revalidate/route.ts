import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, expectedAdminCookieValue } from "@/lib/adminAuth";
import { CONTENT_KEYS, type ContentKey } from "@/lib/content";

/** 관리자 전용: DB를 스크립트로 직접 고친 뒤 캐시 태그를 수동으로 무효화할 때 사용. */
export async function POST(request: Request) {
  const expected = await expectedAdminCookieValue();
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!expected || cookie !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const key = new URL(request.url).searchParams.get("key");
  if (key) {
    if (!CONTENT_KEYS.includes(key as ContentKey)) {
      return NextResponse.json({ ok: false, error: `알 수 없는 컬렉션: ${key}` }, { status: 400 });
    }
    revalidateTag(`content:${key}`, "max");
  }
  revalidateTag("content", "max");
  return NextResponse.json({ ok: true });
}
