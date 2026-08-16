import type { Board, Post } from "@/lib/types";

/**
 * Phase 0 목업 — 커뮤니티 게시판/글 순수 데이터.
 * 서버 전용 코드(getSupabaseAdmin 등)에 의존하지 않는 별도 파일로 분리해서
 * 클라이언트 컴포넌트(마이페이지 등)에서도 안전하게 import할 수 있게 한다.
 * 전부 창작 콘텐츠. 실존 인물/실제 사고영상/타 커뮤니티 글 복붙 금지.
 * 사고/블랙박스 글은 번호판 등 개인정보 없는 일반적 상황 묘사만 사용.
 */

// ─── 게시판 ────────────────────────────────────────────────
export const boardsFallback: Board[] = [
  {
    slug: "free",
    name: "자유게시판",
    type: "free",
    description: "라이딩 일상부터 잡담까지, 라이더들의 사랑방",
    icon: "💬",
  },
  {
    slug: "accident",
    name: "사고/블랙박스",
    type: "accident",
    description: "블랙박스 영상으로 과실·대처 조언을 나눠요 (개인정보 블러 필수)",
    icon: "🎥",
  },
  {
    slug: "qna",
    name: "질문/지식인",
    type: "qna",
    description: "궁금한 건 뭐든 물어보세요. 채택 시스템으로 좋은 답을 골라요",
    icon: "❓",
  },
  {
    slug: "diy",
    name: "정비/DIY",
    type: "diy",
    description: "셀프 정비 노하우와 작업 기록 공유",
    icon: "🔧",
  },
  {
    slug: "tuning",
    name: "튜닝/커스텀",
    type: "tuning",
    description: "내 바이크를 나만의 스타일로 — 튜닝 사례와 파츠 정보",
    icon: "🛠️",
  },
  {
    slug: "tour",
    name: "투어/여행",
    type: "tour",
    description: "장거리 투어 후기, 코스 추천, 여행 꿀팁",
    icon: "🗺️",
  },
  {
    slug: "notice",
    name: "이벤트/공지",
    type: "notice",
    description: "BAPL 운영 소식과 이벤트 안내",
    icon: "📢",
  },
];

