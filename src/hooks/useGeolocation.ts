import { useState, useEffect } from 'react';

interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    isLoading: boolean;
}

export const useGeolocation = (): GeolocationState => {
    const [state, setState] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        error: null,
        isLoading: true,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setState(prev => ({ ...prev, error: 'Geolocation is not supported', isLoading: false }));
            return;
        }

        const success = (position: GeolocationPosition) => {
            setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
                isLoading: false,
            });
        };

        const error = (err: GeolocationPositionError) => {
            let errorMsg = 'Unknown error';
            switch (err.code) {
                case err.PERMISSION_DENIED: errorMsg = '위치 정보 제공을 허용해주세요.'; break;
                case err.POSITION_UNAVAILABLE: errorMsg = '위치 정보를 사용할 수 없습니다.'; break;
                case err.TIMEOUT: errorMsg = '위치 정보를 가져오는데 시간이 초과되었습니다.'; break;
            }

            setState(prev => ({
                ...prev,
                error: errorMsg,
                isLoading: false,
            }));
        };

        // Get current position
        navigator.geolocation.getCurrentPosition(success, error, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });

        // Optional: Watch position
        // const watchId = navigator.geolocation.watchPosition(success, error);
        // return () => navigator.geolocation.clearWatch(watchId);

    }, []);

    return state;
};
