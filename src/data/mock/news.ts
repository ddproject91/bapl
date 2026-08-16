import type { NewsItem } from "@/lib/types";
import { getContent } from "@/lib/content";

/** Phase 0 목업 — 뉴스(Supabase 미설정 시 폴백). 창작 콘텐츠(실제 기사 복붙 금지). */
export const newsFallback: NewsItem[] = [
  {
    id: "n1",
    category: "law",
    title: "이륜차 정기검사 대상 확대 논의 — 라이더가 알아야 할 것",
    summary: "배기량 기준 정기검사 확대안이 검토되며 라이더 커뮤니티에서 관심이 높다.",
    content:
      "이륜차 안전관리 강화를 위한 정기검사 대상 확대안이 논의되고 있습니다. 확정 시 대상 차량과 주기, 검사 항목이 달라질 수 있어 사전에 내 차량의 해당 여부를 확인해 두는 것이 좋습니다. (본 콘텐츠는 데모용 창작 기사입니다.)",
    source: "BAPL 뉴스룸",
    imageUrl: "",
    publishedAt: "2026-06-28",
  },
  {
    id: "n2",
    category: "newbike",
    title: "BMW R 1250 GS 2024 컬러 추가 — GS 트로피 에디션",
    summary: "어드벤처의 왕좌 GS에 새로운 트로피 컬러웨이가 더해졌다.",
    content: "장거리 투어러 R 1250 GS에 새 컬러 옵션이 추가되었습니다.",
    brandId: "bmw",
    modelId: "bmw-r1250gs",
    source: "BAPL 뉴스룸",
    imageUrl: "",
    publishedAt: "2026-06-20",
  },
  {
    id: "n3",
    category: "newbike",
    title: "KTM 390 듀크 신형, 전자장비 대폭 강화",
    summary: "입문급 강자 390 듀크가 새 프레임과 코너링 ABS로 무장했다.",
    content: "가성비 입문 스트리트파이터 390 듀크가 세대 교체로 완성도를 높였습니다.",
    brandId: "ktm",
    modelId: "ktm-390duke",
    source: "BAPL 뉴스룸",
    imageUrl: "",
    publishedAt: "2026-06-12",
  },
  {
    id: "n4",
    category: "recall",
    title: "일부 모델 브레이크 호스 자발적 리콜 안내",
    summary: "특정 생산분에 대한 자발적 무상 점검이 진행된다.",
    content:
      "해당 차대번호 범위 차량은 공식 서비스센터에서 무상 점검을 받을 수 있습니다. 내 차량 해당 여부는 차대번호로 조회하세요. (데모용 창작 콘텐츠)",
    source: "BAPL 뉴스룸",
    imageUrl: "",
    publishedAt: "2026-06-05",
  },
  {
    id: "n5",
    category: "industry",
    title: "국내 미들급 네이키드 시장 성장세 — 3·4기통 인기",
    summary: "MT-09, Z900, CB650R 등 미들·리터급 네이키드 수요가 꾸준하다.",
    content: "실용성과 재미를 겸비한 네이키드 카테고리의 인기가 이어지고 있습니다.",
    source: "BAPL 뉴스룸",
    imageUrl: "",
    publishedAt: "2026-05-30",
  },
  {
    id: "n6",
    category: "blog",
    title: "[에디토리얼] 첫 바이크 고르는 법 — 배기량보다 중요한 것",
    summary: "입문자가 흔히 하는 실수와 현실적인 첫차 선택 기준을 정리했다.",
    content:
      "배기량 숫자보다 체격/용도/취급성이 첫차 만족도를 좌우합니다. 시승과 커뮤니티 후기를 적극 활용하세요.",
    source: "BAPL 에디터",
    imageUrl: "",
    publishedAt: "2026-05-24",
  },
];

export async function getNewsList(): Promise<NewsItem[]> {
  return getContent("news", newsFallback);
}

export async function getNews(id: string): Promise<NewsItem | undefined> {
  const news = await getNewsList();
  return news.find((n) => n.id === id);
}
