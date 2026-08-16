"use client";

import { useMemo, useState } from "react";
import { saveCollectionAction } from "../actions";
import { type Row, type Json, inferFields, rowLabel, FieldInput } from "./CollectionEditor";

const CATEGORY_LABEL: Record<string, string> = {
  naked: "네이키드",
  sport: "스포츠",
  tourer: "투어러",
  adventure: "어드벤처",
  cruiser: "크루저",
  scooter: "스쿠터",
  classic: "클래식",
};

export function ModelsEditor({
  initialItems,
  brands,
}: {
  initialItems: Row[];
  brands: { id: string; nameKo: string }[];
}) {
  const [items, setItems] = useState<Row[]>(initialItems);
  const [selected, setSelected] = useState<number | null>(initialItems.length > 0 ? 0 : null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>({});
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const fields = useMemo(() => inferFields(items), [items]);
  const brandNameById = useMemo(
    () => new Map(brands.map((b) => [b.id, b.nameKo])),
    [brands],
  );

  const categoriesInUse = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => {
      if (typeof it.category === "string") set.add(it.category);
    });
    return Array.from(set);
  }, [items]);

  const visibleIndices = useMemo(() => {
    return items
      .map((_, i) => i)
      .filter((i) => {
        const row = items[i];
        if (brandFilter !== "all" && row.brandId !== brandFilter) return false;
        if (categoryFilter !== "all" && row.category !== categoryFilter) return false;
        return true;
      });
  }, [items, brandFilter, categoryFilter]);

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
      fields.map((f) => [
        f.key,
        f.type === "boolean" ? false : f.type === "number" ? 0 : f.type === "json" ? [] : "",
      ]),
    );
    if (brandFilter !== "all") blank.brandId = brandFilter;
    if (categoryFilter !== "all") blank.category = categoryFilter;
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
    const result = await saveCollectionAction("models", items);
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
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="rounded-lg border border-border bg-bg px-2 py-1.5 text-xs outline-none focus:border-neon"
        >
          <option value="all">전체 브랜드</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nameKo}
            </option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-border bg-bg px-2 py-1.5 text-xs outline-none focus:border-neon"
        >
          <option value="all">전체 타입</option>
          {categoriesInUse.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABEL[cat] ?? cat}
            </option>
          ))}
        </select>
        <span className="text-xs text-fg-subtle">
          {visibleIndices.length}/{items.length}개 표시
        </span>

        <div className="ml-auto flex items-center gap-2">
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr]">
        <div className="max-h-[70vh] overflow-y-auto rounded-xl border border-border">
          {visibleIndices.map((index) => {
            const row = items[index];
            const brandName =
              typeof row.brandId === "string" ? brandNameById.get(row.brandId) : undefined;
            return (
              <div
                key={index}
                className={`flex items-center justify-between border-b border-border px-3 py-2 text-xs last:border-b-0 ${
                  selected === index ? "bg-neon/10 text-neon" : "hover:bg-bg-elevated"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelected(index)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block truncate">{rowLabel(row, index)}</span>
                  {brandName && (
                    <span className="block truncate text-[10px] text-fg-subtle">
                      {brandName}
                      {typeof row.category === "string"
                        ? ` · ${CATEGORY_LABEL[row.category] ?? row.category}`
                        : ""}
                    </span>
                  )}
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
            );
          })}
          {visibleIndices.length === 0 && (
            <p className="px-3 py-4 text-center text-xs text-fg-subtle">
              조건에 맞는 모델이 없습니다.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-border p-4">
          {current && selected != null ? (
            <div className="flex flex-col gap-3">
              {fields.map((field) =>
                field.key === "brandId" ? (
                  <label key={field.key} className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-fg-muted">브랜드</span>
                    <BrandPicker
                      brands={brands}
                      value={typeof current[field.key] === "string" ? (current[field.key] as string) : ""}
                      onChange={(id) => updateField(selected, "brandId", id)}
                    />
                  </label>
                ) : (
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
                ),
              )}
            </div>
          ) : (
            <p className="text-sm text-fg-subtle">왼쪽에서 항목을 선택하세요.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function BrandPicker({
  brands,
  value,
  onChange,
}: {
  brands: { id: string; nameKo: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  const index = brands.findIndex((b) => b.id === value);
  const current = index >= 0 ? brands[index] : undefined;

  function step(delta: number) {
    if (brands.length === 0) return;
    const base = index >= 0 ? index : 0;
    const next = (base + delta + brands.length) % brands.length;
    onChange(brands[next].id);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={brands.length === 0}
        className="rounded-lg border border-border px-2.5 py-2 text-sm hover:border-neon disabled:opacity-40"
        aria-label="이전 브랜드"
      >
        ◀
      </button>
      <span className="min-w-0 flex-1 truncate rounded-lg border border-border bg-bg px-3 py-2 text-center text-sm font-medium">
        {current ? `${index + 1}. ${current.nameKo}` : value || "브랜드 없음"}
      </span>
      <button
        type="button"
        onClick={() => step(1)}
        disabled={brands.length === 0}
        className="rounded-lg border border-border px-2.5 py-2 text-sm hover:border-neon disabled:opacity-40"
        aria-label="다음 브랜드"
      >
        ▶
      </button>
    </div>
  );
}
