import type { ContentKey } from "@/lib/content";
import { brandsFallback } from "@/data/mock/brands";
import { modelsFallback } from "@/data/mock/models";
import { newsFallback } from "@/data/mock/news";
import { boardsFallback, postsFallback, commentsFallback } from "@/data/mock/community";
import { listingsFallback, groupbuyMetaFallback, auctionMetaFallback } from "@/data/mock/market";
import {
  meetupsFallback,
  coursesFallback,
  eventsFallback,
  placesFallback,
  tourPackagesFallback,
} from "@/data/mock/riding";
import {
  maintenanceGuidesFallback,
  consumableCyclesFallback,
  repairCostsFallback,
  diagnosisFlowsFallback,
  faqFallback,
  shopPreviewsFallback,
} from "@/data/mock/garage";
import { bikePhotosFallback } from "@/data/mock/media";
import { popupBannerFallback, mainBannerFallback } from "@/data/mock/site";

/** 관리자 화면에서 컬렉션이 아직 Supabase에 저장되지 않았을 때 보여줄 초기값. */
export const FALLBACKS: Record<ContentKey, unknown> = {
  brands: brandsFallback,
  models: modelsFallback,
  news: newsFallback,
  "community.boards": boardsFallback,
  "community.posts": postsFallback,
  "community.comments": commentsFallback,
  "market.listings": listingsFallback,
  "market.groupbuyMeta": groupbuyMetaFallback,
  "market.auctionMeta": auctionMetaFallback,
  "riding.meetups": meetupsFallback,
  "riding.courses": coursesFallback,
  "riding.events": eventsFallback,
  "riding.places": placesFallback,
  "riding.tourPackages": tourPackagesFallback,
  "garage.maintenanceGuides": maintenanceGuidesFallback,
  "garage.consumableCycles": consumableCyclesFallback,
  "garage.repairCosts": repairCostsFallback,
  "garage.diagnosisFlows": diagnosisFlowsFallback,
  "garage.faq": faqFallback,
  "garage.shopPreviews": shopPreviewsFallback,
  "media.bikePhotos": bikePhotosFallback,
  "site.popupBanner": popupBannerFallback,
  "site.mainBanner": mainBannerFallback,
};
