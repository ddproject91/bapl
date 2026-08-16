import type {
  Meetup,
  Course,
  RidingEvent,
  Place,
  TourPackage,
} from "@/lib/types";
import { getContent } from "@/lib/content";

/**
 * Phase 0 목업 — 라이딩 섹션(Supabase 미설정 시 폴백).
 * 모든 상호/인물/코스명은 창작(실존 복붙 금지). 좌표/지도는 Phase 2 카카오맵 연동 자리.
 */

// ─── 라이딩 모임 (지역/기종별 번개·정모) ────────────────────
export const meetupsFallback: Meetup[] = [
  {
    id: "m1",
    type: "region",
    title: "서울 야간 한강 라이트런",
    region: "서울",
    host: "네온라이더",
    meetAt: "2026-07-05T20:00",
    capacity: 20,
    joined: 14,
    description:
      "해질녘 반포에서 모여 한강 다리를 잇는 저속 야간 정모. 초보 환영, 대열 라이딩 규칙 간단 브리핑 후 출발합니다.",
  },
  {
    id: "m2",
    type: "model",
    title: "GS 오너 어드벤처 번개",
    region: "경기",
    modelId: "bmw-r1250gs",
    host: "박서트윈",
    meetAt: "2026-07-06T09:00",
    capacity: 12,
    joined: 12,
    description:
      "GS 계열 어드벤처 오너들의 임도 맛보기 번개. 온·오프 겸용 타이어 권장, 우천 시 취소.",
  },
  {
    id: "m3",
    type: "region",
    title: "부산 해안도로 선셋 미팅",
    region: "부산",
    host: "해운대돌핀",
    meetAt: "2026-07-08T18:30",
    capacity: 25,
    joined: 9,
    description:
      "광안대교 야경과 해안 와인딩을 함께 도는 부산 정모. 커피 한 잔 하며 인증샷 타임 포함.",
  },
  {
    id: "m4",
    type: "model",
    title: "네이키드 미들급 합동 라이딩",
    region: "인천",
    modelId: "yamaha-mt09",
    host: "삼기통러버",
    meetAt: "2026-07-11T10:00",
    capacity: 16,
    joined: 7,
    description:
      "MT-09·Z900·CB650R 등 미들급 네이키드 오너 합동 투어. 영종도 한 바퀴 후 브런치.",
  },
  {
    id: "m5",
    type: "region",
    title: "강원 미시령 아침 와인딩",
    region: "강원",
    host: "고개사냥꾼",
    meetAt: "2026-07-12T07:00",
    capacity: 15,
    joined: 11,
    description:
      "차 없는 이른 아침 고갯길을 여유롭게 즐기는 와인딩 정모. 안전거리 준수, 무리한 추월 금지.",
  },
  {
    id: "m6",
    type: "model",
    title: "입문 스트리트 라이더 데이",
    region: "대전",
    modelId: "ktm-390duke",
    host: "듀크초보",
    meetAt: "2026-07-13T13:00",
    capacity: 18,
    joined: 5,
    description:
      "125~400cc 입문자 대상 저속 시내 투어와 코너링 팁 나눔. 헬멧·장갑 필수, 반팔 라이딩 금지.",
  },
  {
    id: "m7",
    type: "region",
    title: "제주 일주 서킷 정모",
    region: "제주",
    host: "돌하르방라이딩",
    meetAt: "2026-07-18T08:30",
    capacity: 30,
    joined: 22,
    description:
      "해안일주도로를 하루에 도는 제주 대형 정모. 렌트 바이크 참가 가능, 중간 체크포인트 3곳.",
  },
  {
    id: "m8",
    type: "region",
    title: "경기 남부 카페 투어 번개",
    region: "경기",
    host: "커피앤클러치",
    meetAt: "2026-07-20T11:00",
    capacity: 14,
    joined: 8,
    description:
      "라이더 친화 카페 두 곳을 잇는 짧은 번개. 느긋한 페이스, 사진 좋아하는 분들께 추천.",
  },
];

