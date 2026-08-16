"use client";

import { useState } from "react";
import { saveCollectionAction, uploadImageAction } from "../actions";

interface BikePhotos {
  hero: string;
  brandsBanner: string;
  ambient: string[];
}

export function BikePhotosEditor({ initialData }: { initialData: BikePhotos }) {
  const [data, setData] = useState<BikePhotos>(initialData);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  function setField(patch: Partial<BikePhotos>) {
    setData((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  }

  function setAmbient(index: number, url: string) {
    setData((prev) => {
      const next = [...prev.ambient];
      next[index] = url;
      return { ...prev, ambient: next };
    });
    setDirty(true);
  }

  function addAmbient() {
    setData((prev) => ({ ...prev, ambient: [...prev.ambient, ""] }));
    setDirty(true);
  }

  function removeAmbient(index: number) {
    setData((prev) => ({ ...prev, ambient: prev.ambient.filter((_, i) => i !== index) }));
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    const result = await saveCollectionAction("media.bikePhotos", data);
    setSaving(false);
    if (result.ok) {
      setDirty(false);
      setMessage({ type: "ok", text: "저장했습니다. 사이트에 반영되었습니다." });
    } else {
      setMessage({ type: "error", text: result.error });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          className="rounded-lg bg-neon px-4 py-2 text-xs font-bold text-black disabled:opacity-40"
        >
          {saving ? "저장 중..." : "저장"}
        </button>
        {message && (
          <span
            className={`text-xs font-medium ${message.type === "ok" ? "text-neon" : "text-danger"}`}
          >
            {message.text}
          </span>
        )}
      </div>

      <ImageField
        label="hero (홈 히어로 / 전역 배경)"
        hint="홈 화면 상단과 전 페이지 배경에 흐릿하게 깔리는 사진입니다."
        value={data.hero}
        onChange={(url) => setField({ hero: url })}
      />

      <ImageField
        label="brandsBanner (브랜드관 배너)"
        hint="브랜드관 페이지 상단 배너에 쓰이는 사진입니다."
        value={data.brandsBanner}
        onChange={(url) => setField({ brandsBanner: url })}
      />

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold text-fg">ambient (섹션 앰비언트 사진들)</span>
          <button
            type="button"
            onClick={addAmbient}
            className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-medium hover:border-border-strong"
          >
            + 사진 추가
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {data.ambient.map((url, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1">
                <ImageField
                  label={`ambient[${i}]`}
                  value={url}
                  onChange={(next) => setAmbient(i, next)}
                />
              </div>
              <button
                type="button"
                onClick={() => removeAmbient(i)}
                className="mt-6 rounded-lg px-2 py-1 text-xs text-fg-subtle hover:text-danger"
              >
                ✕
              </button>
            </div>
          ))}
          {data.ambient.length === 0 && (
            <p className="text-xs text-fg-subtle">등록된 사진이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ImageField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImageAction(formData);
      if (result.ok) {
        onChange(result.url);
      } else {
        setError(result.error);
      }
    } catch {
      setError("업로드에 실패했습니다. 파일 크기를 확인하고 다시 시도해주세요.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-fg-muted">{label}</span>
      {hint && <span className="text-[11px] text-fg-subtle">{hint}</span>}
      <div className="mt-1 flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="이미지 URL 또는 아래에서 파일 업로드"
          className="min-w-0 flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-neon"
        />
        <label className="shrink-0 cursor-pointer rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-neon">
          {uploading ? "업로드 중..." : "파일 선택"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      {error && <span className="text-[11px] text-danger">{error}</span>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-1 h-16 w-28 rounded-lg border border-border object-cover"
        />
      )}
    </label>
  );
}
