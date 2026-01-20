'use client';

import { useState, useRef, useEffect, useMemo } from 'react';

export interface Box {
    id: string;
    label: string;
    x: number; // normalized (0-1)
    y: number; // normalized (0-1)
    width: number; // normalized (0-1)
    height: number; // normalized (0-1)
}

interface BoundingBoxOverlayProps {
    boxes: Box[];
    onBoxClick: (boxId: string) => void;
    imageDimensions?: { width: number; height: number };
    objectFit?: 'contain' | 'cover';
}

/**
 * Custom hook to calculate the actual rendered rectangle of an image
 * within a container, accounting for object-fit CSS rules.
 */
function useRenderedImageRect(
    containerRef: React.RefObject<HTMLDivElement>,
    imageDimensions?: { width: number; height: number },
    objectFit: 'contain' | 'cover' = 'contain'
) {
    const [renderedRect, setRenderedRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

    useEffect(() => {
        if (!containerRef.current || !imageDimensions) {
            setRenderedRect(null); // Reset if conditions are not met
            return;
        }

        const updateRect = () => {
            const container = containerRef.current;
            if (!container) return;

            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            const { width: imageWidth, height: imageHeight } = imageDimensions;

            if (!containerWidth || !containerHeight || !imageWidth || !imageHeight) {
                setRenderedRect(null); // Or some default/empty state
                return;
            }

            const containerRatio = containerWidth / containerHeight;
            const imageRatio = imageWidth / imageHeight;

            let renderWidth = containerWidth;
            let renderHeight = containerHeight;
            let offsetX = 0;
            let offsetY = 0;

            if (objectFit === 'contain') {
                if (containerRatio > imageRatio) {
                    // Container is wider than image (Pillarboxing)
                    // Image height will match container height
                    renderHeight = containerHeight;
                    renderWidth = containerHeight * imageRatio;
                    offsetX = (containerWidth - renderWidth) / 2;
                } else {
                    // Container is taller than image (Letterboxing)
                    // Image width will match container width
                    renderWidth = containerWidth;
                    renderHeight = containerWidth / imageRatio;
                    offsetY = (containerHeight - renderHeight) / 2;
                }
            } else if (objectFit === 'cover') {
                if (containerRatio > imageRatio) {
                    // Container is wider (Crop top/bottom)
                    // Image width will match container width
                    renderWidth = containerWidth;
                    renderHeight = containerWidth / imageRatio;
                    offsetY = (containerHeight - renderHeight) / 2;
                } else {
                    // Container is taller (Crop left/right)
                    // Image height will match container height
                    renderHeight = containerHeight;
                    renderWidth = containerHeight * imageRatio;
                    offsetX = (containerWidth - renderWidth) / 2;
                }
            }

            setRenderedRect({
                x: offsetX,
                y: offsetY,
                width: renderWidth,
                height: renderHeight,
            });
        };

        // Initial calculation
        updateRect();

        // Re-calculate on resize
        const observer = new ResizeObserver(updateRect);
        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [containerRef, imageDimensions, objectFit]); // containerRef is stable

    return renderedRect;
}

export default function BoundingBoxOverlay({
    boxes,
    onBoxClick,
    imageDimensions,
    objectFit = 'contain' // Default to contain as used in FoodAnalysisResult
}: BoundingBoxOverlayProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const renderedImage = useRenderedImageRect(containerRef, imageDimensions, objectFit);

    if (!renderedImage) return <div ref={containerRef} className="absolute inset-0 pointer-events-none" />;

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* 1. Backdrop Spotlight Layer */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                <defs>
                    <mask id="spotlight-mask">
                        {/* White fills everything (opaque) */}
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        {/* Black ellipses make holes (transparent) */}
                        {boxes.map((box) => {
                            const cx = renderedImage.x + (box.x * renderedImage.width) + (box.width * renderedImage.width) / 2;
                            const cy = renderedImage.y + (box.y * renderedImage.height) + (box.height * renderedImage.height) / 2;
                            const rx = (box.width * renderedImage.width) / 2;
                            const ry = (box.height * renderedImage.height) / 2;
                            return (
                                <ellipse
                                    key={box.id}
                                    cx={cx}
                                    cy={cy}
                                    rx={rx}
                                    ry={ry}
                                    fill="black"
                                    filter="url(#soft-edge)"
                                />
                            );
                        })}
                    </mask>
                    <filter id="soft-edge">
                        <feGaussianBlur stdDeviation="15" />
                    </filter>
                </defs>

                {/* The Dark Overlay applying the mask */}
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="black"
                    fillOpacity="0.4"
                    mask="url(#spotlight-mask)"
                />
            </svg>

            {/* 2. Interactive Labels & Areas */}
            {boxes.map((box) => {
                const left = renderedImage.x + (box.x * renderedImage.width);
                const top = renderedImage.y + (box.y * renderedImage.height);
                const width = box.width * renderedImage.width;
                const height = box.height * renderedImage.height;

                return (
                    <button
                        key={box.id}
                        onClick={() => onBoxClick(box.id)}
                        className="absolute pointer-events-auto group outline-none"
                        style={{
                            left: `${left}px`,
                            top: `${top}px`,
                            width: `${width}px`,
                            height: `${height}px`,
                        }}
                    >
                        {/* Label Tag - Floating Style */}
                        {/* Centered at the bottom of the spotlight or top-left */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90 group-hover:opacity-100 transition-opacity">
                            <span className="bg-black/50 backdrop-blur-md text-white border border-white/20 text-sm font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                {box.label}
                            </span>
                        </div>

                        {/* Invisible click area is the full box */}
                    </button>
                );
            })}
        </div>
    );
}
