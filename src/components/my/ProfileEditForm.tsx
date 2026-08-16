"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { uploadAvatarAction } from "@/components/auth/actions";
import { Card, PageHeader } from "@/components/ui/primitives";

export function ProfileEditForm({ welcome = false }: { welcome?: boolean }) {
  const t = useTranslations("my");
  const { user, openLogin, refreshProfile } = useAuth();
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [region, setRegion] = useState(user?.region ?? "");
  const [bikeModel, setBikeModel] = useState(user?.bikeModel ?? "");
  const [gender, setGender] = useState<string>(user?.gender ?? "");
  const [birthYear, setBirthYear] = useState<string>(
    user?.birthYear ? String(user.birthYear) : "",
  );
  const [ridingSince, setRidingSince] = useState<string>(
    user?.ridingSince ? String(user.ridingSince) : "",
  );
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <span className="mb-4 block text-4xl">🔑</span>
        <h1 className="text-xl font-black">{t("loginRequired.title")}</h1>
        <p className="mt-2 text-sm text-fg-muted">{t("loginRequired.desc")}</p>
        <button
          type="button"
          onClick={openLogin}
          className="mt-6 rounded-xl bg-neon px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.03] active:scale-95"
        >
          {t("loginRequired.button")}
        </button>
      </div>
    );
  }

  async function onAvatarSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError(null);
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadAvatarAction(formData);
      if (result.ok) {
        setAvatarUrl(result.url);
      } else {
        setAvatarError(result.error);
      }
    } catch {
      setAvatarError("업로드에 실패했습니다. 파일 크기를 확인하고 다시 시도해주세요.");
    } finally {
      setAvatarUploading(false);
    }
  }

  async function save() {
    if (!user) return;
    setSaving(true);
    setMessage(null);
    const { error } = await supabase
      .from("profiles")
      .update({
        nickname: nickname.trim() || user.nickname,
        region: region.trim(),
        bike_model: bikeModel.trim(),
        avatar_url: avatarUrl,
        gender,
        birth_year: Number(birthYear) || 0,
        riding_since: Number(ridingSince) || 0,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      setMessage({ type: "error", text: t("edit.error") });
      return;
    }
    await refreshProfile();
    router.push("/my");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <PageHeader
        title={welcome ? t("edit.welcomeTitle") : t("edit.title")}
        description={welcome ? t("edit.welcomeDescription") : t("edit.description")}
      />

      <Card className="mt-6 p-5 md:p-6">
        <div className="mb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-bg-elevated text-fg-subtle"
          >
            {avatarUrl ? (
              <Image src={avatarUrl} alt="" fill sizes="64px" className="object-cover" />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </button>
          <div className="min-w-0">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={onAvatarSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarUploading}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-border-strong disabled:opacity-50"
            >
              {avatarUploading
                ? t("edit.avatarUploading")
                : avatarUrl
                  ? t("edit.avatarChange")
                  : t("edit.avatarSelect")}
            </button>
            {avatarError && <p className="mt-1 text-[11px] text-danger">{avatarError}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-fg-muted">{t("edit.nickname")}</span>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-fg-muted">{t("edit.region")}</span>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder={t("edit.regionPlaceholder")}
              className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-fg-muted">{t("edit.bikeModel")}</span>
            <input
              type="text"
              value={bikeModel}
              onChange={(e) => setBikeModel(e.target.value)}
              placeholder={t("edit.bikeModelPlaceholder")}
              className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-fg-muted">{t("edit.gender")}</span>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
              >
                <option value="">{t("edit.genderUnset")}</option>
                <option value="male">{t("edit.genderMale")}</option>
                <option value="female">{t("edit.genderFemale")}</option>
                <option value="other">{t("edit.genderOther")}</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-fg-muted">{t("edit.birthYear")}</span>
              <input
                type="number"
                inputMode="numeric"
                min={1930}
                max={new Date().getFullYear()}
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder={t("edit.birthYearPlaceholder")}
                className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-fg-muted">{t("edit.ridingSince")}</span>
            <input
              type="number"
              inputMode="numeric"
              min={1970}
              max={new Date().getFullYear()}
              value={ridingSince}
              onChange={(e) => setRidingSince(e.target.value)}
              placeholder={t("edit.ridingSincePlaceholder")}
              className="rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
            />
          </label>
        </div>

        {message && (
          <p
            className={
              "mt-3 text-xs font-medium " +
              (message.type === "ok" ? "text-neon" : "text-danger")
            }
          >
            {message.text}
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex-1 rounded-xl bg-neon py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40"
          >
            {saving
              ? t("edit.saving")
              : welcome
                ? t("edit.welcomeSubmit")
                : t("edit.save")}
          </button>
          <button
            type="button"
            onClick={() => router.push("/my")}
            className="rounded-xl border border-border-strong px-5 py-2.5 text-sm font-bold text-fg-muted transition-colors hover:border-neon/50 hover:text-neon"
          >
            {welcome ? t("edit.welcomeSkip") : t("edit.cancel")}
          </button>
        </div>
      </Card>
    </div>
  );
}
