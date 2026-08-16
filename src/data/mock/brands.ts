import type { Brand } from "@/lib/types";
import { getContent } from "@/lib/content";

/**
 * Phase 0 목업 — 브랜드 11개(Supabase 미설정 시 폴백으로도 사용).
 * 설명은 창작(실존 홍보문구 복붙 금지). 대표색/설립연도는 일반 상식 수준.
 */
export const brandsFallback: Brand[] = [
  {
    id: "bmw",
    name: "BMW Motorrad",
    nameKo: "BMW 모토라드",
    country: "DE",
    logoText: "BMW",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Logo_BMW_Motorrad_2021.svg/330px-Logo_BMW_Motorrad_2021.svg.png",
    accent: "#0166B1",
    foundedYear: 1923,
    modelCount: 3,
    homepage: "",
    blog: "",
    instagram: "",
    youtube: "",
    description:
      "독일 정통 엔지니어링의 상징. 박서 트윈부터 어드벤처의 대명사 GS 라인까지, 장거리 투어링과 첨단 라이더 보조 전자장비에서 앞서가는 프리미엄 브랜드입니다.",
  },
  {
    id: "honda",
    name: "Honda",
    nameKo: "혼다",
    country: "JP",
    logoText: "HONDA",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Honda_Logo.svg/330px-Honda_Logo.svg.png",
    accent: "#E60012",
    foundedYear: 1948,
    modelCount: 2,
    homepage: "",
    blog: "",
    instagram: "",
    youtube: "",
    description:
      "세계 최대 이륜차 제조사. 압도적인 내구성과 완성도, 입문부터 슈퍼스포츠까지 가장 넓은 라인업을 갖춘 '실패 없는 선택'의 대표주자입니다.",
  },
  {
    id: "ducati",
    name: "Ducati",
    nameKo: "두카티",
    country: "IT",
    logoText: "DUCATI",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Logo_Ducati.svg/330px-Logo_Ducati.svg.png",
    accent: "#D80000",
    foundedYear: 1926,
    modelCount: 2,
    homepage: "",
    blog: "",
    instagram: "",
    youtube: "",
    description:
      "이탈리아 볼로냐의 열정. L-트윈 데스모드로믹 엔진 특유의 사운드와 감성, 레이싱 DNA를 그대로 옮긴 디자인으로 라이더의 로망이 되는 브랜드입니다.",
  },
  {
    id: "ktm",
    name: "KTM",
    nameKo: "KTM",
    country: "AT",
    logoText: "KTM",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/KTM-Logo.svg/330px-KTM-Logo.svg.png",
    accent: "#FF6600",
    foundedYear: 1953,
    modelCount: 2,
    homepage: "",
    blog: "",
    instagram: "",
    youtube: "",
    description:
      "'Ready to Race'. 오렌지 프레임으로 대표되는 오스트리아의 공격적 캐릭터. 오프로드와 스트리트를 아우르는 가볍고 날카로운 주행 성향이 특징입니다.",
  },
  {
    id: "husqvarna",
    name: "Husqvarna",
    nameKo: "허스크바나",
    country: "AT",
    logoText: "HQV",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Husqvarna_logo.svg/330px-Husqvarna_logo.svg.png",
    accent: "#F7D417",
    foundedYear: 1903,
    modelCount: 1,
    homepage: "",
    blog: "",
    instagram: "",
    youtube: "",
    description:
      "스칸디나비아 헤리티지와 미니멀 스칸디 디자인. 스크램블러 감성의 스트리트 라인 '스바르트필렌/빅틸렌'으로 도심 라이더에게 독보적 개성을 제공합니다.",
  },
  {
    id: "yamaha",
    name: "Yamaha",
    nameKo: "야마하",
    country: "JP",
    logoText: "YAMAHA",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Yamaha_Motor_logo.svg/330px-Yamaha_Motor_logo.svg.png",
    accent: "#0B3D91",
    foundedYear: 1955,
    modelCount: 2,
    homepage: "",
    blog: "",
    instagram: "",
    youtube: "",
    description:
      "크로스플레인 크랭크의 사운드와 균형 잡힌 핸들링. 'MT' 하이퍼네이키드와 'R' 슈퍼스포츠로 감성과 성능의 밸런스를 추구하는 브랜드입니다.",
  },
  {
    id: "kawasaki",
    name: "Kawasaki",
    nameKo: "가와사키",
    country: "JP",
    logoText: "Kawasaki",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Kawasaki_Motors_logo.svg/330px-Kawasaki_Motors_logo.svg.png",
    accent: "#52A31D",
    foundedYear: 1896,
    modelCount: 2,
    homepage: "",
    blog: "",
    instagram: "",
    youtube: "",
    description:
      "라임그린의 강렬함. 슈퍼차저 H2 시리즈부터 실용적인 Z/닌자 라인까지, 대담한 파워와 아이코닉한 컬러로 강한 인상을 남기는 일본 브랜드입니다.",
  },
  {
    id: "suzuki",
    name: "Suzuki",
    nameKo: "스즈키",
    country: "JP",
    logoText: "SUZUKI",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Suzuki_logo_2025_(symbol).svg/330px-Suzuki_logo_2025_(symbol).svg.png",
    accent: "#1D6BC6",
    foundedYear: 1909,
    modelCount: 1,
    homepage: "",
    blog: "",
    instagram: "",
    youtube: "",
    description:
      "가성비와 실용의 정석. GSX 시리즈와 브이스트롬 어드벤처로 검증된 신뢰성과 합리적 가격을 앞세우는 실속형 라이더의 선택입니다.",
  },
  {
    id: "harley",
    name: "Harley-Davidson",
    nameKo: "할리데이비슨",
    country: "US",
    logoText: "H-D",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Harley-Davidson_logo.svg/330px-Harley-Davidson_logo.svg.png",
    accent: "#EA7125",
    foundedYear: 1903,
    modelCount: 1,
    homepage: "",
    blog: "",
    instagram: "",
    youtube: "",
    description:
      "아메리칸 크루저의 아이콘. V-트윈 특유의 진동과 사운드, 커스텀 문화와 라이프스타일 그 자체를 파는 헤리티지 브랜드입니다.",
  },
  {
    id: "indian",
    name: "Indian Motorcycle",
    nameKo: "인디언",
    country: "US",
    logoText: "INDIAN",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Indian_Motorcycle_logo.svg/330px-Indian_Motorcycle_logo.svg.png",
    accent: "#C8102E",
    foundedYear: 1901,
    modelCount: 1,
    homepage: "",
    blog: "",
    instagram: "",
    youtube: "",
    description:
      "미국에서 가장 오래된 모터사이클 브랜드. 클래식한 밸런스드 디자인과 강력한 썬더스트로크 엔진으로 정통 아메리칸 감성을 이어갑니다.",
  },
  {
    id: "triumph",
    name: "Triumph",
    nameKo: "트라이엄프",
    country: "GB",
    logoText: "TRIUMPH",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Logo_Triumph.svg/330px-Logo_Triumph.svg.png",
    accent: "#B31B34",
    foundedYear: 1902,
    modelCount: 1,
    homepage: "",
    blog: "",
    instagram: "",
    youtube: "",
    description:
      "브리티시 모던 클래식의 정수. 본네빌 계열의 시대를 초월한 스타일과 부드러운 트리플/트윈 엔진으로 클래식과 현대 기술을 조화시킵니다.",
  },
];

export async function getBrands(): Promise<Brand[]> {
  return getContent("brands", brandsFallback);
}

export async function getBrand(id: string): Promise<Brand | undefined> {
  const brands = await getBrands();
  return brands.find((b) => b.id === id);
}
