import { getContent } from "@/lib/content";

export interface PopupBanner {
  enabled: boolean;
  imageUrl: string;
  linkUrl: string;
}

export const popupBannerFallback: PopupBanner = {
  enabled: false,
  imageUrl: "",
  linkUrl: "",
};

export async function getPopupBanner(): Promise<PopupBanner> {
  return getContent("site.popupBanner", popupBannerFallback);
}

export interface MainBanner {
  enabled: boolean;
  /** PC용 이미지 — 권장 1920×480 (4:1) */
  pcImageUrl: string;
  /** 모바일용 이미지 — 권장 1080×1080 (1:1) */
  mobileImageUrl: string;
  linkUrl: string;
}

export const mainBannerFallback: MainBanner = {
  enabled: false,
  pcImageUrl: "",
  mobileImageUrl: "",
  linkUrl: "",
};

export async function getMainBanner(): Promise<MainBanner> {
  return getContent("site.mainBanner", mainBannerFallback);
}
