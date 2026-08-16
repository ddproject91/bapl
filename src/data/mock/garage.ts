import type {
  MaintenanceGuide,
  ConsumableCycle,
  RepairCost,
  DiagnosisFlow,
  UserBike,
  Faq,
} from "@/lib/types";
import { getContent } from "@/lib/content";

/**
 * Phase 0 목업 — 정비/관리(Garage) 섹션 데이터(Supabase 미설정 시 폴백).
 * myBikes/maintenanceLogs는 데모 계정 개인 데이터라 Supabase로 옮기지 않고 정적 유지.
 * 정비 가이드/비용/진단 내용은 일반 상식 수준의 창작.
 * 실존 업체/인물/타 커뮤니티 콘텐츠 복붙 없음.
 */

// ─── 정비 매뉴얼 ───────────────────────────────────────────
export const maintenanceGuidesFallback: MaintenanceGuide[] = [
  {
    id: "oil-change",
    task: "엔진오일 & 오일필터 교체",
    difficulty: "easy",
    summary:
      "드레인 볼트로 폐유를 빼고 신유를 규정량 주입, 필터를 교체합니다. 워밍업 후 작업하면 배출이 원활합니다.",
  },
  {
    id: "chain-care",
    task: "체인 세척 및 급유",
    modelName: "MT-09",
    difficulty: "easy",
    summary:
      "체인 클리너로 이물질을 제거하고 건조 후 전용 루브를 도포합니다. 400~500km 주기 관리가 수명을 좌우합니다.",
  },
  {
    id: "brake-pad",
    task: "브레이크 패드 교체",
    modelName: "Z900",
    difficulty: "medium",
    summary:
      "캘리퍼를 분리해 마모된 패드를 교체하고 피스톤을 밀어 넣습니다. 교체 후 레버를 여러 번 잡아 압을 채우세요.",
  },
  {
    id: "air-filter",
    task: "에어필터 점검·교체",
    difficulty: "easy",
    summary:
      "시트·탱크를 들어내 에어박스를 열고 필터 오염도를 확인합니다. 건식은 교체, 습식은 세척 후 오일 도포합니다.",
  },
  {
    id: "coolant",
    task: "냉각수(부동액) 교체",
    difficulty: "medium",
    summary:
      "라디에이터를 비우고 규정 냉각수를 주입한 뒤 에어빼기를 진행합니다. 수랭 모델의 열관리에 필수 작업입니다.",
  },
  {
    id: "spark-plug",
    task: "스파크플러그 교체",
    modelName: "CB650R",
    difficulty: "medium",
    summary:
      "다기통은 탱크·에어박스 탈거가 필요합니다. 규정 갭·토크를 지켜 체결해야 실화·출력 저하를 막습니다.",
  },
  {
    id: "valve-clearance",
    task: "밸브 간극 점검·조정",
    modelName: "R 1250 GS",
    difficulty: "hard",
    summary:
      "규정 주기에 시크니스 게이지로 간극을 측정하고 심/로커로 조정합니다. 정밀 작업이라 셀프 난이도가 높습니다.",
  },
  {
    id: "tire-pressure",
    task: "타이어 공기압·마모 점검",
    difficulty: "easy",
    summary:
      "냉간 상태에서 규정 공기압을 확인하고 트레드 마모·편마모를 점검합니다. 접지·연비·안정성의 기본입니다.",
  },
];

// ─── 소모품 교체 주기 ──────────────────────────────────────
export const consumableCyclesFallback: ConsumableCycle[] = [
  {
    item: "oil",
    itemKo: "엔진오일",
    intervalKm: 6000,
    intervalMonths: 12,
    note: "고회전·시내 위주 주행 시 주기를 앞당기세요.",
  },
  {
    item: "chain",
    itemKo: "체인 & 스프라켓",
    intervalKm: 25000,
    intervalMonths: 36,
    note: "세척·급유는 400~500km마다 별도 관리.",
  },
  {
    item: "tire",
    itemKo: "타이어",
    intervalKm: 15000,
    intervalMonths: 36,
    note: "마모 한계선·제조일(4년) 중 먼저 도달 시 교체.",
  },
  {
    item: "pad",
    itemKo: "브레이크 패드",
    intervalKm: 20000,
    intervalMonths: 24,
    note: "서킷·산길 위주면 마모가 훨씬 빠릅니다.",
  },
  {
    item: "coolant",
    itemKo: "냉각수",
    intervalKm: 24000,
    intervalMonths: 24,
    note: "수랭 모델 기준. 변색·수위 정기 점검 권장.",
  },
  {
    item: "plug",
    itemKo: "스파크플러그",
    intervalKm: 12000,
    intervalMonths: 24,
    note: "이리듐 플러그는 주기가 더 길 수 있습니다.",
  },
];

