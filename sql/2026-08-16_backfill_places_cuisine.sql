-- riding.places에 맛집 세부 분류(cuisine: 한식/중식/양식/일식/디저트/기타) 필드 추가.
-- 기존 다른 값은 안 건드리고, category가 'food'인 항목은 기본값 'korean'을,
-- 나머지(cafe/wash)는 빈 문자열을 채운다. 나중에 관리자 화면에서 실제 값으로 고치면 됨.
update public.site_content
set data = (
  select jsonb_agg(
    elem || jsonb_build_object(
      'cuisine',
      case when elem->>'category' = 'food' then 'korean' else '' end
    )
  )
  from jsonb_array_elements(data) as elem
)
where key = 'riding.places';
