import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getGarageFaq } from "@/data/mock/garage";
import { PageHeader, Card } from "@/components/ui/primitives";

export const revalidate = 300;

export default async function FaqPage() {
  const t = await getTranslations("garage");
  const faq = await getGarageFaq();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title={t("faq.title")}
        description={t("faq.description")}
        action={
          <Link
            href="/garage"
            className="text-xs font-medium text-fg-muted transition-colors hover:text-neon"
          >
            ← {t("backToHub")}
          </Link>
        }
      />

      <div className="mt-6 space-y-2.5">
        {faq.map((item, i) => (
          <Card key={i} as="div" className="overflow-hidden">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-bold transition-colors hover:bg-bg-elevated">
                <span className="flex items-center gap-2.5">
                  <span className="text-neon" aria-hidden>
                    Q
                  </span>
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className="shrink-0 text-fg-subtle transition-transform group-open:rotate-180"
                >
                  ▾
                </span>
              </summary>
              <div className="border-t border-border px-5 py-4 text-sm text-fg-muted">
                {item.a}
              </div>
            </details>
          </Card>
        ))}
      </div>

      <div className="h-8" />
    </div>
  );
}
