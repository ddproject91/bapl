-- 게시글 사진 첨부 + 실제 조회수
alter table public.posts add column if not exists image_urls text[] not null default '{}';
alter table public.posts add column if not exists view_count integer not null default 0;

-- 조회수 원자적 증가용 함수 (동시 조회 시 경쟁 상태 방지)
create or replace function public.increment_post_view_count(post_id uuid)
returns void as $$
  update public.posts set view_count = view_count + 1 where id = post_id;
$$ language sql security definer set search_path = public;
