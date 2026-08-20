-- 라이더 플레이스 찜(저장) 기능 — 기존 likes 테이블을 target_type='place'로 재사용.
alter table public.likes drop constraint if exists likes_target_type_check;
alter table public.likes add constraint likes_target_type_check
  check (target_type in ('post', 'listing', 'place'));
