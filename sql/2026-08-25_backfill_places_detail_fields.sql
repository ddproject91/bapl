-- 라이더 플레이스 상세 팝업(주소/운영시간/추가이미지/메뉴이미지) 기능 추가로
-- 새로 생긴 필드들이 관리자 화면에 보이도록, 기존 항목에 빈 값으로 채워넣는다.
-- 기존 값은 전혀 건드리지 않는다.
update public.site_content
set data = (
  select jsonb_agg(
    elem
    || '{"hours": ""}'::jsonb
    || '{"address": ""}'::jsonb
    || '{"galleryImages": []}'::jsonb
    || '{"menuImages": []}'::jsonb
  )
  from jsonb_array_elements(data) as elem
)
where key = 'riding.places';