// ─── 라이딩 코스 ────────────────────────────────────────────
export const coursesFallback: Course[] = [
  {
    id: "c1",
    title: "미시령 옛길 와인딩 코스",
    author: "고개사냥꾼",
    region: "강원",
    distanceKm: 42,
    difficulty: "hard",
    roadCondition: "노면 양호, 급코너 다수·낙석 주의",
    rating: 4.8,
    reviewCount: 63,
    description:
      "연속 헤어핀이 이어지는 국내 대표 와인딩. 중급 이상 추천, 이른 아침 통행량이 적어 쾌적합니다.",
    isBest: true,
  },
  {
    id: "c2",
    title: "남해 물미해안도로 파노라마",
    author: "바다보러가자",
    region: "경남",
    distanceKm: 58,
    difficulty: "medium",
    roadCondition: "노면 우수, 관광 차량 혼재",
    rating: 4.9,
    reviewCount: 88,
    description:
      "다도해를 끼고 도는 시원한 해안 코스. 완만한 코너와 뷰포인트가 많아 투어러에게 최적입니다.",
    isBest: true,
  },
  {
    id: "c3",
    title: "북한강 라이트 크루징",
    author: "강변산책",
    region: "경기",
    distanceKm: 35,
    difficulty: "easy",
    roadCondition: "평탄·직선 위주, 자전거 혼재 주의",
    rating: 4.5,
    reviewCount: 41,
    description:
      "강변을 따라 여유롭게 흐르는 입문 크루징 코스. 초보 라이더와 스쿠터도 부담 없이 즐길 수 있습니다.",
  },
  {
    id: "c4",
    title: "지리산 성삼재 업힐",
    author: "구름위로",
    region: "전남",
    distanceKm: 27,
    difficulty: "hard",
    roadCondition: "급경사·급코너, 안개 잦음",
    rating: 4.7,
    reviewCount: 55,
    description:
      "고도차가 큰 업힐 와인딩. 브레이크와 시야 관리가 중요하며 안개 낀 날은 피하는 것이 좋습니다.",
    isBest: true,
  },
  {
    id: "c5",
    title: "영종도 공항 순환 코스",
    author: "삼기통러버",
    region: "인천",
    distanceKm: 31,
    difficulty: "easy",
    roadCondition: "넓고 평탄, 바람 강함",
    rating: 4.3,
    reviewCount: 29,
    description:
      "탁 트인 직선과 완만한 곡선의 순환 코스. 야간 라이트런과 사진 촬영 명소로 인기입니다.",
  },
  {
    id: "c6",
    title: "제주 1100고지 횡단",
    author: "돌하르방라이딩",
    region: "제주",
    distanceKm: 49,
    difficulty: "medium",
    roadCondition: "노면 양호, 기온차·돌풍 주의",
    rating: 4.9,
    reviewCount: 74,
    description:
      "해안에서 한라산 중턱까지 고도를 올리는 횡단 코스. 계절마다 풍경이 달라 사계절 인기입니다.",
    isBest: true,
  },
  {
    id: "c7",
    title: "포항 호미곶 일출 러닝",
    author: "동해파도",
    region: "경북",
    distanceKm: 46,
    difficulty: "medium",
    roadCondition: "해안 직선 위주, 이른 새벽 습기",
    rating: 4.6,
    reviewCount: 37,
    description:
      "일출 명소를 목적지로 삼는 새벽 코스. 완만한 해안선을 따라 달리며 아침 커피로 마무리합니다.",
  },
  {
    id: "c8",
    title: "충주호 순환 투어링",
    author: "호수한바퀴",
    region: "충북",
    distanceKm: 64,
    difficulty: "medium",
    roadCondition: "노면 우수, 리듬감 좋은 중속 코너",
    rating: 4.7,
    reviewCount: 52,
    description:
      "호수를 감싸는 중속 와인딩의 정석. 장거리 투어 연습과 그룹 라이딩 모두에 잘 맞습니다.",
  },
];

