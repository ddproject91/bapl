"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-baseline gap-0.5", className)}
      aria-label="BAPL 홈"
    >
      <span className="text-xl font-black tracking-tighter text-fg">BA</span>
      <span className="text-xl font-black tracking-tighter text-neon drop-shadow-[0_0_10px_var(--neon-glow)]">
        PL
      </span>
    </Link>
  );
}

export function Header() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const { user, openLogin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        {/* 모바일 메뉴 토글 */}
        <button
          type="button"
          className="-ml-1.5 flex h-11 w-11 flex-col items-center justify-center rounded-lg text-fg-muted md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="메뉴"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-menu"
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
        </button>

        <Logo />

        {/* 데스크톱 GNB */}
        <nav className="ml-4 hidden flex-1 items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "text-neon"
                  : "text-fg-muted hover:text-fg",
              )}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <Link
            href="/search"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-fg-muted transition-colors hover:text-fg"
            aria-label={t("nav.search")}
          >
            <SearchIcon />
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/my"
                className="flex items-center gap-2 rounded-full border border-border bg-bg-elevated py-1 pl-1 pr-3 text-sm transition-colors hover:border-neon/40"
              >
                <span className="relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neon/20 text-xs font-bold text-neon">
                  {user.avatarUrl ? (
                    <Image src={user.avatarUrl} alt="" fill sizes="24px" className="object-cover" />
                  ) : (
                    user.nickname.slice(0, 1)
                  )}
                </span>
                <span className="hidden font-medium sm:inline">
                  {user.nickname}
                </span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-lg px-2 py-2 text-xs text-fg-subtle hover:text-fg sm:block"
              >
                {t("action.logout")}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openLogin}
              className="rounded-lg bg-neon px-3.5 py-1.5 text-sm font-bold text-black transition-transform hover:scale-[1.03] active:scale-95"
            >
              {t("action.login")}
            </button>
          )}
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {mobileOpen && (
        <nav id="mobile-nav-menu" className="border-t border-border bg-bg-elevated md:hidden">
          <ul className="mx-auto max-w-6xl px-2 py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium",
                    isActive(item.href)
                      ? "bg-neon/10 text-neon"
                      : "text-fg hover:bg-bg-card",
                  )}
                >
                  <span>{t(`nav.${item.key}`)}</span>
                  <span className="text-xs text-fg-subtle">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