// ─── 게시글 ────────────────────────────────────────────────
export const postsFallback: Post[] = [
  // ── 이벤트/공지 (notice) ──
  {
    id: "c-notice-1",
    boardSlug: "notice",
    author: "BAPL 운영팀",
    authorVerified: true,
    isNotice: true,
    title: "[공지] 커뮤니티 이용 규칙 및 라이더 인증 안내",
    excerpt:
      "건강한 커뮤니티를 위한 기본 규칙과 라이더 인증 뱃지 발급 기준을 안내드립니다.",
    content:
      "안녕하세요, BAPL 운영팀입니다.\n\n서로 존중하는 라이딩 문화를 위해 아래 규칙을 지켜주세요.\n\n1. 상대를 비방하거나 조롱하는 글/댓글은 제재 대상입니다.\n2. 사고/블랙박스 게시판은 번호판·얼굴 등 개인정보를 반드시 블러 처리 후 업로드해 주세요.\n3. 광고·도배·불법 개조 조장 글은 삭제됩니다.\n\n[라이더 인증]\n면허와 보유 차량을 확인하면 '라이더 인증' 뱃지가 부여됩니다. 인증 라이더의 글과 답변은 목록에서 우선 노출되며, 신뢰 기반 커뮤니티의 핵심입니다. (본 안내는 데모용 창작 콘텐츠입니다.)",
    hasVideo: false,
    viewCount: 8421,
    likeCount: 132,
    commentCount: 14,
    createdAt: "2026-06-01",
  },
  {
    id: "c-notice-2",
    boardSlug: "notice",
    author: "BAPL 운영팀",
    authorVerified: true,
    isNotice: true,
    title: "[이벤트] 여름맞이 라이딩 인증샷 콘테스트",
    excerpt:
      "여름 라이딩 사진을 올리고 포인트와 굿즈를 받아가세요. 참여 방법 안내.",
    content:
      "무더위를 뚫고 달리는 여름 라이딩! 인증샷 콘테스트를 시작합니다.\n\n- 기간: 데모 기간 상시\n- 참여: 자유게시판에 여름 라이딩 사진 + #여름라이딩 태그\n- 혜택: 베스트 선정 시 활동 포인트 및 굿즈 (데모)\n\n안전 장비 착용 사진일수록 가산점! 안전 라이딩 부탁드립니다.",
    viewCount: 3980,
    likeCount: 88,
    commentCount: 9,
    createdAt: "2026-06-15",
  },
  {
    id: "c-notice-3",
    boardSlug: "notice",
    author: "BAPL 운영팀",
    authorVerified: true,
    title: "[안내] 사고/블랙박스 게시판 개인정보 처리 정책",
    excerpt:
      "블랙박스 영상 업로드 시 지켜야 할 개인정보 블러 처리 가이드입니다.",
    content:
      "사고/블랙박스 영상을 공유할 때는 번호판, 얼굴, 상호 등 식별 가능한 개인정보를 반드시 가려주세요. 미처리 영상은 운영팀이 임시 비공개할 수 있습니다. 조언 목적의 상황 묘사에 집중해 주세요.",
    viewCount: 2110,
    likeCount: 45,
    commentCount: 3,
    createdAt: "2026-06-18",
  },

  // ── 자유게시판 (free) ──
  {
    id: "c-free-1",
    boardSlug: "free",
    author: "심야질주냥",
    authorVerified: true,
    title: "새벽 강변북로 라이딩 진짜 힐링이네요",
    excerpt:
      "차 없는 새벽에 시원한 바람 맞으며 달리니 스트레스가 싹 날아갑니다.",
    content:
      "요즘 잠이 안 와서 새벽에 종종 나가는데, 텅 빈 도로에서 선선한 바람 맞으며 달리니 이게 진짜 힐링이더라고요. 물론 졸음운전은 절대 금물, 컨디션 좋을 때만 나갑니다. 다들 야간 라이딩 할 때 반사 장비 꼭 챙기세요!",
    viewCount: 1543,
    likeCount: 96,
    commentCount: 21,
    createdAt: "2026-06-27",
  },
  {
    id: "c-free-2",
    boardSlug: "free",
    author: "월급도둑라이더",
    title: "드디어 첫 바이크 출고했습니다 (사진 많음)",
    excerpt: "2년을 고민하다 드디어 데뷔합니다. 안전 라이딩 다짐!",
    content:
      "장롱면허 탈출하고 학원 다니고 연습하고… 우여곡절 끝에 오늘 드디어 첫 바이크를 데려왔습니다. 아직 저속에서 뒤뚱대지만 천천히 배워가려고요. 선배님들 조언 부탁드립니다!",
    viewCount: 2201,
    likeCount: 154,
    commentCount: 43,
    createdAt: "2026-06-25",
  },
  {
    id: "c-free-3",
    boardSlug: "free",
    author: "치킨보다바이크",
    title: "장마 오기 전에 다들 뭐 준비하시나요?",
    excerpt: "우기 대비 타이어랑 레인기어 점검 얘기 나눠봐요.",
    content:
      "곧 장마철인데 빗길 라이딩이 제일 무섭더라고요. 저는 타이어 마모 확인하고 레인수트 하나 새로 장만했습니다. 다들 우기 대비 어떻게 하시는지 궁금해요.",
    viewCount: 987,
    likeCount: 41,
    commentCount: 18,
    createdAt: "2026-06-22",
  },
  {
    id: "c-free-4",
    boardSlug: "free",
    author: "두바퀴철학자",
    authorVerified: true,
    title: "라이딩 3년차, 초심 잃지 말자는 다짐 글",
    excerpt: "익숙해질수록 무서운 줄 모른다는 말이 진짜였습니다.",
    content:
      "처음엔 그렇게 조심하더니 요즘 슬슬 과속하는 제 자신을 발견하고 반성 중입니다. 익숙함이 제일 위험한 것 같아요. 초심 잃지 말고 안전하게 오래 타는 게 목표입니다.",
    viewCount: 1320,
    likeCount: 112,
    commentCount: 27,
    createdAt: "2026-06-19",
  },
  {
    id: "c-free-5",
    boardSlug: "free",
    author: "헬멧머리라이더",
    title: "여름 라이딩 필수템 공유해요",
    excerpt: "쿨링 이너, 통풍 장갑 등 여름 나기 아이템 추천.",
    content:
      "여름에 풀장비 하면 정말 덥죠. 저는 쿨링 이너웨어랑 통풍 잘 되는 메쉬 자켓으로 버팁니다. 다들 여름 라이딩 필수템 뭐 쓰시나요? 공유해요!",
    viewCount: 1789,
    likeCount: 73,
    commentCount: 34,
    createdAt: "2026-06-16",
  },

  // ── 사고/블랙박스 (accident) ──
  {
    id: "c-accident-1",
    boardSlug: "accident",
    author: "안전제일라이더",
    authorVerified: true,
    hasVideo: true,
    title: "교차로 신호대기 중 후방 추돌 상황, 과실 어떻게 볼까요?",
    excerpt:
      "정지선에 서 있는데 뒤차가 감속을 못 하고 부딪힌 상황입니다. 조언 부탁드려요.",
    content:
      "직진 신호 대기로 정지선에 완전히 멈춰 있었는데, 뒤에서 오던 차량이 미처 감속하지 못하고 후미를 추돌한 상황입니다. 다행히 저속이라 크게 다치진 않았지만 놀랐습니다.\n\n영상 속 번호판과 얼굴은 모두 블러 처리했습니다. 이런 정지 중 추돌의 경우 과실 비율을 어떻게 보는 게 일반적인지 경험자분들 조언 부탁드립니다. (데모용 창작 상황)",
    viewCount: 4521,
    likeCount: 63,
    commentCount: 38,
    createdAt: "2026-06-26",
  },
  {
    id: "c-accident-2",
    boardSlug: "accident",
    author: "칼치기싫어요",
    hasVideo: true,
    title: "차선 변경 차량과 접촉 위기, 방어운전으로 회피한 사례",
    excerpt:
      "옆 차로 차량이 방향지시등 없이 훅 들어왔는데 미리 감속해서 피했습니다.",
    content:
      "옆 차로 차량이 신호 없이 갑자기 제 앞으로 진입하려 했는데, 사각지대를 미리 의식하고 있어서 감속으로 회피했습니다. 큰 사고로 이어질 뻔한 아찔한 상황이었어요.\n\n블랙박스 영상은 개인정보 블러 후 첨부했습니다. 방어운전 습관의 중요성을 다시 느낀 사례라 공유합니다.",
    viewCount: 3310,
    likeCount: 121,
    commentCount: 29,
    createdAt: "2026-06-23",
  },
  {
    id: "c-accident-3",
    boardSlug: "accident",
    author: "빗길조심",
    title: "빗길 급제동 시 미끄러짐, 이럴 땐 어떻게 대처하나요?",
    excerpt:
      "젖은 노면에서 앞차가 급정거하자 뒷바퀴가 살짝 밀렸습니다. 대처법 문의.",
    content:
      "비 오는 날 앞차가 갑자기 멈추면서 저도 급제동했는데 뒷바퀴가 순간 미끄러지는 느낌이 들었습니다. 넘어지진 않았지만 식은땀이 났네요. 빗길 급제동 시 올바른 대처와 평소 습관이 궁금합니다.",
    viewCount: 2760,
    likeCount: 54,
    commentCount: 22,
    createdAt: "2026-06-17",
  },
  {
    id: "c-accident-4",
    boardSlug: "accident",
    author: "사각지대헌터",
    authorVerified: true,
    hasVideo: true,
    title: "우회전 차량 사각지대 위험 사례 공유 (주의 환기용)",
    excerpt:
      "대형 차량 우회전 시 사각지대에 들어가지 않도록 다들 조심하세요.",
    content:
      "대형 차량이 우회전할 때 바이크가 사각지대에 있으면 정말 위험합니다. 이번엔 미리 거리를 두고 있어서 괜찮았지만, 습관적으로 대형차 옆이나 앞에 붙지 않는 게 중요하다는 걸 다시 느꼈어요. 영상은 블러 처리했고 주의 환기 목적으로 올립니다.",
    viewCount: 3890,
    likeCount: 98,
    commentCount: 31,
    createdAt: "2026-06-11",
  },

  // ── 질문/지식인 (qna) ──
  {
    id: "c-qna-1",
    boardSlug: "qna",
    author: "입문자입니다",
    isAcceptedAnswer: true,
    title: "첫 바이크로 미들급 네이키드 무리일까요?",
    excerpt:
      "면허 딴 지 얼마 안 됐는데 미들급 네이키드가 첫차로 괜찮을지 고민입니다.",
    content:
      "125 스쿠터만 타다가 미들급 네이키드로 바로 넘어가려는데 무리일까요? 체격은 평범한 편이고, 주로 출퇴근+주말 라이딩 용도입니다. 경험자분들 현실적인 조언 부탁드려요.",
    viewCount: 3120,
    likeCount: 47,
    commentCount: 26,
    createdAt: "2026-06-24",
  },
  {
    id: "c-qna-2",
    boardSlug: "qna",
    author: "체인청소싫어",
    isAcceptedAnswer: true,
    title: "체인 관리 주기, 얼마나 자주 해야 하나요?",
    excerpt: "윤활이랑 청소를 어느 정도 주기로 해야 적당한지 궁금합니다.",
    content:
      "체인 관리를 미루다 보니 소음이 나기 시작했습니다. 주행거리 기준으로 청소랑 윤활을 얼마나 자주 해야 적당할까요? 우천 주행 후엔 어떻게 하는 게 좋을까요?",
    viewCount: 2450,
    likeCount: 39,
    commentCount: 17,
    createdAt: "2026-06-21",
  },
  {
    id: "c-qna-3",
    boardSlug: "qna",
    author: "슬라이더궁금",
    title: "겨울 지난 후 첫 시동 전 점검할 것 알려주세요",
    excerpt: "몇 달 세워둔 바이크, 다시 타기 전에 뭘 확인해야 할까요?",
    content:
      "사정이 있어 몇 달 세워뒀던 바이크를 다시 타려고 합니다. 배터리, 타이어 공기압, 오일 외에 꼭 점검해야 할 것들이 있을까요? 초보라 놓치는 게 있을까 봐 여쭤봅니다.",
    viewCount: 1670,
    likeCount: 28,
    commentCount: 14,
    createdAt: "2026-06-14",
  },
  {
    id: "c-qna-4",
    boardSlug: "qna",
    author: "장비고민중",
    isAcceptedAnswer: true,
    title: "입문용 헬멧 예산 얼마 정도가 적당할까요?",
    excerpt: "안전이 제일 중요하다는데, 입문자 기준 헬멧 예산이 궁금합니다.",
    content:
      "헬멧이 제일 중요하다고들 하시는데 입문자 기준으로 예산을 어느 정도 잡는 게 합리적일까요? 인증(안전기준) 확인은 어떻게 하나요? 조언 부탁드립니다.",
    viewCount: 2890,
    likeCount: 52,
    commentCount: 23,
    createdAt: "2026-06-10",
  },

  // ── 정비/DIY (diy) ──
  {
    id: "c-diy-1",
    boardSlug: "diy",
    author: "주말정비왕",
    authorVerified: true,
    title: "엔진오일 셀프 교환 순서 정리 (초보용)",
    excerpt: "공임 아끼려고 셀프 교환 도전! 초보자용으로 순서 정리해봤습니다.",
    content:
      "엔진오일 셀프 교환에 처음 도전하는 분들을 위해 순서를 정리했습니다.\n\n1. 예열 후 시동 끄기 (오일이 잘 배출되게)\n2. 드레인 볼트 풀고 폐유 완전 배출\n3. 오일 필터 교체 (해당 시)\n4. 드레인 볼트 규정 토크로 조이기\n5. 규정량만큼 신유 주입 후 유량 확인\n\n폐유는 꼭 지정 장소에 배출하세요. 자신 없으면 무리하지 말고 정비소 이용을 권합니다!",
    viewCount: 4210,
    likeCount: 168,
    commentCount: 45,
    createdAt: "2026-06-26",
  },
  {
    id: "c-diy-2",
    boardSlug: "diy",
    author: "볼트토크박사",
    title: "브레이크 패드 마모 확인하는 법",
    excerpt: "패드 잔량 눈으로 확인하는 간단한 방법 공유합니다.",
    content:
      "브레이크 패드는 소모품이라 주기적으로 확인해야 안전합니다. 캘리퍼 틈으로 패드 두께를 눈으로 확인하고, 마모 한계선에 가까우면 교체하세요. 제동감이 물렁해지거나 소음이 나면 지체 말고 점검하는 게 좋습니다.",
    viewCount: 2340,
    likeCount: 74,
    commentCount: 19,
    createdAt: "2026-06-20",
  },
  {
    id: "c-diy-3",
    boardSlug: "diy",
    author: "손재주없음",
    title: "체인 청소+윤활 셀프로 해봤습니다 (후기)",
    excerpt: "생각보다 어렵지 않네요. 처음 해본 후기 남깁니다.",
    content:
      "체인 클리너랑 브러시, 체인 루브 사서 처음으로 셀프 청소해봤습니다. 스탠드로 뒷바퀴 띄우고 돌려가며 청소하니 생각보다 할 만하더라고요. 소음도 줄고 뿌듯합니다. 도전해보세요!",
    viewCount: 1980,
    likeCount: 61,
    commentCount: 16,
    createdAt: "2026-06-13",
  },
  {
    id: "c-diy-4",
    boardSlug: "diy",
    author: "공구수집가",
    authorVerified: true,
    title: "셀프 정비 입문자에게 추천하는 기본 공구 세트",
    excerpt: "이것만 있으면 웬만한 기본 정비는 가능한 공구 목록.",
    content:
      "셀프 정비 시작할 때 뭘 사야 할지 막막하죠. 육각 렌치 세트, 토크 렌치, 드레인 팬, 오일 필터 렌치 정도면 기본 작업은 됩니다. 토크 렌치는 규정 토크 관리에 필수라 꼭 챙기세요.",
    viewCount: 2670,
    likeCount: 89,
    commentCount: 24,
    createdAt: "2026-06-08",
  },

  // ── 튜닝/커스텀 (tuning) ──
  {
    id: "c-tuning-1",
    boardSlug: "tuning",
    author: "네온그린홀릭",
    authorVerified: true,
    title: "슬립온 머플러 교체 후기 (사운드 만족)",
    excerpt: "합법 인증 제품으로 교체했더니 사운드가 확 살아나네요.",
    content:
      "순정 배기가 너무 조용해서 인증받은 슬립온 머플러로 교체했습니다. 무게도 줄고 사운드도 딱 취향이라 만족스럽네요. 소음 기준은 꼭 확인하시고, 불법 개조는 절대 금물입니다!",
    viewCount: 3560,
    likeCount: 103,
    commentCount: 33,
    createdAt: "2026-06-25",
  },
  {
    id: "c-tuning-2",
    boardSlug: "tuning",
    author: "핸들바장인",
    title: "레버 & 그립 교체로 손 피로 줄이기",
    excerpt: "장거리 탈 때 손 저림 때문에 레버랑 그립 바꿨습니다.",
    content:
      "장거리 라이딩에서 손 저림이 심해서 조절식 레버랑 젤 그립으로 교체했습니다. 손목 각도가 편해지니 피로도가 확실히 줄더라고요. 가성비 좋은 튜닝이라 추천합니다.",
    viewCount: 1870,
    likeCount: 58,
    commentCount: 15,
    createdAt: "2026-06-18",
  },
  {
    id: "c-tuning-3",
    boardSlug: "tuning",
    author: "LED덕후",
    title: "보조등 & 후미등 시인성 개선 커스텀",
    excerpt: "야간 시인성 높이려고 보조등이랑 후미등 손봤습니다.",
    content:
      "야간 라이딩이 잦아서 시인성을 높이려고 보조등과 브레이크 후미등을 밝은 걸로 교체했습니다. 뒤차가 확실히 일찍 반응하는 게 느껴져요. 다만 눈부심 유발하지 않게 각도 조절이 중요합니다.",
    viewCount: 2130,
    likeCount: 66,
    commentCount: 20,
    createdAt: "2026-06-12",
  },
  {
    id: "c-tuning-4",
    boardSlug: "tuning",
    author: "카페레이서꿈나무",
    authorVerified: true,
    title: "클래식 감성 커스텀 진행 중입니다 (과정 공유)",
    excerpt: "시트랑 미러, 테일 정리하면서 카페레이서 느낌 내는 중.",
    content:
      "요즘 유행하는 클래식 카페레이서 스타일로 조금씩 커스텀 중입니다. 시트 리폼하고 바엔드 미러로 바꾸니 분위기가 확 사네요. 안전에 지장 없는 선에서 천천히 진행하려고요. 완성되면 또 올릴게요!",
    viewCount: 2980,
    likeCount: 91,
    commentCount: 28,
    createdAt: "2026-06-07",
  },

  // ── 투어/여행 (tour) ──
  {
    id: "c-tour-1",
    boardSlug: "tour",
    author: "동해안러너",
    authorVerified: true,
    title: "동해안 해안도로 1박 2일 투어 후기 (코스 포함)",
    excerpt: "탁 트인 바다 보며 달리는 해안도로, 인생 코스였습니다.",
    content:
      "주말에 동해안 해안도로를 따라 1박 2일 투어를 다녀왔습니다. 끝없이 펼쳐지는 바다를 옆에 두고 달리는 기분은 정말 최고더라고요. 중간중간 쉬어갈 카페도 많고, 노면 상태도 대체로 좋았습니다. 여름엔 이른 아침이 덜 붐벼서 추천해요!",
    viewCount: 4670,
    likeCount: 187,
    commentCount: 41,
    createdAt: "2026-06-24",
  },
  {
    id: "c-tour-2",
    boardSlug: "tour",
    author: "산넘고물건너",
    title: "고갯길 와인딩 투어, 초보도 즐길 수 있을까요?",
    excerpt: "와인딩 입문하려는데 안전하게 즐기는 팁 있을까요.",
    content:
      "와인딩 코스에 도전해보고 싶은데 초보라 겁이 납니다. 오버페이스 안 하고 안전하게 즐기려면 어떤 마음가짐과 준비가 필요할까요? 경험 많은 분들 조언 부탁드려요.",
    viewCount: 2210,
    likeCount: 44,
    commentCount: 19,
    createdAt: "2026-06-19",
  },
  {
    id: "c-tour-3",
    boardSlug: "tour",
    author: "캠핑라이더",
    title: "바이크 캠핑 짐 싸는 노하우 공유",
    excerpt: "무게 배분이랑 방수 패킹, 이렇게 하니 편하더라고요.",
    content:
      "바이크로 캠핑 다니면서 터득한 짐 싸기 노하우 공유합니다. 무거운 건 최대한 아래·중앙에 배치하고, 방수팩으로 감싸면 갑작스런 비에도 안심입니다. 짐이 흔들리지 않게 고정하는 게 핵심이에요.",
    viewCount: 3040,
    likeCount: 112,
    commentCount: 26,
    createdAt: "2026-06-15",
  },
  {
    id: "c-tour-4",
    boardSlug: "tour",
    author: "장거리마스터",
    authorVerified: true,
    title: "당일치기 남부 투어 다녀왔습니다 (500km)",
    excerpt: "하루에 500km, 체력 안배와 휴식 타이밍이 관건이었어요.",
    content:
      "당일치기로 남부 지역 500km 투어를 다녀왔습니다. 장거리는 체력 안배가 정말 중요해서 2시간마다 스트레칭 겸 휴식을 취했어요. 수분 보충과 컨디션 관리를 소홀히 하면 후반에 집중력이 확 떨어지더라고요. 무리하지 않는 게 최고의 안전입니다.",
    viewCount: 2760,
    likeCount: 95,
    commentCount: 22,
    createdAt: "2026-06-09",
  },
];
