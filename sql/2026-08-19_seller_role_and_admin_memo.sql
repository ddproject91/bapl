-- 회원 권한(role)에 'seller'(셀러) 추가 — 나중에 자기 브랜드 상품만 관리하는 판매자 권한용
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('user', 'vendor', 'seller', 'admin'));

-- 관리자 전용 회원 메모 — 별도 테이블 + RLS 정책 없음(서비스 롤로만 접근 가능).
-- profiles 테이블은 전체 공개 읽기 정책이 걸려있어서, 여기에 메모 필드를 그냥 추가하면
-- 일반 사용자도 다른 회원의 메모를 조회할 수 있게 되어 반드시 분리해야 함.
create table if not exists public.profile_admin_notes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  memo text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.profile_admin_notes enable row level security;
-- 정책을 의도적으로 만들지 않음 → anon/authenticated는 접근 불가, 서비스 롤(관리자)만 우회 가능.
