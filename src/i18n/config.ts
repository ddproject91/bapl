/**
 * i18n 설정 — ko 기본, en 확장 대비.
 * 메시지는 섹션별 네임스페이스 파일로 분리(src/messages/<locale>/<namespace>.json).
 * Phase 0에서는 ko만 채워진다. en은 Phase 5에서 채운다(구조만 대비).
 * 정적 import 맵을 쓰는 이유: 동적 import 템플릿은 alias/turbopack 환경에서
 * 네임스페이스 누락(MISSING_MESSAGE)을 유발하므로 명시적으로 등록한다.
 */
import koCommon from "@/messages/ko/common.json";
import koAuth from "@/messages/ko/auth.json";
import koHome from "@/messages/ko/home.json";
import koBrands from "@/messages/ko/brands.json";
import koModels from "@/messages/ko/models.json";
import koCommunity from "@/messages/ko/community.json";
import koRiding from "@/messages/ko/riding.json";
import koMarket from "@/messages/ko/market.json";
import koGarage from "@/messages/ko/garage.json";
import koMy from "@/messages/ko/my.json";
import koNews from "@/messages/ko/news.json";
import koSearch from "@/messages/ko/search.json";

export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

const MESSAGES: Record<Locale, Record<string, unknown>> = {
  ko: {
    common: koCommon,
    auth: koAuth,
    home: koHome,
    brands: koBrands,
    models: koModels,
    community: koCommunity,
    riding: koRiding,
    market: koMarket,
    garage: koGarage,
    my: koMy,
    news: koNews,
    search: koSearch,
  },
  // Phase 5에서 en 파일을 추가하면 여기에 매핑. 지금은 ko로 폴백.
  en: {},
};

export async function getMessages(locale: Locale) {
  const base = MESSAGES[defaultLocale];
  const override = MESSAGES[locale] ?? {};
  return { ...base, ...override };
}
