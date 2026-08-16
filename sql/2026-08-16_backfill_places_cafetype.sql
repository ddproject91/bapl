-- riding.places에 카페 세부 분류(cafeType: 일반카페/라이더카페) 필드 추가.
-- 기존 다른 값은 안 건드리고, 모든 항목에 빈 cafeType 필드만 추가한다.
-- (카페가 아닌 항목엔 의미 없는 값이라 자동 추정 없이 비워둠 — 관리자에서 직접 지정)
update public.site_content
set data = (
  select jsonb_agg(elem || '{"cafeType": ""}'::jsonb)
  from jsonb_array_elements(data) as elem
)
where key = 'riding.places';
