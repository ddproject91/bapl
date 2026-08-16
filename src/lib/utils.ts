/** className 병합 (clsx 대체 경량 버전) */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** 만원 단위 가격 포맷 — 3000 → "3,000만원", 12000 → "1억 2,000만원" */
export function formatManwon(manwon: number): string {
  if (manwon >= 10000) {
    const eok = Math.floor(manwon / 10000);
    const rest = manwon % 10000;
    return rest > 0
      ? `${eok}억 ${rest.toLocaleString()}만원`
      : `${eok}억원`;
  }
  return `${manwon.toLocaleString()}만원`;
}

/** 원 단위 → 만원 문자열 */
export function wonToManwon(won: number): string {
  return formatManwon(Math.round(won / 10000));
}

export function formatKm(km: number): string {
  return `${km.toLocaleString()} km`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString();
}

/** 조회수 등 압축 표기 — 12345 → "1.2만" */
export function compactNumber(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}천`;
  return String(n);
}
