import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const c = await getTranslations("common");
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-mono text-6xl font-black text-neon drop-shadow-[0_0_16px_var(--neon-glow)]">
        404
      </p>
      <p className="mt-4 text-lg font-bold">페이지를 찾을 수 없습니다</p>
      <p className="mt-1 text-sm text-fg-muted">
        요청하신 경로가 존재하지 않거나 준비 중입니다.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-neon px-5 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.03] active:scale-95"
      >
        {c("nav.home")} →
      </Link>
    </div>
  );
}
