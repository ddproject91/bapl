import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, expectedAdminCookieValue } from "@/lib/adminAuth";
import { refreshSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await refreshSession(request);

  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return response;
  }
  if (request.nextUrl.pathname.startsWith("/admin/login")) {
    return response;
  }

  const expected = await expectedAdminCookieValue();
  if (!expected) {
    return new NextResponse(
      "ADMIN_PASSWORD 환경변수가 설정되지 않았습니다. .env.local(및 Vercel 환경변수)에 추가해주세요.",
      { status: 500 },
    );
  }

  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (cookie === expected) {
    return response;
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
