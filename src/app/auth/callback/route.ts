import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** 카카오 등 OAuth 로그인 콜백 — 인증 코드를 실제 세션으로 교환한다. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
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
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // 카카오 등 소셜 가입자는 바이크 기종·지역 정보가 비어 있으므로 프로필 입력 화면으로 안내한다.
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("bike_model, region")
          .eq("id", user.id)
          .maybeSingle();
        const needsOnboarding =
          !profile || (!profile.bike_model?.trim() && !profile.region?.trim());
        if (needsOnboarding) {
          return NextResponse.redirect(`${origin}/my/edit?welcome=1`);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(
      `${origin}/?authError=${encodeURIComponent(error.message)}`,
    );
  }

  const oauthError = searchParams.get("error_description") || searchParams.get("error");
  return NextResponse.redirect(
    `${origin}/${oauthError ? `?authError=${encodeURIComponent(oauthError)}` : ""}`,
  );
}
