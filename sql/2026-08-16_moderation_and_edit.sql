-- 신고 저장 테이블 (기존엔 alert()만 뜨고 저장 안 되던 문제 수정)
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('post', 'comment')),
  target_id text not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'dismissed')),
  created_at timestamptz not null default now()
);
create index if not exists reports_status_idx on public.reports (status, created_at desc);

alter table public.reports enable row level security;

create policy "reports_insert_own"
  on public.reports for insert
  with check (auth.uid() = reporter_id);

create policy "reports_select_own"
  on public.reports for select
  using (auth.uid() = reporter_id);

-- 관리자는 서비스 롤 키(getSupabaseAdmin)로 조회하므로 RLS를 우회함 — 별도 admin select 정책 불필요.

-- 본인 게시글/댓글 수정 허용 (삭제 정책은 schema.sql에 이미 있음, 수정 정책만 추가)
drop policy if exists "users can update their own posts" on public.posts;
create policy "users can update their own posts" on public.posts
  for update using (auth.uid() = author_id) with check (auth.uid() = author_id);

drop policy if exists "users can update their own comments" on public.comments;
create policy "users can update their own comments" on public.comments
  for update using (auth.uid() = author_id) with check (auth.uid() = author_id);
