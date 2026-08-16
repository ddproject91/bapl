"use client";

import { useState } from "react";
import Image from "next/image";
import { saveCollectionAction, uploadImageAction } from "../actions";

interface MainBanner {
  enabled: boolean;
  pcImageUrl: string;
  mobileImageUrl: string;
  linkUrl: string;
}

export function MainBannerEditor({ initialData }: { initialData: MainBanner }) {
  const [data, setData] = useState<MainBanner>(initialData);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  function update(patch: Partial<MainBanner>) {
    setData((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    const result = await saveCollectionAction("site.mainBanner", data);
    setSaving(false);
    if (result.ok) {
      setDirty(false);
      setMessage({ type: "ok", text: "저장했습니다. 사이트에 바로 반영됩니다." });
    } else {
      setMessage({ type: "error", text: result.error });
    }
  }

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <label className="flex items-center justify-between rounded-xl border border-border bg-bg-card p-4">
        <div>
          <p className="text-sm font-bold">메인 배너 노출</p>
          <p className="mt-0.5 text-xs text-fg-subtle">
            켜면 홈 화면 최상단에 배너가 표시됩니다.
          </p>
        </div>
        <input
          type="checkbox"
          checked={data.enabled}
          onChange={(e) => update({ enabled: e.target.checked })}
          className="h-5 w-5 shrink-0"
        />
      </label>

      <BannerImageField
        label="PC용 배너 이미지"
        hint="권장 크기 1920 × 480 (가로형 4:1)"
        previewClass="aspect-[4/1] w-full"
        value={data.pcImageUrl}
        onChange={(url) => update({ pcImageUrl: url })}
      />

      <BannerImageField
        label="모바일용 배너 이미지"
        hint="권장 크기 1080 × 1080 (정사각형 1:1)"
        previewClass="aspect-square w-40"
        value={data.mobileImageUrl}
        onChange={(url) => update({ mobileImageUrl: url })}
      />

      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-fg-muted">클릭 시 이동 링크 (선택)</span>
        <input
          type="text"
          value={data.linkUrl}
          onChange={(e) => update({ linkUrl: e.target.value })}
          placeholder="/news/n1 또는 https://..."
          className="rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-neon"
        />
      </label>

      <p className="rounded-lg border border-border bg-bg-elevated px-3 py-2 text-[11px] leading-relaxed text-fg-subtle">
        한쪽만 올리면 PC·모바일 모두 그 이미지가 사용됩니다. 두 개를 다 올리면 화면 크기에 따라
        자동으로 알맞은 쪽이 노출됩니다.
      </p>

      <div className="flex items-center gap-2">
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
    </div>
  );
}

function BannerImageField({
  label,
  hint,
  previewClass,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  previewClass: string;
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
      <span className="text-xs font-medium text-fg-muted">{label}</span>
      <span className="text-[11px] text-fg-subtle">{hint}</span>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="이미지 URL 또는 오른쪽에서 파일 업로드"
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
        <div
          className={`relative mt-1 overflow-hidden rounded-lg border border-border ${previewClass}`}
        >
          <Image src={value} alt="" fill sizes="480px" className="object-cover" />
        </div>
      )}
    </label>
  );
}
