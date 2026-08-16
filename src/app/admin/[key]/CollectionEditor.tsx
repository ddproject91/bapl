"use client";

import { useMemo, useState } from "react";
import { saveCollectionAction, uploadImageAction } from "../actions";

export type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
export type Row = Record<string, Json>;

type FieldType = "string" | "text" | "number" | "boolean" | "json";

export interface Field {
  key: string;
  type: FieldType;
}

export function inferFields(items: Row[]): Field[] {
  const keys = new Set<string>();
  items.forEach((item) => Object.keys(item).forEach((k) => keys.add(k)));
  return Array.from(keys).map((key) => {
    const sample = items.find((it) => it[key] !== undefined && it[key] !== null)?.[key];
    let type: FieldType = "string";
    if (typeof sample === "number") type = "number";
    else if (typeof sample === "boolean") type = "boolean";
    else if (typeof sample === "string") {
      type = sample.length > 50 || sample.includes("\n") ? "text" : "string";
    } else if (sample !== undefined) {
      type = "json";
    }
    return { key, type };
  });
}

export function rowLabel(row: Row, index: number): string {
  const candidate =
    row.title ?? row.name ?? row.nameKo ?? row.task ?? row.q ?? row.id ?? row.slug;
  if (typeof candidate === "string" && candidate.length > 0) return candidate;
  return `#${index + 1}`;
}

export function CollectionEditor({
  collectionKey,
  initialData,
}: {
  collectionKey: string;
  initialData: unknown;
}) {
  if (Array.isArray(initialData)) {
    return <ArrayEditor collectionKey={collectionKey} initialItems={initialData as Row[]} />;
  }
  return (
    <ObjectEditor
      collectionKey={collectionKey}
      initialData={(initialData ?? {}) as Record<string, Json>}
    />
  );
}

