# CLAUDE.md — BAPL (Bike & Adventure Platform)

## 프로젝트 개요
BAPL: 바이크를 사랑하는 사람들을 위한 커뮤니티 & 종합 플랫폼.
**목표: 국내 최대 바이크 데이터 플랫폼 — 라이더들의 정보, 소통, 거래, 관리의 중심.**

## 브랜드 아이덴티티
- 로고: BAPL / 태그라인: BIKE & ADVENTURE PLATFORM
- 컬러: 블랙 배경 + 화이트 텍스트 + 네온 그린 포인트 (#00E676 계열, 로고 PL 컬러 기준)
- 톤: 다크 베이스의 테크/모터스포츠 무드, 모바일 퍼스트

## 수익 모델
1. 업자 입점: 바이크 매입/판매 업자 (마켓 > 업체/서비스)
2. 용품 브랜드 입점: 다이네즈, 알파인스타 등 (마켓 > 의류·헬멧 / 부품·튜닝)
3. 로컬 업체 입점: 정비소(정비/관리 > 업체 찾기), 라이더 맛집·카페·세차장(라이딩 > 플레이스)
4. 소개 수수료: 보험 상담(가입), 금융 상담(대출) — 전역 채팅 문의
5. 투어 제휴: 하나투어·노랑풍선 등 라이더 전용 패키지 (라이딩 > 투어 일정)
6. (장기) 광고 인벤토리

## 기술 스택
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend/DB** (Phase 1부터): Supabase (Postgres, Auth, Storage, Realtime, RLS)
- **배포**: Vercel / **PWA**: next-pwa (모바일 최적화, 앱 연동 대비)
- **지도**: 카카오맵 SDK (라이딩 코스/모임/플레이스, 정비 업체)
- **결제**: 토스페이먼츠 (마켓/입점 정산 단계)
- **이미지 누끼**: rembg (U2-Net) 자동 배경 제거 파이프라인
- **다국어**: next-intl (ko 기본, en 대비 — 하드코딩 문자열 금지, 메시지 파일 분리)

## 개발 원칙
- 모바일 퍼스트 — 라이더는 폰으로 본다
- Phase 0(데모)은 백엔드 없이 목업 데이터로만. 단, Phase 1에서 Supabase만 끼우면 되는 구조로 설계
- Phase 1부터 모든 접근 제어는 Supabase RLS로 DB 레벨 강제
- 서버 컴포넌트 우선, 클라이언트 컴포넌트는 인터랙션 필요할 때만
- 타입은 Supabase CLI로 DB 스키마에서 자동 생성
- "입점" 기능은 전부 공통 벤더 시스템(vendors) 위에서 동작 — 기능별 별도 구현 금지
- UI 문자열은 처음부터 i18n 메시지 파일로 (다국어 지원 목표)

---

## 정보 구조 (IA) — 최상위 메뉴 7개 + 지원 기능

### 1. 브랜드관 — 국내·외 모든 바이크 브랜드 한눈에 보기
- 초기 브랜드 11: BMW Motorrad, 혼다, 두카티, KTM, 허스크바나, 야마하,
  가와사키, 스즈키, 할리데이비슨, 인디언, 트라이엄프 (확장 가능 구조)
- 구분 축: 국가별 / 브랜드별 / 타입별 / 배기량 클래스별 교차 필터
- 브랜드 상세 = 브랜드 스토리 + 해당 브랜드 모델 목록 → 모델관 연결

### 2. 모델관 — 모델별 상세 정보 및 다양한 콘텐츠 (킬러 콘텐츠)
모델 상세 페이지 탭 구성:
- 제원 정보: 상세 제원표 (아래 "제원 데이터" 참조) + 히어로 누끼 이미지 + 컬러웨이
- 리뷰/시승기: 유저 오너 리뷰(별점) + 에디토리얼 시승기
- 정비 정보: 모델별 정비 포인트, 고질병, 소모품 규격
- 튜닝 정보: 모델별 튜닝 사례/호환 파츠
- 포토 갤러리: 유저 사진 (자랑 커뮤니티 연동)
- 중고 시세: 마켓 판매완료 데이터 기반 시세 차트 (차별화 포인트)
- 신차 정보: 신형 발표/출시 소식
- 관련 뉴스: 해당 모델/브랜드 뉴스 + 이륜차 법개정 소식
- FAQ: 모델별 자주 묻는 질문

### 3. 커뮤니티 — 라이더들의 소통 공간
- 자유게시판
- 사고/블랙박스: 영상 업로드 → 과실/대처 조언 (BAPL 공식 법무팀 저비용 지원 연계, 제휴 Phase)
- 질문/지식인: Q&A 채택 시스템
- 정비/DIY
- 튜닝/커스텀
- 투어/여행
- 이벤트/공지 (운영)
- 라이더 인증: 면허/바이크 인증 뱃지 (신뢰 시스템 기반)

### 4. 라이딩 — 라이딩을 더 즐겁게
- 라이딩 모임: 지역별/기종별 번개·정모 (지도 기반, 참가 신청/정원)
- 라이딩 코스: 코스 공유, GPX 업로드/다운로드, 난이도/노면 후기
- 행사/대회: 국내외 바이크 행사·대회 캘린더
- 투어 일정: 여행사 제휴 라이더 전용 패키지 [제휴]
- 라이딩 기록: 개인 주행 기록 (거리/코스/사진)
- 출석 체크: 데일리 출석 → 포인트 (리텐션 장치)
- 베스트 코스: 추천/인기 코스 큐레이션
- 라이더 플레이스: 맛집/카페/세차장 지도 [입점]

### 5. 마켓 — 바이크 관련 거래 공간
- 중고 매물(바이크): **인증/비인증** 구분
  - 인증 매물: 파쏘바이크식 사진 등록 가이드 강제 — 필수 슬롯
    (전면/후면/좌측면/우측면/계기반·주행거리/차대번호/키·서류) 전부 충족 시 "BAPL 인증" 뱃지
  - 비인증: 자유 등록, 목록에서 인증 우선 노출
- 바이크 용품(중고): 개인간 거래
- 의류/헬멧 [입점]: 다이네즈, 알파인스타 등 브랜드 신품
- 부품/튜닝 [입점]
- 업체/서비스 [입점]: 바이크 매입(업자)/판매(업자), 사업자 인증 + 업자 뱃지 + 요금제
- 공동구매: 운영 주도 공구 (수량 달성형)
- 경매/직거래: 경매식 판매 (후순위 기능)
- 공통: 1:1 채팅(Realtime), 거래 후기/매너 점수, 찜, 사기 방지(신고/검수)

### 6. 정비/관리 — 바이크 관리의 모든 것
- 정비 매뉴얼: 모델/작업별 정비 가이드 (모델관 정비 정보와 연동)
- 소모품 교체 주기: 오일/타이어/체인/패드 권장 주기 DB + 내 바이크 주행거리 기반 알림
- 정비 비용 정보: 작업별 시세 (유저 제보 축적)
- 정비 업체 찾기 [입점]: 지도 기반 정비소 검색, 리뷰, 입점 업체 상단 노출
- 정비 기록 관리: 내 바이크별 정비 이력 (마이페이지 '내 바이크'와 연동)
- 고장 진단 가이드: 증상 → 원인 후보 → 조치 플로우
- FAQ

### 7. 마이페이지 — 내 활동과 정보 관리
- 내 프로필 (닉네임/아바타/지역/라이딩 경력/인증 뱃지)
- 내 게시글 / 내 댓글
- 찜한 매물
- 알림 목록
- 활동 내역 (포인트/랭킹)
- 설정/보안 (알림 설정, 계정, 다국어)
- 내 바이크 관리: 보유 기종 등록(모델관 연동), 주행거리, 정비 기록, 소모품 알림

### 플랫폼 지원 기능 (전역)
- 통합 검색: 브랜드/모델/게시글/매물/회원 통합 (Postgres FTS, 후에 pg_trgm 한글 보완)
- 알림 시스템: 실시간 인앱 알림 (댓글/좋아요/채팅/소모품 주기/공지)
- 신고/제재: 신고 → 관리자 검토 → 제재(경고/정지) 파이프라인
- 포인트/랭킹: 활동 포인트(글/댓글/출석/인증) + 주간/월간 랭킹
- 모바일 최적화: PWA (홈 화면 설치, 푸시 대비), 반응형
- 다국어 지원: ko 기본, en 확장 구조
- 채팅 문의(전역 플로팅): 보험 상담/금융 상담 [제휴, 소개 수수료] + 일반 문의

---

## 개발 로드맵

### Phase 0 — 시연용 데모 (현재 목표, 즉시 배포)
백엔드 없음. 모든 데이터는 `src/data/mock/*.ts`.
- 최상위 메뉴 7개 전부 목업 구현 (비어 보이는 메뉴 없게)
- 브랜드 IA(블랙+네온그린) 적용한 홈 + 헤더/GNB
- 로그인: **무늬만**. 로그인 버튼 → 모달(이메일/비밀번호 + 카카오/구글) → 누르면 닉네임 표시 (로컬 state, 실제 인증 없음)
- 브랜드관 11개 브랜드, 모델관 12~18개 모델 (제원표 + 탭 UI 목업)
- 마켓: 인증/비인증 매물 카드 구분 + BAPL 인증 뱃지 UI
- 라이딩/정비관리/마이페이지: 대표 화면 목업, [입점]/[제휴] 항목은 "준비중" 뱃지
- Vercel 배포 완료가 종료 조건

### Phase 1 — 회원 + 커뮤니티 + 브랜드관/모델관 (실서비스 MVP)
- Supabase Auth (이메일 + 카카오/구글), 프로필, 내 바이크 등록
- 커뮤니티 전 게시판 (사고/블랙박스 영상 업로드 포함) + 질문/지식인 채택
- 브랜드관/모델관 실데이터 (11개 브랜드, 인기 모델 50개 시드) + 누끼 파이프라인
- 모델관 탭: 제원/리뷰/갤러리/뉴스/FAQ 우선 (정비·튜닝 정보는 콘텐츠 쌓이면)
- 지원 기능: 통합 검색, 알림, 신고/제재, 관리자 페이지
- PWA + i18n 뼈대

### Phase 2 — 마켓(개인) + 라이딩 코어
- 중고 매물 인증/비인증 시스템 (필수 사진 슬롯 강제)
- 1:1 채팅, 거래 후기/매너 점수, 찜
- 시세 아카이브 → 모델관 중고 시세 차트
- 라이딩 모임(지역/기종별) + 라이딩 코스(카카오맵+GPX) + 출석 체크/포인트
- 마이페이지 활동 내역/랭킹

### Phase 3 — 벤더 시스템 (입점 인프라)
- 공통 벤더 포털: 입점 신청 → 심사 → 대시보드 → 정산
- 적용: ① 마켓 업체/서비스(업자) ② 의류·헬멧/부품·튜닝 브랜드 ③ 정비 업체 ④ 라이더 플레이스
- 정비/관리 메뉴 오픈: 매뉴얼, 소모품 주기+알림, 비용 정보, 업체 찾기, 기록 관리
- 토스페이먼츠 결제, 통신판매중개업 신고

### Phase 4 — 제휴 서비스 + 심화
- 전역 채팅 문의: 보험/금융 상담 + 리드 트래킹(수수료 정산 근거)
- 사고/블랙박스 → 법무팀 상담 연결 (변호사 제휴)
- 투어 일정: 여행사 제휴 상품
- 공동구매, 경매/직거래, 행사/대회 캘린더, 고장 진단 가이드
- ※ 제휴 항목은 개발보다 BD(계약)가 선행 조건

### Phase 5 — 확장
- 다국어 실적용(en), 푸시 알림, 라이딩 기록 고도화(연비 통계 → 모델관 실연비 노출)
- 날씨 라이딩 지수, 활동 배지 고도화

---

## 브랜드관/모델관 데이터 상세

### 제원 데이터 (모델당)
엔진: 형식, 배기량, 최고출력(hp/rpm), 최대토크(Nm/rpm), 냉각방식
차체: 프레임, 전장/전폭/전고, 휠베이스, 시트고, 건조/장비중량
주행: 연료탱크, 공인연비, 전/후 서스펜션, 전/후 브레이크, 타이어 규격
전자장비: 라이딩 모드, TC, ABS(코너링), 퀵시프터, 크루즈, TFT
기타: 국내 출시가(연식별), 보험 클래스
분류: 국가, 타입(네이키드/스포츠/투어러/어드벤처/크루저/스쿠터/클래식),
      배기량 클래스(125 이하/126~250/251~400/401~700/701~1000/1000 초과)

### 이미지 파이프라인 (누끼 자동화)
- 관리자 업로드 → rembg 배경 제거 → 투명 WebP → Supabase Storage
- 타입: hero(측면 누끼, 필수) / colorway / detail / action
- 실패 시 수동 보정 플래그
- 저작권: 제조사 프레스 이미지 이용약관 브랜드별 확인, 상거래 확대 전 재검토

### 데이터 입고
- 초기 시드: 11개 브랜드 인기 모델 50개 관리자 수동 입력
- 유저 제보(정비 비용, 리뷰, FAQ) → 관리자 승인 플로우

---

## DB 스키마

### Phase 1
```
profiles        — id(auth FK), nickname, avatar_url, bio, riding_since, region,
                  role(user|vendor|admin), points, is_rider_verified
user_bikes      — user_id, model_id, nickname, odometer_km, purchased_at
brands          — id, name, name_ko, country, logo_url, description, founded_year
models          — id, brand_id, name, name_ko, category, displacement_class,
                  engine_type, engine_cc, power_hp, power_rpm, torque_nm, torque_rpm,
                  cooling, frame_type, wheelbase_mm, seat_height_mm,
                  weight_dry_kg, weight_wet_kg, fuel_capacity_l, fuel_economy,
                  suspension_front, suspension_rear, brake_front, brake_rear,
                  tire_front, tire_rear, electronics(jsonb), is_active
model_years     — model_id, year, price_krw, changes
model_images    — model_id, type(hero|colorway|detail|action), color_name,
                  storage_path, is_processed, sort_order
model_reviews   — model_id, author_id, rating(1~5), ownership_period, content
model_contents  — model_id, type(maintenance|tuning|newbike|faq), title, content
news            — id, category(법개정|신차|리콜|업계|블로그), title, content,
                  model_id?, brand_id?, published_at
boards          — id, slug, name, type(free|accident|qna|diy|tuning|tour|notice)
posts           — id, board_id, author_id, title, content, video_url,
                  is_accepted_answer?(qna), view_count
post_images     — post_id, storage_path, sort_order
comments        — id, post_id, author_id, parent_id, content, is_accepted(qna 채택)
likes / bookmarks — user_id, target_type, target_id (unique)
notifications   — user_id, type, payload(jsonb), read_at
reports         — reporter_id, target_type, target_id, reason, status, action
point_logs      — user_id, action(post|comment|checkin|verify...), points, created_at
```

### Phase 2 추가
```
listings        — id, seller_id, category(bike|gear), model_id?, title, price,
                  year, mileage_km, region, status(active|reserved|sold),
                  is_verified(BAPL 인증), description
listing_images  — listing_id, slot(front|rear|left|right|dash|vin|docs|extra),
                  storage_path  ※ 인증 매물은 필수 slot 전부 충족
chats / chat_messages, trade_reviews
price_history   — model_id, sold_price, mileage_km, sold_at (시세 차트 소스)
meetups         — id, host_id, type(region|model), model_id?, region,
                  location(좌표), meet_at, capacity, description
meetup_members  — meetup_id, user_id, status
courses         — id, author_id, title, gpx_path, distance_km, difficulty,
                  road_condition, region, description
course_reviews  — course_id, author_id, rating, content
checkins        — user_id, date (unique, 출석)
```

### Phase 3~4 추가
```
vendors          — id, owner_id, type(dealer|gear_brand|repair|place),
                   business_no, name, status(pending|approved|suspended), plan
products / orders / order_items          — 입점 커머스
local_places     — vendor_id?, category(food|cafe|wash|repair), name, 좌표,
                   hours, bike_parking, is_sponsored
place_reviews    — place_id, author_id, rating, content
maintenance_guides    — model_id?, task, content, difficulty
consumable_cycles     — item(oil|tire|chain|pad...), interval_km, interval_months
maintenance_logs      — user_bike_id, task, cost, odometer_km, shop?, done_at
repair_cost_reports   — task, model_id?, cost, region (비용 시세 소스)
consultations    — id, user_id, type(insurance|loan|legal), status, partner_id,
                   lead_value (수수료 정산 근거)
tour_packages    — partner, title, description, price_from, link
group_buys / auctions                    — 공동구매, 경매
events           — title, type(행사|대회), starts_at, location, link
```

## RLS 정책 요약
- profiles: 본인만 수정, 전체 읽기
- posts/comments/listings/reviews: 로그인 회원 작성, 작성자만 수정/삭제, 전체 읽기
- brands/models/news/maintenance_guides/consumable_cycles: 전체 읽기, 관리자만 쓰기
- vendors 관련: 해당 벤더 소유자만 쓰기, 승인된 것만 공개
- user_bikes/maintenance_logs/checkins/point_logs: 본인만 읽기/쓰기
- consultations: 본인 + 관리자 + 담당 파트너만
- notifications: 본인만

## 디렉토리 구조
```
src/
  app/
    (main)/
      brands/ brands/[brandId]/
      models/[modelId]/            # 탭: 제원/리뷰/정비/튜닝/갤러리/시세/신차/뉴스/FAQ
      community/[slug]/ posts/[id]/
      riding/
        meetups/ courses/ events/ tours/ records/ checkin/ places/
      market/
        bikes/ gear/ apparel/ parts/ dealers/ groupbuy/ auction/
      garage/                      # 정비/관리
        manuals/ cycles/ costs/ shops/ logs/ diagnosis/ faq/
      my/                          # 마이페이지
      news/ news/[id]/
      search/
    vendor/                        # 벤더 포털 (Phase 3)
    admin/
  components/
  data/mock/                       # Phase 0 목업
  lib/supabase/
  messages/                        # i18n (ko.json, en.json)
  types/database.ts
```

## 환경 변수 (Phase 1부터)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # 서버 전용, 클라이언트 노출 금지
NEXT_PUBLIC_KAKAO_MAP_KEY=
```

## 커맨드
```
npm run dev
npm run build        # 배포 전 필수 통과
npx vercel
npx supabase gen types typescript --project-id <id> > src/types/database.ts
```

## 채널 운영 전략 (개발 외 — 운영 참고)
- 인스타그램: 자랑 갤러리 베스트 리그램, 모델 카드뉴스 (모델관 콘텐츠 재활용)
- 블로그: 법개정 뉴스·모델 제원 콘텐츠 SEO화 → 검색 유입 → 사이트 전환
- 유튜브: 사고/블랙박스 조언(블러 처리), 모델 리뷰/시승, 라이딩 코스 영상
- 원칙: 사이트 콘텐츠가 원본, SNS는 재가공 유통 (One Source Multi Use)

## 하지 말 것
- Phase 0에서 Supabase/실제 인증 코드 작성 금지 (무늬만 로그인)
- 입점 기능을 벤더 공통 시스템 없이 기능별 개별 구현 금지
- UI 문자열 하드코딩 금지 (i18n 메시지 파일 사용)
- service_role 키 클라이언트 사용 금지
- Phase 1부터 RLS 없는 테이블 생성 금지
- 목업 데이터에 실존 인물/타 커뮤니티 콘텐츠 복붙 금지
- 사고/블랙박스 게시판: 개인정보(번호판 등) 처리 정책 확정 전 실서비스 오픈 금지
