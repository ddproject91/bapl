"use client";

import { useState } from "react";
import Image from "next/image";
import { saveCollectionAction, uploadImageAction } from "../actions";

interface PopupBanner {
  enabled: boolean;
  imageUrl: string;
  linkUrl: string;
}

export function PopupBannerEditor({ initialData }: { initialData: PopupBanner }) {
  const [data, setData] = useState<PopupBanner>(initialData);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function update(patch: Partial<PopupBanner>) {
    setData((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImageAction(formData);
      if (result.ok) {
        update({ imageUrl: result.url });
      } else {
        setUploadError(result.error);
      }
    } catch {
      setUploadError("업로드에 실패했습니다. 파일 크기를 확인하고 다시 시도해주세요.");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    const result = await saveCollectionAction("site.popupBanner", data);
    setSaving(false);
    if (result.ok) {
      setDirty(false);
      setMessage({ type: "ok", text: "저장했습니다. 사이트에 바로 반영됩니다." });
    } else {
      setMessage({ type: "error", text: result.error });
    }
  }

  return (
    <div className="flex max-w-md flex-col gap-4">
      <label className="flex items-center justify-between rounded-xl border border-border bg-bg-card p-4">
        <div>
          <p className="text-sm font-bold">팝업 배너 노출</p>
          <p className="mt-0.5 text-xs text-fg-subtle">
            켜면 방문자에게 팝업으로 노출됩니다 (닫으면 "오늘 하루 그만보기" 전까지 다시 뜸).
          </p>
        </div>
        <input
          type="checkbox"
          checked={data.enabled}
          onChange={(e) => update({ enabled: e.target.checked })}
          className="h-5 w-5 shrink-0"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-fg-muted">배너 이미지</span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={data.imageUrl}
            onChange={(e) => update({ imageUrl: e.target.value })}
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
        {uploadError && <span className="text-[11px] text-danger">{uploadError}</span>}
        {data.imageUrl && (
          <div className="relative mt-1 h-48 w-40 overflow-hidden rounded-lg border border-border">
            <Image src={data.imageUrl} alt="" fill sizes="160px" className="object-cover" />
          </div>
        )}
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-fg-muted">클릭 시 이동 링크</span>
        <input
          type="text"
          value={data.linkUrl}
          onChange={(e) => update({ linkUrl: e.target.value })}
          placeholder="/news/n1 또는 https://..."
          className="rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-neon"
        />
      </label>

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
