import Image from "next/image";
import Link from "next/link";
import { getMainBanner } from "@/data/mock/site";

/** 홈 최상단 메인 배너 — PC/모바일 이미지를 각각 노출(한쪽만 등록 시 공용 사용). */
export async function MainBanner() {
  const banner = await getMainBanner();
  if (!banner.enabled) return null;

  const pc = banner.pcImageUrl || banner.mobileImageUrl;
  const mobile = banner.mobileImageUrl || banner.pcImageUrl;
  if (!pc && !mobile) return null;

  const images = (
    <>
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl md:hidden">
        <Image src={mobile} alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="relative hidden aspect-[4/1] w-full overflow-hidden rounded-2xl md:block">
        <Image src={pc} alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
    </>
  );

  return (
    <section className="pt-4">
      {banner.linkUrl ? (
        <Link href={banner.linkUrl} className="block">
          {images}
        </Link>
      ) : (
        images
      )}
    </section>
  );
}
