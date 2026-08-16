-- 마이페이지 실데이터 전환: 알림 / 내 바이크 테이블 생성
-- Supabase 대시보드 > SQL Editor 에서 실행하세요.
-- (찜한 매물은 기존 likes 테이블을 target_type='listing'으로 재사용,
--  주간 랭킹은 기존 profiles.points 컬럼을 재사용하므로 별도 테이블 불필요)

-- ─── 알림 ──────────────────────────────────────────────────
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('comment', 'like', 'chat', 'consumable', 'notice')),
  message text not null,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_created_idx
  on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "notifications_select_own"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "notifications_update_own"
  on public.notifications for update
  using (auth.uid() = user_id);

-- 댓글/좋아요 알림은 상대방(글쓴이)에게 꽂아줘야 하므로 본인 것만이 아닌
-- 로그인 유저라면 누구나 insert 가능하도록 허용 (community 댓글/좋아요와 동일한 신뢰 수준).
create policy "notifications_insert_authenticated"
  on public.notifications for insert
  with check (auth.role() = 'authenticated');

-- ─── 내 바이크 ─────────────────────────────────────────────
create table if not exists public.user_bikes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  model_id text not null,
  nickname text not null,
  odometer_km integer not null default 0,
  purchased_at date,
  created_at timestamptz not null default now()
);

create index if not exists user_bikes_user_id_idx on public.user_bikes (user_id);

alter table public.user_bikes enable row level security;

create policy "user_bikes_select_own"
  on public.user_bikes for select
  using (auth.uid() = user_id);

create policy "user_bikes_insert_own"
  on public.user_bikes for insert
  with check (auth.uid() = user_id);

create policy "user_bikes_update_own"
  on public.user_bikes for update
  using (auth.uid() = user_id);

create policy "user_bikes_delete_own"
  on public.user_bikes for delete
  using (auth.uid() = user_id);

-- ─── likes: 찜(target_type='listing') 허용 ──────────────────
-- 기존 제약이 target_type='post'만 허용해서 마켓 매물 찜하기가 실패하던 문제 수정.
alter table public.likes drop constraint if exists likes_target_type_check;
alter table public.likes add constraint likes_target_type_check
  check (target_type in ('post', 'listing'));

-- ─── 프로필: 라이딩 입문연도 ───────────────────────────────
-- 마이페이지 프로필 카드의 "라이딩 경력 N년차"가 모든 유저에게 같은 값(2021)으로
-- 고정 노출되던 문제 수정용. 0이면 미설정으로 취급해 경력 문구를 숨긴다.
alter table public.profiles
  add column if not exists riding_since integer not null default 0;
