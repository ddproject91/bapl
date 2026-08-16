import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { PartnerInquiriesModerator, type InquiryRow } from "./PartnerInquiriesModerator";

export default async function AdminPartnershipPage() {
  const supabase = getSupabaseAdmin();
  const configured = Boolean(supabase);

  let rows: InquiryRow[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("partner_inquiries")
      .select("id, name, contact, company, inquiry_type, message, status, created_at")
      .order("created_at", { ascending: false });
    rows = (data ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      contact: r.contact,
      company: r.company,
      inquiryType: r.inquiry_type,
      message: r.message,
      status: r.status,
      createdAt: r.created_at,
    }));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/admin"
        className="mb-4 inline-block text-xs font-medium text-fg-muted hover:text-neon"
      >
        ← 전체 컬렉션
      </Link>
      <h1 className="mb-1 text-xl font-black tracking-tight">제휴·입점 문의</h1>
      <p className="mb-6 text-sm text-fg-muted">
        사이트에서 접수된 제휴/입점 문의를 확인하고 처리 상태를 관리하세요.
      </p>

      {!configured && (
        <div className="mb-6 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-fg">
          Supabase 환경변수가 설정되지 않았거나 조회에 실패했습니다.
        </div>
      )}

      {configured && <PartnerInquiriesModerator initialRows={rows} />}
    </div>
  );
}