// ─── 행사/대회 ──────────────────────────────────────────────
export const eventsFallback: RidingEvent[] = [
  {
    id: "e1",
    type: "festival",
    title: "BAPL 라이더 서밋 2026",
    startsAt: "2026-07-19T10:00",
    location: "고양 킨텍스",
    description:
      "국내 라이더 커뮤니티가 모이는 데모 페스티벌. 브랜드 부스, 시승존, 안전 라이딩 세미나가 열립니다.",
  },
  {
    id: "e2",
    type: "race",
    title: "인제 클럽맨 트랙데이 라운드",
    startsAt: "2026-07-26T09:00",
    location: "인제 스피디움",
    description:
      "아마추어 라이더 대상 트랙데이. 클래스별 주행 세션과 라이딩 코칭이 제공됩니다.",
  },
  {
    id: "e3",
    type: "festival",
    title: "남해안 어드벤처 캠프",
    startsAt: "2026-08-08T14:00",
    location: "통영 일원",
    description:
      "어드벤처·투어러 오너를 위한 1박 캠핑 투어링 행사. 임도 체험과 야간 캠프파이어 세션.",
  },
  {
    id: "e4",
    type: "race",
    title: "슈퍼바이크 챔피언십 최종전",
    startsAt: "2026-08-23T11:00",
    location: "영암 코리아 서킷",
    description:
      "시즌을 마무리하는 로드레이스 최종 라운드. 관중 응원존과 피트워크 이벤트가 함께 열립니다.",
  },
  {
    id: "e5",
    type: "festival",
    title: "클래식 & 카페레이서 미트업",
    startsAt: "2026-09-05T13:00",
    location: "서울 성수 일원",
    description:
      "클래식·카페레이서 오너들의 도심 전시 미트업. 커스텀 빌드 콘테스트와 마켓 부스가 운영됩니다.",
  },
];

// ─── 라이더 플레이스 [입점] ─────────────────────────────────
export const placesFallback: Place[] = [
  {
    id: "p1",
    category: "food",
    cuisine: "korean",
    cafeType: "",
    name: "라이더스 밥집 한바퀴",
    region: "경기 양평",
    rating: 4.7,
    bikeParking: true,
    isSponsored: false,
    imageUrl: "",
    linkUrl: "",
    lat: 0,
    lng: 0,
    description:
      "대형 주차공간과 단체석을 갖춘 라이더 친화 백반집. 정모 후 식사 장소로 인기입니다.",
  },
  {
    id: "p2",
    category: "cafe",
    cuisine: "",
    cafeType: "rider",
    name: "클러치 커피 로스터리",
    region: "강원 춘천",
    rating: 4.8,
    bikeParking: true,
    isSponsored: false,
    imageUrl: "",
    linkUrl: "",
    lat: 0,
    lng: 0,
    description:
      "바이크 전용 주차 라인과 정비 공구 대여를 제공하는 라이더 카페. 뷰포인트 테라스가 명물입니다.",
  },
  {
    id: "p3",
    category: "wash",
    cuisine: "",
    cafeType: "",
    name: "투휠 셀프 세차 스테이션",
    region: "서울 강서",
    rating: 4.5,
    bikeParking: true,
    isSponsored: false,
    imageUrl: "",
    linkUrl: "",
    lat: 0,
    lng: 0,
    description:
      "이륜차 전용 리프트와 체인 청소존을 갖춘 셀프 세차장. 야간 운영으로 퇴근 후 이용 편리.",
  },
  {
    id: "p4",
    category: "food",
    cuisine: "korean",
    cafeType: "",
    name: "고갯마루 국숫집",
    region: "강원 인제",
    rating: 4.6,
    bikeParking: true,
    isSponsored: false,
    imageUrl: "",
    linkUrl: "",
    lat: 0,
    lng: 0,
    description:
      "와인딩 코스 중간에 위치한 라이더 단골 국숫집. 헬멧 보관대와 넓은 마당이 있습니다.",
  },
  {
    id: "p5",
    category: "cafe",
    cuisine: "",
    cafeType: "rider",
    name: "선셋 뷰 라이더스 라운지",
    region: "부산 기장",
    rating: 4.9,
    bikeParking: true,
    isSponsored: false,
    imageUrl: "",
    linkUrl: "",
    lat: 0,
    lng: 0,
    description:
      "해안도로변 노을 명소 카페. 바이크 인증샷 스팟과 라이딩 기어 보관 서비스를 제공합니다.",
  },
  {
    id: "p6",
    category: "wash",
    cuisine: "",
    cafeType: "",
    name: "미러샤인 디테일링 개러지",
    region: "경기 성남",
    rating: 4.7,
    bikeParking: true,
    isSponsored: false,
    imageUrl: "",
    linkUrl: "",
    lat: 0,
    lng: 0,
    description:
      "손세차와 광택·코팅 전문 개러지. 예약제로 운영되며 체인 정비 간단 점검을 함께 진행합니다.",
  },
];

