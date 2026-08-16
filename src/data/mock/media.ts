/**
 * Phase 0 데모용 배경/배너 이미지 URL. 라이선스-free 스톡 바이크 사진(Unsplash 등).
 * 모델별 이미지는 각 모델 데이터의 imageUrl 필드로 관리한다(@/data/mock/models).
 *
 * ⚠ 모든 URL은 https + 실제 200/image 응답 검증 필수(깨진 이미지 방지).
 *   - 배경: Unsplash 직접 CDN(images.unsplash.com), 검증 완료.
 */

import { getContent } from "@/lib/content";

export interface BikePhotos {
  /** 홈 히어로/전역 배경용 와이드 바이크 사진 */
  hero: string;
  /** 브랜드관 배너용 바이크 사진 */
  brandsBanner: string;
  /** 섹션 앰비언트/서브 배경용 추가 사진 */
  ambient: string[];
}

export const bikePhotosFallback: BikePhotos = {
  hero: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1600&q=70",
  brandsBanner:
    "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1600&q=70",
  ambient: [
    "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=1600&q=70",
    "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=1600&q=70",
  ],
};

export async function getBikePhotos(): Promise<BikePhotos> {
  return getContent("media.bikePhotos", bikePhotosFallback);
}
