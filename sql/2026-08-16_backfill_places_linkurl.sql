-- riding.places 컬렉션이 이미 저장되어 있어서 새로 추가한 linkUrl 필드가
-- 관리자 화면에 안 보이던 문제 수정. 기존 항목의 다른 값은 전혀 건드리지 않고,
-- 각 항목에 빈 linkUrl 필드만 추가한다.
update public.site_content
set data = (
  select jsonb_agg(elem || '{"linkUrl": ""}'::jsonb)
  from jsonb_array_elements(data) as elem
)
where key = 'riding.places';
