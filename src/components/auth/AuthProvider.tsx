"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";

export type Role = "user" | "vendor" | "seller" | "admin";
export type Tier = "bronze" | "silver" | "gold" | "platinum";

export interface Profile {
  id: string;
  nickname: string;
  region: string;
  points: number;
  isRiderVerified: boolean;
  role: Role;
  tier: Tier;
  avatarUrl: string;
  bikeModel: string;
  gender: Gender;
  /** 출생연도. 0이면 미설정 */
  birthYear: number;
  /** 라이딩 입문연도. 0이면 미설정 */
  ridingSince: number;
}

export type Gender = "" | "male" | "female" | "other";

interface AuthContextValue {
  user: Profile | null;
  loading: boolean;
  authError: string | null;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    email: string,
    password: string,
    nickname: string,
    bikeModel: string,
    avatarUrl: string,
  ) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  loginWithKakao: () => Promise<void>;
  sendPhoneOtp: (phone: string) => Promise<boolean>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<boolean>;
}

/** "010-1234-5678" 같은 국내 입력을 Supabase가 요구하는 "8210..." 형식으로 변환. */
function toE164Phone(input: string): string {
  const digits = input.replace(/\D/g, "");
  const local = digits.startsWith("0") ? digits.slice(1) : digits;
  return `82${local}`;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(
  supabase: ReturnType<typeof createClient>,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, nickname, region, points, is_rider_verified, role, tier, avatar_url, bike_model, gender, birth_year, riding_since",
    )
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id,
    nickname: data.nickname,
    region: data.region ?? "",
    points: data.points,
    isRiderVerified: data.is_rider_verified,
    role: data.role,
    tier: data.tier,
    avatarUrl: data.avatar_url ?? "",
    bikeModel: data.bike_model ?? "",
    gender: (data.gender ?? "") as Gender,
    birthYear: data.birth_year ?? 0,
    ridingSince: data.riding_since ?? 0,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return;
      if (session?.user) {
        setUser(await fetchProfile(supabase, session.user.id));
      }
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;
      if (session?.user) {
        setUser(await fetchProfile(supabase, session.user.id));
      } else {
        setUser(null);
      }
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("authError");
    if (oauthError) {
      setAuthError(oauthError);
      setLoginOpen(true);
      params.delete("authError");
      const rest = params.toString();
      window.history.replaceState(
        null,
        "",
        window.location.pathname + (rest ? `?${rest}` : ""),
      );
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setAuthError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
        return false;
      }
      setLoginOpen(false);
      return true;
    },
    [supabase],
  );

  const signup = useCallback(
    async (
      email: string,
      password: string,
      nickname: string,
      bikeModel: string,
      avatarUrl: string,
    ) => {
      setAuthError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nickname, bike_model: bikeModel, avatar_url: avatarUrl },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) {
        setAuthError(error.message);
        return false;
      }
      if (!data.session) {
        setAuthError("가입 확인 이메일을 보냈어요. 메일함을 확인해주세요.");
        return false;
      }
      setLoginOpen(false);
      return true;
    },
    [supabase],
  );

  const logout = useCallback(() => {
    supabase.auth.signOut();
  }, [supabase]);

  const loginWithKakao = useCallback(async () => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setAuthError(error.message);
    }
    // 성공 시 카카오 인증 페이지로 리다이렉트되므로 이후 처리는 없음.
  }, [supabase]);

  const sendPhoneOtp = useCallback(
    async (phone: string) => {
      setAuthError(null);
      const { error } = await supabase.auth.signInWithOtp({
        phone: toE164Phone(phone),
      });
      if (error) {
        setAuthError(error.message);
        return false;
      }
      return true;
    },
    [supabase],
  );

  const verifyPhoneOtp = useCallback(
    async (phone: string, token: string) => {
      setAuthError(null);
      const { error } = await supabase.auth.verifyOtp({
        phone: toE164Phone(phone),
        token,
        type: "sms",
      });
      if (error) {
        setAuthError(error.message);
        return false;
      }
      setLoginOpen(false);
      return true;
    },
    [supabase],
  );

  const refreshProfile = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;
    setUser(await fetchProfile(supabase, session.user.id));
  }, [supabase]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        isLoginOpen,
        openLogin: () => {
          setAuthError(null);
          setLoginOpen(true);
        },
        closeLogin: () => setLoginOpen(false),
        login,
        signup,
        logout,
        refreshProfile,
        loginWithKakao,
        sendPhoneOtp,
        verifyPhoneOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
