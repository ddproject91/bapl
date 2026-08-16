"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { DiagnosisFlow } from "@/lib/types";
import { Card } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function DiagnosisTool({ flows }: { flows: DiagnosisFlow[] }) {
  const t = useTranslations("garage.diagnosis");
  const [openId, setOpenId] = useState<string | null>(flows[0]?.id ?? null);

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-fg-muted">{t("selectSymptom")}</p>
      <div className="space-y-2.5">
        {flows.map((flow) => {
          const open = openId === flow.id;
          return (
            <Card key={flow.id} className="overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : flow.id)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-bg-elevated"
              >
                <span className="flex items-center gap-2.5 font-bold">
                  <span
                    aria-hidden
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
                      open
                        ? "bg-neon/15 text-neon"
                        : "bg-bg-elevated text-fg-subtle",
                    )}
                  >
                    ⚠
                  </span>
                  {flow.symptom}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "shrink-0 text-fg-subtle transition-transform",
                    open && "rotate-180",
                  )}
                >
                  ▾
                </span>
              </button>
              {open && (
                <div className="border-t border-border px-5 py-4">
                  <p className="mb-3 text-xs font-bold text-neon">
                    {t("causesTitle")}
                  </p>
                  <ul className="space-y-3">
                    {flow.causes.map((c, i) => (
                      <li
                        key={i}
                        className="rounded-xl border border-border bg-bg-elevated p-3.5"
                      >
                        <p className="text-sm font-semibold">
                          <span className="mr-1.5 text-[11px] font-bold text-fg-subtle">
                            {t("cause")}
                          </span>
                          {c.cause}
                        </p>
                        <p className="mt-1.5 text-xs text-fg-muted">
                          <span className="mr-1.5 text-[11px] font-bold text-neon">
                            {t("action")}
                          </span>
                          {c.action}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      <p className="pt-1 text-[11px] text-fg-subtle">{t("disclaimer")}</p>
    </div>
  );
}