// ─── 정비 비용 시세 (유저 제보 컨셉) ───────────────────────
export const repairCostsFallback: RepairCost[] = [
  { task: "엔진오일 + 필터 교체", costManwon: 8, region: "서울" },
  { task: "체인 & 스프라켓 세트 교체", modelName: "MT-09", costManwon: 25, region: "경기" },
  { task: "브레이크 패드 교체 (전륜)", modelName: "Z900", costManwon: 12, region: "부산" },
  { task: "리어 타이어 교체 (공임 포함)", modelName: "MT-09", costManwon: 28, region: "인천" },
  { task: "밸브 간극 점검·조정", modelName: "R 1250 GS", costManwon: 45, region: "서울" },
  { task: "냉각수 교체", costManwon: 9, region: "대구" },
  { task: "배터리 교체", costManwon: 18, region: "광주" },
  { task: "스파크플러그 교체 (4기통)", modelName: "CB650R", costManwon: 15, region: "대전" },
];

// ─── 고장 진단 가이드 ──────────────────────────────────────
export const diagnosisFlowsFallback: DiagnosisFlow[] = [
  {
    id: "no-start",
    symptom: "시동이 걸리지 않음",
    causes: [
      { cause: "배터리 방전", action: "전압(12.6V 이상) 점검, 충전 또는 점프 스타트 후 교체 검토." },
      { cause: "킬 스위치 / 사이드 스탠드", action: "킬 스위치 RUN 위치, 스탠드 접힘·기어 중립 여부 확인." },
      { cause: "퓨즈 단선", action: "메인 퓨즈박스 점검 후 규격에 맞는 퓨즈로 교체." },
      { cause: "연료 부족·연료펌프", action: "연료 잔량과 시동 시 펌프 구동음(윙-) 확인." },
    ],
  },
  {
    id: "battery-drain",
    symptom: "배터리가 자주 방전됨",
    causes: [
      { cause: "장기 미운행", action: "2주 이상 미운행 시 배터리 텐더(유지 충전기) 연결." },
      { cause: "충전계통(레귤레이터) 이상", action: "주행 중 충전 전압(13.5~14.5V) 측정, 불량 시 부품 교체." },
      { cause: "암전류 과다", action: "블랙박스·USB 등 상시 전원 액세서리 배선 점검." },
      { cause: "배터리 수명", action: "3년 이상·용량 저하 시 신품 교체." },
    ],
  },
  {
    id: "abnormal-noise",
    symptom: "주행 중 이상 소음",
    causes: [
      { cause: "체인 장력·마모", action: "체인 처짐 규정치 확인, 세척·급유 또는 세트 교체." },
      { cause: "브레이크 패드 마모", action: "금속 마찰음이면 즉시 패드 교체, 디스크 손상 점검." },
      { cause: "베어링 유격", action: "휠·스티어링 베어링 유격 점검, 필요 시 교체." },
      { cause: "체결 볼트 풀림", action: "단기통 진동 모델은 주요 볼트 토크 재점검." },
    ],
  },
  {
    id: "warning-light",
    symptom: "엔진 경고등 점등",
    causes: [
      { cause: "센서 오류(산소·흡기 등)", action: "진단기(OBD) 코드 확인, 커넥터 접촉·오염 점검." },
      { cause: "연료·점화 계통", action: "실화·부조 동반 시 플러그·인젝터 점검." },
      { cause: "일시적 오류", action: "재시동으로 해소되면 경과 관찰, 반복 시 정비소 진단." },
    ],
  },
  {
    id: "power-loss",
    symptom: "출력 저하 / 울컥거림",
    causes: [
      { cause: "에어필터 오염", action: "필터 오염도 확인 후 세척·교체로 흡기 회복." },
      { cause: "연료 품질·인젝터", action: "저질 연료 배출, 인젝터 클리닝 시공 검토." },
      { cause: "점화 플러그 노후", action: "갭·전극 상태 확인 후 규정 플러그로 교체." },
      { cause: "클러치 미끄러짐", action: "가속 시 회전수만 오르면 클러치 디스크 점검." },
    ],
  },
];

// ─── FAQ ───────────────────────────────────────────────────
export const faqFallback: Faq[] = [
  {
    q: "엔진오일은 얼마나 자주 교체하나요?",
    a: "모델·오일 등급에 따라 다르지만 통상 5,000~6,000km 또는 1년 중 먼저 도달하는 시점을 권장합니다. 고회전·시내 정체 주행이 잦으면 주기를 앞당기는 것이 좋습니다.",
  },
  {
    q: "셀프 정비, 어디까지 해도 될까요?",
    a: "오일·체인·에어필터·공기압처럼 난이도가 낮은 소모품 관리는 셀프로 충분합니다. 다만 밸브 간극, 냉각계통, 브레이크 유압처럼 안전·정밀과 직결된 작업은 전문 정비소를 권장합니다.",
  },
  {
    q: "겨울철 장기 보관은 어떻게 하나요?",
    a: "연료를 가득 채우고 배터리 텐더를 연결한 뒤, 타이어 공기압을 규정보다 약간 높여 보관하세요. 2주 이상 미운행 시 배터리 방전 예방이 핵심입니다.",
  },
  {
    q: "체인은 얼마나 자주 관리하나요?",
    a: "세척·급유는 400~500km 또는 우천 주행 후마다 권장합니다. 체인 세트(체인+스프라켓) 자체는 약 20,000~25,000km를 교체 목표로 보되 마모·처짐 상태를 함께 확인하세요.",
  },
  {
    q: "정비 비용 시세는 어떻게 확인하나요?",
    a: "'정비 비용 정보'에서 작업별·지역별 예상 시세를 확인할 수 있습니다. 데모 단계에서는 목업 데이터이며, 정식 오픈 후 유저 제보로 실제 시세가 축적됩니다.",
  },
];

