export type RestaurantSummary = {
    id: string;
    name: string;
    category?: string;
    address?: string;
    rating?: number;
    review_count?: number;
    distance?: number;
    latitude?: number;
    longitude?: number;
};

export type RestaurantDetail = RestaurantSummary & {
    openingHours: string;
    priceBand: string;
    recommendationReason: string;
    menuHighlights: Array<{
        name: string;
        calories: number;
        note: string;
    }>;
    etaMinutes?: number;
    source: 'live' | 'fallback';
};

export const FALLBACK_CENTER = { lat: 37.5665, lng: 126.9780 };

export const FALLBACK_RESTAURANTS: RestaurantSummary[] = [
    {
        id: 'rest-1',
        name: '샐러드랩 시청점',
        category: '샐러드',
        address: '서울 중구 세종대로 110',
        rating: 4.7,
        review_count: 128,
        distance: 0.3,
        latitude: 37.5668,
        longitude: 126.9778,
    },
    {
        id: 'rest-2',
        name: '그릴치킨 도시락',
        category: '도시락',
        address: '서울 중구 무교로 21',
        rating: 4.5,
        review_count: 86,
        distance: 0.5,
        latitude: 37.5673,
        longitude: 126.9798,
    },
    {
        id: 'rest-3',
        name: '현미포케 을지로점',
        category: '포케',
        address: '서울 중구 을지로 30',
        rating: 4.8,
        review_count: 214,
        distance: 0.8,
        latitude: 37.5661,
        longitude: 126.9811,
    },
];

const FALLBACK_DETAILS: Record<string, Omit<RestaurantDetail, keyof RestaurantSummary | 'source'>> = {
    'rest-1': {
        openingHours: '매일 10:00 - 21:00',
        priceBand: '8,900원 - 14,500원',
        recommendationReason: '단백질과 채소 중심으로 다음 끼니 부담이 적습니다.',
        etaMinutes: 4,
        menuHighlights: [
            { name: '닭가슴살 시저 샐러드', calories: 320, note: '단백질 24g' },
            { name: '연어 포테이토 볼', calories: 410, note: '지방 균형형' },
            { name: '그릭요거트 컵', calories: 180, note: '가벼운 보완 간식' },
        ],
    },
    'rest-2': {
        openingHours: '평일 09:00 - 20:30',
        priceBand: '7,500원 - 12,000원',
        recommendationReason: '도시락형 메뉴로 한 끼 열량을 비교적 안정적으로 맞추기 좋습니다.',
        etaMinutes: 6,
        menuHighlights: [
            { name: '그릴치킨 현미 도시락', calories: 455, note: '단백질 33g' },
            { name: '훈제오리 채소 도시락', calories: 520, note: '포만감 중심' },
            { name: '계란두부 미니볼', calories: 190, note: '보완 메뉴' },
        ],
    },
    'rest-3': {
        openingHours: '매일 11:00 - 22:00',
        priceBand: '9,900원 - 15,900원',
        recommendationReason: '탄단지 구성이 명확해서 추천 결과와 비교하기 쉽습니다.',
        etaMinutes: 9,
        menuHighlights: [
            { name: '연어 포케', calories: 430, note: '탄수 조절형' },
            { name: '스파이시 치킨 포케', calories: 470, note: '단백질 29g' },
            { name: '두부 에다마메 토핑', calories: 150, note: '식물성 보완' },
        ],
    },
};

export function normalizeRestaurant(item: any, index = 0): RestaurantSummary {
    return {
        id: item.id || `restaurant-${index}`,
        name: item.name,
        category: item.category,
        address: item.address,
        rating: item.rating,
        review_count: item.review_count,
        distance: item.distance,
        latitude: item.latitude,
        longitude: item.longitude,
    };
}

export function getFallbackRestaurantById(id: string): RestaurantSummary | undefined {
    return FALLBACK_RESTAURANTS.find((restaurant) => restaurant.id === id);
}

export function buildRestaurantDetail(
    restaurant: RestaurantSummary,
    source: 'live' | 'fallback' = 'fallback'
): RestaurantDetail {
    const fallback = FALLBACK_DETAILS[restaurant.id];

    return {
        ...restaurant,
        openingHours: fallback?.openingHours || '매일 10:00 - 21:00',
        priceBand: fallback?.priceBand || '8,000원 - 15,000원',
        recommendationReason:
            fallback?.recommendationReason ||
            `${restaurant.category || '식당'} 카테고리 기준으로 지금 바로 선택하기 좋은 후보입니다.`,
        etaMinutes:
            fallback?.etaMinutes ||
            (restaurant.distance !== undefined ? Math.max(3, Math.round(restaurant.distance * 12)) : 7),
        menuHighlights: fallback?.menuHighlights || [
            { name: `${restaurant.name} 대표 메뉴`, calories: 420, note: '기본 추천 메뉴' },
            { name: '가벼운 보완 메뉴', calories: 220, note: '부담 적은 선택' },
            { name: '단백질 보완 메뉴', calories: 310, note: '균형형 선택' },
        ],
        source,
    };
}
