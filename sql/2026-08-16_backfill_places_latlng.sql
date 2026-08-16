-- riding.places에 카카오맵 표시용 위도(lat)/경도(lng) 필드를 추가한다.
-- 기존 항목의 다른 값은 전혀 건드리지 않고, 각 항목에 lat:0, lng:0 필드만 추가한다.
-- (linkUrl 백필과 동일한 이유: 컬렉션이 이미 저장되어 있어 코드만 바꿔서는 관리자 화면에 안 나타남)
update public.site_content
set data = (
  select jsonb_agg(elem || '{"lat": 0, "lng": 0}'::jsonb)
  from jsonb_array_elements(data) as elem
)
where key = 'riding.places';
