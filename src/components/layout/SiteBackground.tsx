import Image from "next/image";
import { getBikePhotos } from "@/data/mock/media";
import { BikeBlueprint } from "@/components/brand/BikeMotifs";

/**
 * 전역 고정 배경 — 흐릿한 바이크 사진 + 블루프린트 워터마크 + 네온 글로우.
 * 라이트 테마 가독성 위해 사진은 저투명도 + 화이트 그라디언트 오버레이.
 * 사진 URL이 없으면 그래픽만으로 폴백.
 */
export async function SiteBackground() {
  const bikePhotos = await getBikePhotos();
  const hero = bikePhotos.hero;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* 베이스 컬러 */}
      <div className="absolute inset-0 bg-bg" />

      {/* 흐릿한 바이크 사진 */}
      {hero && (
        <Image
          src={hero}
          alt=""
          fill
          sizes="100vw"
          className="scale-110 object-cover opacity-[0.14] blur-2xl"
        />
      )}

      {/* 가독성 확보용 그라디언트 오버레이 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--bg) 78%, transparent) 0%, color-mix(in srgb, var(--bg) 92%, transparent) 45%, var(--bg) 100%)",
        }}
      />

      {/* 네온 글로우 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 88% -8%, var(--neon-glow) 0%, transparent 45%), radial-gradient(60% 45% at -5% 108%, var(--neon-glow) 0%, transparent 50%)",
          opacity: 0.7,
        }}
      />

      {/* 블루프린트 바이크 워터마크 */}
      <BikeBlueprint className="absolute -right-10 bottom-10 w-[520px] max-w-[70vw] text-fg opacity-[0.05]" />
    </div>
  );
}
