import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { NAV_ITEMS } from "@/lib/nav";
import { BUSINESS_INFO } from "@/lib/businessInfo";

/** 공식 채널 주소 — 주소가 비어 있으면 링크 없이 텍스트로만 표시된다. */
const CHANNEL_LINKS: Record<"instagram" | "youtube" | "blog", string> = {
  instagram: "",
  youtube: "https://www.youtube.com/@bapl_official",
  blog: "",
};

export async function Footer() {
  const t = await getTranslations("common");

  return (
    <footer className="mt-16 border-t border-border bg-bg-elevated">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="inline-flex items-baseline gap-0.5">
              <span className="text-lg font-black tracking-tighter">BA</span>
              <span className="text-lg font-black tracking-tighter text-neon">
                PL
              </span>
            </div>
            <p className="mt-1 text-[11px] font-medium tracking-widest text-fg-subtle">
              {t("brand.tagline")}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-fg-muted">
              {t("brand.description")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="mb-2 text-xs font-bold text-fg">메뉴</p>
              <ul className="space-y-1.5">
                {NAV_ITEMS.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="text-xs text-fg-muted hover:text-neon"
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold text-fg">BAPL</p>
              <ul className="space-y-1.5 text-xs text-fg-muted">
                <li>{t("footer.about")}</li>
                <li>
                  <Link href="/terms" className="hover:text-neon">
                    {t("footer.terms")}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="font-medium text-fg hover:text-neon">
                    {t("footer.privacy")}
                  </Link>
                </li>
                <li>
                  <Link href="/partnership" className="hover:text-neon">
                    {t("footer.contact")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold text-fg">
                {t("footer.channels")}
              </p>
              <ul className="space-y-1.5 text-xs text-fg-muted">
                {(["instagram", "youtube", "blog"] as const).map((key) => {
                  const href = CHANNEL_LINKS[key];
                  return (
                    <li key={key}>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-neon"
                        >
                          {t(`footer.${key}`)}
                        </a>
                      ) : (
                        t(`footer.${key}`)
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-5">
          <p className="rounded-lg bg-warning/10 px-3 py-2 text-[11px] leading-relaxed text-warning/90">
            ⚠ {t("footer.notice")}
          </p>
          <p className="mt-3 text-[11px] leading-relaxed text-fg-subtle">
            {BUSINESS_INFO.companyName} · 대표 {BUSINESS_INFO.representativeName} · 사업자등록번호{" "}
            {BUSINESS_INFO.businessRegistrationNumber} · 통신판매업 신고번호{" "}
            {BUSINESS_INFO.mailOrderRegistrationNumber}
            <br />
            {BUSINESS_INFO.address} · 개인정보보호책임자 {BUSINESS_INFO.privacyOfficerName} (
            {BUSINESS_INFO.privacyOfficerContact})
          </p>
          <p className="mt-3 text-[11px] text-fg-subtle">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
