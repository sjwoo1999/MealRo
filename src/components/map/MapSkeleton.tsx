'use client';

import React from 'react';

const MapSkeleton = () => {
    return (
        <div className="w-full h-[300px] bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse flex items-center justify-center">
            <div className="text-slate-300 dark:text-slate-600 flex flex-col items-center">
                <span className="text-4xl mb-2">🗺️</span>
                <span className="text-sm">지도 로딩 중...</span>
            </div>
        </div>
    );
};

export default MapSkeleton;
