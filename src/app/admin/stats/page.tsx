import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { StatsView, type MetricSeries } from "./StatsView";

/**
 * 활동 지표 정의 — 나중에 PG 연동/판매자 기능이 생기면
 * 이 배열에 { key, label, table, dateColumn }만 추가하면 통계에 바로 반영된다.
 */
const METRICS: { key: string; label: string; table: string; dateColumn: string }[] = [
  { key: "signups", label: "신규 가입자", table: "profiles", dateColumn: "created_at" },
  { key: "posts", label: "작성 게시글", table: "posts", dateColumn: "created_at" },
  { key: "comments", label: "작성 댓글", table: "comments", dateColumn: "created_at" },
  { key: "likes", label: "좋아요", table: "likes", dateColumn: "created_at" },
  { key: "checkins", label: "출석 체크", table: "checkins", dateColumn: "created_at" },
  { key: "reports", label: "신고 접수", table: "reports", dateColumn: "created_at" },
  { key: "inquiries", label: "제휴 문의", table: "partner_inquiries", dateColumn: "created_at" },
];

const LOOKBACK_DAYS = 400; // 월간 12개월 뷰까지 커버

export default async function AdminStatsPage() {
  const supabase = getSupabaseAdmin();
  const configured = Boolean(supabase);

  let series: MetricSeries[] = [];

  if (supabase) {
    const since = new Date();
    since.setDate(since.getDate() - LOOKBACK_DAYS);
    const sinceIso = since.toISOString();

    const results = await Promise.all(
      METRICS.map((m) =>
        supabase.from(m.table).select(m.dateColumn).gte(m.dateColumn, sinceIso),
      ),
    );

    series = METRICS.map((m, i) => ({
      key: m.key,
      label: m.label,
      dates: ((results[i].data ?? []) as unknown as Array<Record<string, unknown>>)
        .map((row) => row[m.dateColumn] as string)
        .filter(Boolean),
    }));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/admin"
        className="mb-4 inline-block text-xs font-medium text-fg-muted hover:text-neon"
      >
        ← 전체 컬렉션
      </Link>
      <h1 className="mb-1 text-xl font-black tracking-tight">사이트 통계</h1>
      <p className="mb-6 text-sm text-fg-muted">
        기간별 회원 활동 지표입니다. 방문자 수·유입 경로·체류시간은{" "}
        <a
          href="https://analytics.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-fg underline hover:text-neon"
        >
          구글 애널리틱스
        </a>
        에서 확인하세요.
      </p>

      {!configured && (
        <div className="mb-6 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-fg">
          Supabase 환경변수가 설정되지 않았거나 조회에 실패했습니다.
        </div>
      )}

      {configured && <StatsView series={series} />}
    </div>
  );
}
