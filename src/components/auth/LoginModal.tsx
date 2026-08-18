"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import { uploadAvatarAction } from "@/components/auth/actions";

export function LoginModal() {
  const t = useTranslations("auth");
  const {
    isLoginOpen,
    closeLogin,
    login,
    signup,
    authError,
    loginWithKakao,
    sendPhoneOtp,
    verifyPhoneOtp,
  } = useAuth();
  const [mode, setMode] = useState<"login" | "signup" | "phone">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [bikeModel, setBikeModel] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [phoneSubmitting, setPhoneSubmitting] = useState(false);

  const onAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  useEffect(() => {
    if (!isLoginOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeLogin();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isLoginOpen, closeLogin]);

  if (!isLoginOpen) return null;

  const submit = async () => {
    setSubmitting(true);
    if (mode === "login") {
      await login(email, password);
    } else {
      await signup(email, password, nickname, bikeModel, avatarUrl);
    }
    setSubmitting(false);
  };

  async function requestOtp() {
    setPhoneSubmitting(true);
    const ok = await sendPhoneOtp(phone);
    setPhoneSubmitting(false);
    if (ok) setOtpSent(true);
  }

  async function confirmOtp() {
    setPhoneSubmitting(true);
    await verifyPhoneOtp(phone, otpCode);
    setPhoneSubmitting(false);
  }

  function backToEmail() {
    setMode("login");
    setPhone("");
    setOtpCode("");
    setOtpSent(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm"
      onClick={closeLogin}
    >
      <div className="flex min-h-full items-end justify-center md:items-center md:p-4">
      <div
        className="animate-fade-up w-full max-w-sm rounded-t-3xl border border-border bg-bg-card p-6 md:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 text-center">
          <div className="mb-1 inline-flex items-baseline gap-0.5">
            <span className="text-2xl font-black tracking-tighter">BA</span>
            <span className="text-2xl font-black tracking-tighter text-neon">
              PL
            </span>
          </div>
          <p className="text-xs text-fg-muted">{t("modal.subtitle")}</p>
        </div>

        {mode !== "phone" ? (
        <>
        {mode === "signup" && (
          <>
            <div className="mb-4 flex items-center gap-3">
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
                    ? t("modal.avatarUploading")
                    : avatarUrl
                      ? t("modal.avatarChange")
                      : t("modal.avatarSelect")}
                </button>
                <p className="mt-1 text-[11px] text-fg-subtle">{t("modal.avatarHint")}</p>
                {avatarError && (
                  <p className="mt-1 text-[11px] text-danger">{avatarError}</p>
                )}
              </div>
            </div>

            <label className="mb-1 block text-xs font-medium text-fg-muted">
              {t("modal.nickname")}
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={t("modal.nicknamePlaceholder")}
              className="mb-3 w-full rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
            />

            <label className="mb-1 block text-xs font-medium text-fg-muted">
              {t("modal.bikeModel")}
            </label>
            <input
              type="text"
              value={bikeModel}
              onChange={(e) => setBikeModel(e.target.value)}
              placeholder={t("modal.bikeModelPlaceholder")}
              className="mb-3 w-full rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
            />

            <label className="mb-4 flex items-start gap-2 text-xs text-fg-muted">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              <span>
                (필수){" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="font-medium text-fg underline hover:text-neon"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t("modal.agreeTerms")}
                </Link>{" "}
                {t("modal.agreeAnd")}{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="font-medium text-fg underline hover:text-neon"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t("modal.agreePrivacy")}
                </Link>
                에 동의합니다.
              </span>
            </label>
          </>
        )}

        <label className="mb-1 block text-xs font-medium text-fg-muted">
          {t("modal.email")}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("modal.emailPlaceholder")}
          className="mb-3 w-full rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
        />
        <label className="mb-1 block text-xs font-medium text-fg-muted">
          {t("modal.password")}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("modal.passwordPlaceholder")}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="mb-4 w-full rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
        />

        {authError && (
          <p className="mb-3 rounded-lg bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
            {authError}
          </p>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={
            submitting ||
            !email ||
            !password ||
            (mode === "signup" && (!nickname || !agreed))
          }
          className="w-full rounded-xl bg-neon py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
        >
          {submitting
            ? t("modal.loading")
            : mode === "login"
              ? t("modal.loginButton")
              : t("modal.signupButton")}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-3 w-full text-center text-xs font-medium text-fg-muted hover:text-neon"
        >
          {mode === "login" ? t("modal.noAccount") : t("modal.haveAccount")}{" "}
          <span className="text-neon">
            {mode === "login" ? t("modal.signup") : t("modal.login")}
          </span>
        </button>

        <div className="my-4 flex items-center gap-3 text-[11px] text-fg-subtle">
          <span className="h-px flex-1 bg-border" />
          {t("modal.orDivider")}
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={loginWithKakao}
            className="w-full rounded-xl bg-[#FEE500] py-2.5 text-sm font-bold text-[#191600] transition-transform hover:scale-[1.02] active:scale-95"
          >
            {t("modal.kakao")}
          </button>
          <button
            type="button"
            onClick={() => setMode("phone")}
            className="w-full rounded-xl border border-border-strong py-2.5 text-sm font-bold transition-colors hover:border-neon/50 hover:text-neon"
          >
            {t("modal.phone")}
          </button>
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-border-strong bg-white/40 py-2.5 text-sm font-bold text-[#1a1a1a]/50"
          >
            {t("modal.google")}
          </button>
        </div>

        <p className="mt-3 text-center text-[10px] leading-relaxed text-fg-subtle">
          {t("modal.socialAgreeNote")}
        </p>
        </>
        ) : (
        <>
          <p className="mb-4 text-center text-xs text-fg-muted">{t("modal.phoneHint")}</p>

          <label className="mb-1 block text-xs font-medium text-fg-muted">
            {t("modal.phoneLabel")}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("modal.phonePlaceholder")}
            disabled={otpSent}
            className="mb-3 w-full rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon disabled:opacity-60"
          />

          {otpSent && (
            <>
              <label className="mb-1 block text-xs font-medium text-fg-muted">
                {t("modal.otpLabel")}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder={t("modal.otpPlaceholder")}
                onKeyDown={(e) => e.key === "Enter" && confirmOtp()}
                className="mb-3 w-full rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-sm outline-none focus:border-neon"
              />
            </>
          )}

          {authError && (
            <p className="mb-3 rounded-lg bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
              {authError}
            </p>
          )}

          {!otpSent ? (
            <button
              type="button"
              onClick={requestOtp}
              disabled={phoneSubmitting || !phone}
              className="w-full rounded-xl bg-neon py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
            >
              {phoneSubmitting ? t("modal.loading") : t("modal.sendOtp")}
            </button>
          ) : (
            <button
              type="button"
              onClick={confirmOtp}
              disabled={phoneSubmitting || !otpCode}
              className="w-full rounded-xl bg-neon py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
            >
              {phoneSubmitting ? t("modal.loading") : t("modal.verifyOtp")}
            </button>
          )}

          {otpSent && (
            <button
              type="button"
              onClick={requestOtp}
              disabled={phoneSubmitting}
              className="mt-3 w-full text-center text-xs font-medium text-fg-muted hover:text-neon disabled:opacity-50"
            >
              {t("modal.resendOtp")}
            </button>
          )}

          <button
            type="button"
            onClick={backToEmail}
            className="mt-3 w-full text-center text-xs font-medium text-fg-muted hover:text-neon"
          >
            {t("modal.backToEmail")}
          </button>
        </>
        )}
      </div>
      </div>
    </div>
  );
}
