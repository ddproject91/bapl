-- BAPL admin content store.
-- Run this once in the Supabase SQL Editor after creating the project.
create table if not exists public.site_content (
  key text primary key,
  data jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- BAPL member profiles (real auth). Run this once too.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null default '라이더',
  region text default '',
  role text not null default 'user' check (role in ('user','vendor','admin')),
  tier text not null default 'bronze' check (tier in ('bronze','silver','gold','platinum')),
  points int not null default 0,
  is_rider_verified boolean not null default false,
  avatar_url text not null default '',
  bike_model text not null default '',
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- 기존 프로젝트에 이미 profiles 테이블이 있는 경우를 위한 마이그레이션(멱등).
alter table public.profiles add column if not exists avatar_url text not null default '';
alter table public.profiles add column if not exists bike_model text not null default '';
-- 성별: '' (미설정) | male | female | other, 나이: 출생연도(0이면 미설정)로 저장해 매년 자동 계산.
alter table public.profiles add column if not exists gender text not null default '';
alter table public.profiles add column if not exists birth_year int not null default 0;

drop policy if exists "profiles are publicly readable" on public.profiles;
create policy "profiles are publicly readable" on public.profiles for select using (true);

-- 이메일 가입은 nickname/avatar_url을 우리가 직접 넘기지만,
-- 카카오 등 OAuth 가입은 제공자가 name/full_name/avatar_url/picture 등 다른 키로 채워주므로
-- 여러 키를 순서대로 확인해서 최대한 실제 프로필 정보를 채운다.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname, avatar_url, bike_model)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'nickname',
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'preferred_username',
      '라이더'
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      ''
    ),
    coalesce(new.raw_user_meta_data->>'bike_model', '')
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- profiles: 본인 프로필 수정 허용(지금까지는 공개 읽기 정책만 있었음).
drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- 실제 커뮤니티 글/댓글/좋아요/출석 (회원가입 실사용자 전용, Phase 0 목업 site_content와 병행).
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  board_slug text not null,
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.posts enable row level security;
drop policy if exists "posts are publicly readable" on public.posts;
create policy "posts are publicly readable" on public.posts for select using (true);
drop policy if exists "users can create their own posts" on public.posts;
create policy "users can create their own posts" on public.posts for insert with check (auth.uid() = author_id);
drop policy if exists "users can delete their own posts" on public.posts;
create policy "users can delete their own posts" on public.posts for delete using (auth.uid() = author_id);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id text not null, -- 목업 글(문자열 id)·실제 글(uuid) 둘 다 지원하기 위해 FK 없는 text
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.comments enable row level security;
drop policy if exists "comments are publicly readable" on public.comments;
create policy "comments are publicly readable" on public.comments for select using (true);
drop policy if exists "users can create their own comments" on public.comments;
create policy "users can create their own comments" on public.comments for insert with check (auth.uid() = author_id);
drop policy if exists "users can delete their own comments" on public.comments;
create policy "users can delete their own comments" on public.comments for delete using (auth.uid() = author_id);

create table if not exists public.likes (
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('post')),
  target_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, target_type, target_id)
);
alter table public.likes enable row level security;
drop policy if exists "likes are publicly readable" on public.likes;
create policy "likes are publicly readable" on public.likes for select using (true);
drop policy if exists "users can like as themselves" on public.likes;
create policy "users can like as themselves" on public.likes for insert with check (auth.uid() = user_id);
drop policy if exists "users can remove their own like" on public.likes;
create policy "users can remove their own like" on public.likes for delete using (auth.uid() = user_id);

create table if not exists public.checkins (
  user_id uuid not null references auth.users(id) on delete cascade,
  checkin_date date not null,
  points_earned int not null default 10,
  created_at timestamptz not null default now(),
  primary key (user_id, checkin_date)
);
alter table public.checkins enable row level security;
drop policy if exists "checkins are publicly readable" on public.checkins;
create policy "checkins are publicly readable" on public.checkins for select using (true);
drop policy if exists "users can checkin as themselves" on public.checkins;
create policy "users can checkin as themselves" on public.checkins for insert with check (auth.uid() = user_id);
