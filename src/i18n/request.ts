import { getRequestConfig } from "next-intl/server";
import { defaultLocale, getMessages } from "@/i18n/config";

/**
 * Phase 0: 라우팅 없는 단일 로케일(ko) 구성.
 * Phase 5에서 en 실적용 시 locale 협상 로직만 여기 추가.
 */
export default getRequestConfig(async () => {
  const locale = defaultLocale;
  return {
    locale,
    messages: await getMessages(locale),
  };
});
