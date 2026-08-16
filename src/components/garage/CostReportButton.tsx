"use client";

import { useTranslations } from "next-intl";

export function CostReportButton() {
  const t = useTranslations("garage.costs");
  return (
    <button
      type="button"
      onClick={() => alert(t("reportDemo"))}
      className="rounded-xl border border-border-strong px-4 py-2 text-xs font-bold transition-colors hover:border-neon/50 hover:text-neon"
    >
      + {t("report")}
    </button>
  );
}