function ArrayEditor({
  collectionKey,
  initialItems,
}: {
  collectionKey: string;
  initialItems: Row[];
}) {
  const [items, setItems] = useState<Row[]>(initialItems);
  const [selected, setSelected] = useState<number | null>(initialItems.length > 0 ? 0 : null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>({});

  const fields = useMemo(() => inferFields(items), [items]);

  function updateField(index: number, key: string, value: Json) {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
    setDirty(true);
  }

  function addItem() {
    const blank: Row = Object.fromEntries(
      fields.map((f) => [f.key, f.type === "boolean" ? false : f.type === "number" ? 0 : f.type === "json" ? [] : ""]),
    );
    setItems((prev) => {
      const next = [...prev, blank];
      setSelected(next.length - 1);
      return next;
    });
    setDirty(true);
  }

  function duplicateItem(index: number) {
    setItems((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, { ...prev[index] });
      setSelected(index + 1);
      return next;
    });
    setDirty(true);
  }

  function deleteItem(index: number) {
    if (!confirm("이 항목을 삭제할까요?")) return;
    setItems((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setSelected(next.length > 0 ? Math.min(index, next.length - 1) : null);
      return next;
    });
    setDirty(true);
  }

  async function save() {
    if (Object.keys(jsonErrors).length > 0) {
      setMessage({ type: "error", text: "JSON 형식 오류가 있는 필드를 먼저 고쳐주세요." });
      return;
    }
    setSaving(true);
    setMessage(null);
    const result = await saveCollectionAction(collectionKey, items);
    setSaving(false);
    if (result.ok) {
      setDirty(false);
      setMessage({ type: "ok", text: "저장했습니다. 사이트에 반영되었습니다." });
    } else {
      setMessage({ type: "error", text: result.error });
    }
  }

  const current = selected != null ? items[selected] : null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-fg-subtle">{items.length}개 항목</span>
        <div className="flex items-center gap-2">
          {message && (
            <span
              className={`text-xs font-medium ${message.type === "ok" ? "text-neon" : "text-danger"}`}
            >
              {message.text}
            </span>
          )}
          <button
            type="button"
            onClick={addItem}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-border-strong"
          >
            + 항목 추가
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || saving}
            className="rounded-lg bg-neon px-3 py-1.5 text-xs font-bold text-black disabled:opacity-40"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[220px_1fr]">
        <div className="max-h-[70vh] overflow-y-auto rounded-xl border border-border">
          {items.map((row, index) => (
            <div
              key={index}
              className={`flex items-center justify-between border-b border-border px-3 py-2 text-xs last:border-b-0 ${
                selected === index ? "bg-neon/10 text-neon" : "hover:bg-bg-elevated"
              }`}
            >
              <button
                type="button"
                onClick={() => setSelected(index)}
                className="flex-1 truncate text-left"
              >
                {rowLabel(row, index)}
              </button>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  title="복제"
                  aria-label="복제"
                  onClick={() => duplicateItem(index)}
                  className="rounded px-1 text-fg-subtle hover:text-fg"
                >
                  ⧉
                </button>
                <button
                  type="button"
                  title="삭제"
                  aria-label="삭제"
                  onClick={() => deleteItem(index)}
                  className="rounded px-1 text-fg-subtle hover:text-danger"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="px-3 py-4 text-center text-xs text-fg-subtle">항목이 없습니다.</p>
          )}
        </div>

        <div className="rounded-xl border border-border p-4">
          {current && selected != null ? (
            <div className="flex flex-col gap-3">
              {fields.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  value={current[field.key]}
                  onChange={(v) => updateField(selected, field.key, v)}
                  onJsonError={(err) =>
                    setJsonErrors((prev) => {
                      const next = { ...prev };
                      const errKey = `${selected}.${field.key}`;
                      if (err) next[errKey] = err;
                      else delete next[errKey];
                      return next;
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-fg-subtle">왼쪽에서 항목을 선택하세요.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function FieldInput({
  field,
  value,
  onChange,
  onJsonError,
}: {
  field: Field;
  value: Json | undefined;
  onChange: (value: Json) => void;
  onJsonError: (error: string | null) => void;
}) {
  const [jsonText, setJsonText] = useState(() =>
    field.type === "json" ? JSON.stringify(value ?? null, null, 2) : "",
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // 값 길이와 무관하게 필드 이름만으로 판단(긴 URL이 "text" 타입으로 분류돼도 업로드 UI가 빠지지 않도록).
  // 단, linkUrl처럼 "이동할 링크"를 뜻하는 필드는 이미지가 아니므로 업로드 UI를 붙이지 않는다.
  const isImageUrlField = /url$/i.test(field.key) && !/^link/i.test(field.key);

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
        onChange(result.url);
      } else {
        setUploadError(result.error);
      }
    } catch {
      setUploadError("업로드에 실패했습니다. 파일 크기를 확인하고 다시 시도해주세요.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-fg-muted">{field.key}</span>
      {(field.type === "string" || (isImageUrlField && field.type === "text")) && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={isImageUrlField ? "이미지 URL 또는 아래에서 파일 업로드" : undefined}
            className="min-w-0 flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-neon"
          />
          {isImageUrlField && (
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
          )}
        </div>
      )}
      {isImageUrlField && uploadError && (
        <span className="text-[11px] text-danger">{uploadError}</span>
      )}
      {isImageUrlField && typeof value === "string" && value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-1 h-20 w-20 rounded-lg border border-border object-cover"
        />
      )}
      {field.type === "text" && !isImageUrlField && (
        <textarea
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-neon"
        />
      )}
      {field.type === "number" && (
        <input
          type="number"
          value={typeof value === "number" ? value : 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-neon"
        />
      )}
      {field.type === "boolean" && (
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4"
        />
      )}
      {field.type === "json" && (
        <>
          <textarea
            value={jsonText}
            onChange={(e) => {
              const text = e.target.value;
              setJsonText(text);
              try {
                const parsed = JSON.parse(text);
                setJsonError(null);
                onJsonError(null);
                onChange(parsed);
              } catch {
                setJsonError("JSON 형식이 올바르지 않습니다");
                onJsonError("invalid");
              }
            }}
            rows={6}
            className="rounded-lg border border-border bg-bg px-3 py-2 font-mono text-xs outline-none focus:border-neon"
          />
          {jsonError && <span className="text-[11px] text-danger">{jsonError}</span>}
        </>
      )}
    </label>
  );
}

function ObjectEditor({
  collectionKey,
  initialData,
}: {
  collectionKey: string;
  initialData: Record<string, Json>;
}) {
  const [text, setText] = useState(() => JSON.stringify(initialData, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  async function save() {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setError("JSON 형식이 올바르지 않습니다");
      return;
    }
    setError(null);
    setSaving(true);
    setMessage(null);
    const result = await saveCollectionAction(collectionKey, parsed);
    setSaving(false);
    if (result.ok) {
      setMessage({ type: "ok", text: "저장했습니다. 사이트에 반영되었습니다." });
    } else {
      setMessage({ type: "error", text: result.error });
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-fg-subtle">
        이 컬렉션은 객체 형태라 JSON으로 직접 편집합니다.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={20}
        className="rounded-lg border border-border bg-bg px-3 py-2 font-mono text-xs outline-none focus:border-neon"
      />
      {error && <span className="text-xs text-danger">{error}</span>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-neon px-3 py-1.5 text-xs font-bold text-black disabled:opacity-40"
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
