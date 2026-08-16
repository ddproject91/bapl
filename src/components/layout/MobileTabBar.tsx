"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "home", href: "/", icon: "🏠" },
  { key: "models", href: "/models", icon: "🏍️" },
  { key: "market", href: "/market", icon: "🏷️" },
  { key: "community", href: "/community", icon: "💬" },
  { key: "my", href: "/my", icon: "👤" },
] as const;

/** 모바일 하단 탭바 (모바일 퍼스트) */
export function MobileTabBar() {
  const t = useTranslations("common");
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/90 backdrop-blur-lg md:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {TABS.map((tab) => {
          const active = isActive(tab.href);
          return (
            <li key={tab.key}>
              <Link
                href={tab.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
                  active ? "text-neon" : "text-fg-subtle",
                )}
              >
                <span className={cn("text-lg", active && "drop-shadow-[0_0_8px_var(--neon-glow)]")}>
                  {tab.icon}
                </span>
                {t(`nav.${tab.key}`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
