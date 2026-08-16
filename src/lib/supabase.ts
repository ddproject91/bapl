import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/** 서버 전용 Supabase 클라이언트(service role). 클라이언트 번들에 노출되지 않음. */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!cached) {
    cached = createClient(url, key, { auth: { persistSession: false } });
  }
  return cached;
}
