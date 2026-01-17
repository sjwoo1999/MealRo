'use client';

import React, { useEffect, useRef, useState } from 'react';
import MapScript from './MapScript';
import MapSkeleton from './MapSkeleton';

interface Location {
    lat: number;
    lng: number;
}

interface MapProps {
    center: Location;
    markers?: Array<{
        id: string;
        lat: number;
        lng: number;
        title?: string;
    }>;
    level?: number;
    onMarkerClick?: (markerId: string) => void;
    className?: string;
}

const MapInner = ({ center, markers = [], level = 3, onMarkerClick, className }: MapProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null); // kakao.maps.Map instance
    const markersRef = useRef<any[]>([]); // kakao.maps.Marker instances

    useEffect(() => {
        if (!containerRef.current || !window.kakao) return;

        const options = {
            center: new window.kakao.maps.LatLng(center.lat, center.lng),
            level: level
        };

        if (!mapRef.current) {
            mapRef.current = new window.kakao.maps.Map(containerRef.current, options);
        } else {
            // Update Center if changed significantly? 
            // Or usually we stick to user interaction.
            // If center prop changes, pan to it using map.panTo()
            const newCenter = new window.kakao.maps.LatLng(center.lat, center.lng);
            mapRef.current.panTo(newCenter);
        }
    }, [center, level]);

    // Update Markers
    useEffect(() => {
        if (!mapRef.current || !window.kakao) return;

        // Clear existing
        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];

        // Add new
        markers.forEach(marker => {
            const position = new window.kakao.maps.LatLng(marker.lat, marker.lng);
            const m = new window.kakao.maps.Marker({
                position,
                title: marker.title,
                clickable: true
            });

            m.setMap(mapRef.current);
            markersRef.current.push(m);

            if (onMarkerClick) {
                window.kakao.maps.event.addListener(m, 'click', () => {
                    onMarkerClick(marker.id);
                });
            }
        });

    }, [markers, onMarkerClick]);

    return (
        <div
            ref={containerRef}
            className={`w-full h-[300px] rounded-xl overflow-hidden ${className}`}
        />
    );
};

const Map = (props: MapProps) => {
    return (
        <MapScript>
            <MapInner {...props} />
        </MapScript>
    );
};

export default Map;
