"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/ui/primitives";

const TYPES = ["dealer", "brand", "local", "partnership", "other"] as const;
type InquiryType = (typeof TYPES)[number];

export function PartnershipInquiryForm() {
  const t = useTranslations("partnership");
  const { user } = useAuth();
  const [supabase] = useState(() => createClient());

  const [name, setName] = useState(user?.nickname ?? "");
  const [contact, setContact] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState<InquiryType>("dealer");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit() {
    if (!name.trim() || !contact.trim() || !message.trim()) {
      setError(t("form.validation"));
      return;
    }
    setSubmitting(true);
    setError(null);
    const { error: err } = await supabase.from("partner_inquiries").insert({
      user_id: user?.id ?? null,
      name: name.trim(),
      contact: contact.trim(),
      company: company.trim() || null,
      inquiry_type: type,
      message: message.trim(),
    });
    setSubmitting(false);
    if (err) {
      setError(t("form.error"));
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-dashed border-border-strong bg-bg-card px-6 py-16 text-center">
        <span className="mb-4 text-4xl">✅</span>
        <p className="text-sm text-fg-muted">{t("form.success")}</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")} />
      <div className="mt-6 flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-fg-muted">{t("form.name")}</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("form.namePlaceholder")}
            className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-fg-muted">{t("form.contact")}</span>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={t("form.contactPlaceholder")}
            className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-fg-muted">{t("form.company")}</span>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={t("form.companyPlaceholder")}
            className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-fg-muted">{t("form.typeLabel")}</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as InquiryType)}
            className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
          >
            {TYPES.map((key) => (
              <option key={key} value={key}>
                {t(`form.type.${key}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-fg-muted">{t("form.message")}</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            placeholder={t("form.messagePlaceholder")}
            className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
          />
        </label>
        {error && <p className="text-xs font-medium text-danger">{error}</p>}
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="mt-2 self-start rounded-xl bg-neon px-5 py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-40"
        >
          {submitting ? t("form.submitting") : t("form.submit")}
        </button>
      </div>
    </div>
  );
}
