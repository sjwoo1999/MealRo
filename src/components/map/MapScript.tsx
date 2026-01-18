'use client';

import React, { useEffect, useState } from 'react';
import { loadKakaoMapsScript, KAKAO_MAPS_SCRIPT_ID } from '@/lib/kakao-maps';
import MapSkeleton from './MapSkeleton';
import MapError from './MapError';

interface MapScriptProps {
    children: React.ReactNode;
}

const MapScript = ({ children }: MapScriptProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 이미 로드되었는지 확인
        if (window.kakao && window.kakao.maps) {
            setIsLoaded(true);
            return;
        }

        const appKey = process.env.NEXT_PUBLIC_KAKAO_MAPS_APP_KEY;
        console.log("Kakao Map Check:", {
            hasKey: !!appKey,
            keyLength: appKey?.length,
            keyPrefix: appKey ? appKey.substring(0, 4) + '...' : 'NONE'
        });

        if (!appKey) {
            setError('Kakao Maps App Key가 설정되지 않았습니다.');
            return;
        }

        loadKakaoMapsScript(appKey)
            .then(() => setIsLoaded(true))
            .catch((e) => {
                console.error('Failed to load Kakao Maps', e);
                setError('지도를 불러오는데 실패했습니다.');
            });
    }, []);

    if (error) {
        return <MapError message={error} />;
    }

    if (!isLoaded) {
        return <MapSkeleton />;
    }

    return <>{children}</>;
};

export default MapScript;
