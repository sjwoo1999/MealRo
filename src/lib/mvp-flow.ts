export const MEAL_CONTEXT = {
    breakfast: { label: '아침', description: '하루 시작 식사를 빠르게 기록합니다.' },
    lunch: { label: '점심', description: '지금 먹은 메뉴를 분석해 다음 선택에 반영합니다.' },
    dinner: { label: '저녁', description: '오늘 마지막 식사를 정리하고 균형을 확인합니다.' },
    snack: { label: '간식', description: '작은 섭취도 남겨야 하루 패턴이 보입니다.' },
} as const;

export type MealContextKey = keyof typeof MEAL_CONTEXT;

export const CAPTURE_FLOW_STEPS = [
    {
        key: 'meal',
        order: '01',
        title: '식사 시간 선택',
        description: '아침, 점심, 저녁, 간식 중 현재 식사 맥락을 먼저 고릅니다.',
    },
    {
        key: 'capture',
        order: '02',
        title: '식사 촬영',
        description: '카메라 또는 앨범에서 음식을 한 화면에 담아 업로드합니다.',
    },
    {
        key: 'analysis',
        order: '03',
        title: 'AI 분석',
        description: '음식명과 칼로리, 탄단지를 추정하고 사용자가 검토합니다.',
    },
    {
        key: 'confirm',
        order: '04',
        title: '기록 확정',
        description: '결과를 수정한 뒤 오늘 식사 기록으로 저장합니다.',
    },
    {
        key: 'branch',
        order: '05',
        title: '다음 흐름 선택',
        description: '추천, 주변 탐색, 기록 보관 중 다음 행동으로 분기합니다.',
    },
] as const;

export const ANALYSIS_BRANCHES = [
    {
        href: '/meal',
        title: '역추산 추천',
        subtitle: '남은 끼니 추천',
        description: '현재 끼니 기준으로 오늘 남은 식사 구성을 다시 계산합니다.',
        rules: ['이미 먹은 양', '사용자 목표', '남은 칼로리'],
    },
    {
        href: '/nearby',
        title: '위치 기반 탐색',
        subtitle: '주변 식당 찾기',
        description: '가까운 식당 중 지금 갈 수 있는 메뉴 후보를 좁힙니다.',
        rules: ['거리', '영업시간', '가격대'],
    },
    {
        href: '/history',
        title: '기록 보관',
        subtitle: '오늘 식사 저장',
        description: '추천을 보지 않아도 일단 기록을 남기고 나중에 다시 확인합니다.',
        rules: ['임시 저장', '복구', '주간 회고'],
    },
] as const;

export const RECOMMENDATION_RULES = [
    '역추산 알고리즘',
    '위치 기반 메뉴 추천',
    '사용자 식단 관리 목적별 추천',
    '프랜차이즈 메뉴 추천',
    '배달 메뉴 추천',
    '영업시간 정보',
    '가격대 + 거리 민감도',
] as const;

export const EXPLORE_LOOP_STEPS = [
    '지도에서 후보 확인',
    '식당 상세와 메뉴 확인',
    '도착 여부 체크',
    '오늘 기록과 인사이트에 반영',
] as const;
