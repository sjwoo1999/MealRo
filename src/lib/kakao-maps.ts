export const KAKAO_MAPS_SCRIPT_ID = 'kakao-maps-sdk';

/**
 * Loads the Kakao Maps SDK script dynamically.
 * @param appKey The Kakao JavaScript App Key.
 */
export const loadKakaoMapsScript = (appKey: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (document.getElementById(KAKAO_MAPS_SCRIPT_ID)) {
            if (window.kakao && window.kakao.maps) {
                resolve();
            } else {
                resolve();
            }
            return;
        }

        const script = document.createElement('script');
        script.id = KAKAO_MAPS_SCRIPT_ID;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services,clusterer`;
        script.onload = () => {
            window.kakao.maps.load(() => {
                resolve();
            });
        };
        script.onerror = (error) => reject(error);
        document.head.appendChild(script);
    });
};

declare global {
    interface Window {
        kakao: any;
    }
}

export const openKakaoMapSearch = (query: string) => {
    // Try Web URL (Universal Link handles app open usually)
    const url = `https://map.kakao.com/link/search/${encodeURIComponent(query)}`;
    window.open(url, '_blank');
};
