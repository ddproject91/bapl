import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * 실제 회원 글/댓글 작성 직후 호출 — 해당 게시판·커뮤니티 홈·글 상세의
 * ISR 캐시(5분)를 즉시 무효화해서 방금 쓴 글/댓글이 바로 보이게 한다.
 */
export async function POST(request: Request) {
  let body: { boardSlug?: unknown; postId?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  revalidatePath("/community");
  if (typeof body.boardSlug === "string" && body.boardSlug) {
    revalidatePath(`/community/${body.boardSlug}`);
  }
  if (typeof body.postId === "string" && body.postId) {
    revalidatePath(`/community/posts/${body.postId}`);
  }

  return NextResponse.json({ ok: true });
}