// ─── 투어 일정 [제휴] ───────────────────────────────────────
export const tourPackagesFallback: TourPackage[] = [
  {
    id: "t1",
    partner: "제휴 여행사 A",
    title: "일본 규슈 4일 라이딩 투어",
    priceFromManwon: 129,
    description:
      "렌트 바이크·숙박·가이드 포함 규슈 온천 & 와인딩 패키지. 라이더 전용 소규모 그룹으로 운영됩니다.",
  },
  {
    id: "t2",
    partner: "어드벤처트립 코리아",
    title: "베트남 하장루프 6일 어드벤처",
    priceFromManwon: 189,
    description:
      "동남아 대표 산악 루프를 도는 어드벤처 투어. 오프로드 구간 지원 차량과 정비 서포트가 동행합니다.",
  },
  {
    id: "t3",
    partner: "제휴 여행사 A",
    title: "국내 남도 2일 투어링 리트릿",
    priceFromManwon: 55,
    description:
      "남해안 해안도로를 잇는 1박 국내 투어링. 숙소·식사·후미 지원 차량이 포함된 편안한 일정입니다.",
  },
  {
    id: "t4",
    partner: "알프스로드 트래블",
    title: "유럽 알프스 8일 패스 헌팅",
    priceFromManwon: 459,
    description:
      "유명 알프스 고갯길을 잇는 프리미엄 투어. 고배기량 투어러 렌트와 호텔 숙박이 포함됩니다.",
  },
];

// ─── 헬퍼 ───────────────────────────────────────────────────
export async function getMeetups(): Promise<Meetup[]> {
  return getContent("riding.meetups", meetupsFallback);
}

export async function getCourses(): Promise<Course[]> {
  return getContent("riding.courses", coursesFallback);
}

export async function getEvents(): Promise<RidingEvent[]> {
  return getContent("riding.events", eventsFallback);
}

/** "p1" < "p2" < "p10" 순으로 정렬되는 자연 정렬(숫자 구간을 수치로 비교). */
function naturalCompare(a: string, b: string): number {
  const chunk = (s: string) => s.match(/\d+|\D+/g) ?? [];
  const ac = chunk(a);
  const bc = chunk(b);
  for (let i = 0; i < Math.max(ac.length, bc.length); i++) {
    const x = ac[i] ?? "";
    const y = bc[i] ?? "";
    if (x === y) continue;
    const nx = Number(x);
    const ny = Number(y);
    if (!Number.isNaN(nx) && !Number.isNaN(ny)) return nx - ny;
    return x < y ? -1 : 1;
  }
  return 0;
}

export async function getPlaces(): Promise<Place[]> {
  const places = await getContent("riding.places", placesFallback);
  return [...places].sort((a, b) => naturalCompare(a.id, b.id));
}

export async function getTourPackages(): Promise<TourPackage[]> {
  return getContent("riding.tourPackages", tourPackagesFallback);
}

export async function getBestCourses(): Promise<Course[]> {
  const courses = await getCourses();
  return courses.filter((c) => c.isBest);
}

export async function getMeetup(id: string): Promise<Meetup | undefined> {
  const meetups = await getMeetups();
  return meetups.find((m) => m.id === id);
}

export async function getCourse(id: string): Promise<Course | undefined> {
  const courses = await getCourses();
  return courses.find((c) => c.id === id);
}

/** startsAt 기준 오름차순 정렬된 행사/대회 */
export async function getEventsByDate(): Promise<RidingEvent[]> {
  const events = await getEvents();
  return [...events].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

/** 카테고리별 플레이스 필터 */
export async function placesByCategory(category: Place["category"] | "all"): Promise<Place[]> {
  const places = await getPlaces();
  if (category === "all") return places;
  return places.filter((p) => p.category === category);
}
