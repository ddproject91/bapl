-- 제휴/입점 문의 폼 저장 테이블
create table if not exists public.partner_inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  contact text not null,
  company text,
  inquiry_type text not null check (inquiry_type in ('dealer', 'brand', 'local', 'partnership', 'other')),
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);
create index if not exists partner_inquiries_status_idx on public.partner_inquiries (status, created_at desc);

alter table public.partner_inquiries enable row level security;

-- 비로그인 방문자도 문의를 남길 수 있어야 하므로 누구나 insert 허용.
create policy "partner_inquiries_insert_anyone"
  on public.partner_inquiries for insert
  with check (true);

-- 관리자는 서비스 롤 키(getSupabaseAdmin)로 조회하므로 별도 select 정책 불필요.
