import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Phase 0: 목업 이미지는 원격 플레이스홀더 허용
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    // 기본값 1MB는 데스크톱 사진 업로드에 너무 작음 (서버 액션 업로드 용량 검증은 5MB 기준).
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default withNextIntl(nextConfig);
