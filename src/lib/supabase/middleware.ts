import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** 매 요청마다 Supabase 세션 쿠키를 갱신한다(공식 @supabase/ssr 미들웨어 패턴). */
export async function refreshSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  try {
    await Promise.race([
      supabase.auth.getUser(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("auth timeout")), 4000)),
    ]);
  } catch {
    // Supabase 인증 서버가 느리거나 응답이 없어도 사이트 자체는 정상 응답해야 한다.
    // 이 요청에서만 세션 쿠키 갱신을 건너뛰고, 다음 요청에서 다시 시도된다.
  }

  return response;
}