// ─── 정비 기록 (마이페이지 '내 바이크' 연동 목업) ──────────
export interface MaintenanceLogEntry {
  id: string;
  bikeId: string;
  task: string;
  costManwon: number;
  odometerKm: number;
  date: string;
  shop?: string;
}

export const myBikes: UserBike[] = [
  {
    id: "ub1",
    modelId: "yamaha-mt09",
    nickname: "다크세이버",
    odometerKm: 13400,
    purchasedAt: "2024-05-10",
  },
  {
    id: "ub2",
    modelId: "ktm-390duke",
    nickname: "오렌지불릿",
    odometerKm: 8200,
    purchasedAt: "2025-03-22",
  },
];

export const maintenanceLogs: MaintenanceLogEntry[] = [
  { id: "ml1", bikeId: "ub1", task: "엔진오일 + 필터 교체", costManwon: 9, odometerKm: 12000, date: "2026-05-18", shop: "셀프 정비" },
  { id: "ml2", bikeId: "ub1", task: "체인 세척·급유", costManwon: 2, odometerKm: 11500, date: "2026-04-30", shop: "셀프 정비" },
  { id: "ml3", bikeId: "ub1", task: "리어 타이어 교체", costManwon: 28, odometerKm: 10800, date: "2026-03-12", shop: "라이더스 정비" },
  { id: "ml4", bikeId: "ub2", task: "엔진오일 교체", costManwon: 7, odometerKm: 7000, date: "2026-06-02", shop: "코너웍스" },
  { id: "ml5", bikeId: "ub2", task: "브레이크 패드 교체", costManwon: 11, odometerKm: 6400, date: "2026-04-08", shop: "코너웍스" },
];

// ─── 입점 예정 정비소 미리보기 (목업) ──────────────────────
export interface ShopPreview {
  id: string;
  name: string;
  region: string;
  rating: number;
  specialty: string;
}

export const shopPreviewsFallback: ShopPreview[] = [
  { id: "sp1", name: "라이더스 정비", region: "서울 성동구", rating: 4.8, specialty: "수입 대형·전자장비" },
  { id: "sp2", name: "코너웍스", region: "경기 성남시", rating: 4.6, specialty: "스포츠·서스펜션 세팅" },
  { id: "sp3", name: "트윈밸리 모터스", region: "부산 해운대구", rating: 4.7, specialty: "크루저·커스텀" },
  { id: "sp4", name: "임도공작소", region: "강원 춘천시", rating: 4.5, specialty: "어드벤처·오프로드" },
];

// ─── 헬퍼 ──────────────────────────────────────────────────
export async function getMaintenanceGuides(): Promise<MaintenanceGuide[]> {
  return getContent("garage.maintenanceGuides", maintenanceGuidesFallback);
}

export async function getConsumableCycles(): Promise<ConsumableCycle[]> {
  return getContent("garage.consumableCycles", consumableCyclesFallback);
}

export async function getRepairCosts(): Promise<RepairCost[]> {
  return getContent("garage.repairCosts", repairCostsFallback);
}

export async function getDiagnosisFlows(): Promise<DiagnosisFlow[]> {
  return getContent("garage.diagnosisFlows", diagnosisFlowsFallback);
}

export async function getGarageFaq(): Promise<Faq[]> {
  return getContent("garage.faq", faqFallback);
}

export async function getShopPreviews(): Promise<ShopPreview[]> {
  return getContent("garage.shopPreviews", shopPreviewsFallback);
}

export type CycleStatus = "ok" | "dueSoon" | "overdue";

/**
 * 주행거리 기반 소모품 교체 임박 여부 계산(목업 로직).
 * 현재 주기 구간에서 남은 거리를 구해 임박/초과를 판정한다.
 */
export function computeCycleStatus(
  odometerKm: number,
  cycle: ConsumableCycle,
): { remainingKm: number; status: CycleStatus } {
  const into = odometerKm % cycle.intervalKm;
  const remainingKm = cycle.intervalKm - into;
  let status: CycleStatus = "ok";
  if (remainingKm <= 500) status = "overdue";
  else if (remainingKm <= cycle.intervalKm * 0.15) status = "dueSoon";
  return { remainingKm, status };
}

export function getLogsByBike(bikeId: string): MaintenanceLogEntry[] {
  return maintenanceLogs
    .filter((l) => l.bikeId === bikeId)
    .sort((a, b) => b.date.localeCompare(a.date));
}
