import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * 관리자에서 편집 가능한 콘텐츠 컬렉션 키 목록.
 * site_content(key, data) 1행 = 컬렉션 1개(배열 또는 객체 전체).
 */
export const CONTENT_KEYS = [
  "brands",
  "models",
  "news",
  "community.boards",
  "community.posts",
  "community.comments",
  "market.listings",
  "market.groupbuyMeta",
  "market.auctionMeta",
  "riding.meetups",
  "riding.courses",
  "riding.events",
  "riding.places",
  "riding.tourPackages",
  "garage.maintenanceGuides",
  "garage.consumableCycles",
  "garage.repairCosts",
  "garage.diagnosisFlows",
  "garage.faq",
  "garage.shopPreviews",
  "media.bikePhotos",
  "site.popupBanner",
  "site.mainBanner",
] as const;

export type ContentKey = (typeof CONTENT_KEYS)[number];

/** Supabase에서 컬렉션을 읽는다. 미설정/실패 시 fallback(목업)을 그대로 반환. */
export async function getContent<T>(key: ContentKey, fallback: T): Promise<T> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return fallback;

  const read = unstable_cache(
    async () => {
      const client = getSupabaseAdmin();
      if (!client) return null;
      const { data, error } = await client
        .from("site_content")
        .select("data")
        .eq("key", key)
        .maybeSingle();
      if (error || !data) return null;
      return data.data as T;
    },
    ["site-content", key],
    { tags: ["content", `content:${key}`] },
  );

  const result = await read();
  return result ?? fallback;
}

/** 관리자 저장 전용: 컬렉션 전체를 덮어쓰고 캐시를 무효화한다. */
export async function setContent(key: ContentKey, data: unknown): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다 (환경변수 확인 필요)");
  }
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, data, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
  revalidateTag(`content:${key}`, "max");
  revalidateTag("content", "max");
}

export interface ContentRow {
  key: string;
  data: unknown;
  updated_at: string;
}

/** 관리자 UI에서 컬렉션 목록/현재 값을 보여줄 때 사용. */
export async function getAllContent(): Promise<Record<string, ContentRow>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return {};
  const { data, error } = await supabase.from("site_content").select("key, data, updated_at");
  if (error || !data) return {};
  return Object.fromEntries(data.map((row) => [row.key, row as ContentRow]));
}
