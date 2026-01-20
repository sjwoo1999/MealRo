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
            {boxes.map((box) => {
                // Map normalized coords (0-1) to rendered pixel space
                // formula: pixel = offset + (normalized * dimension)
                const left = renderedImage.x + (box.x * renderedImage.width);
                const top = renderedImage.y + (box.y * renderedImage.height);
                const width = box.width * renderedImage.width;
                const height = box.height * renderedImage.height;

                return (
                    <button
                        key={box.id}
                        onClick={() => onBoxClick(box.id)}
                        className="absolute border-2 border-emerald-500 bg-emerald-500/10 rounded-lg pointer-events-auto hover:bg-emerald-500/20 active:bg-emerald-500/30 transition-colors group z-10"
                        style={{
                            left: `${left}px`,
                            top: `${top}px`,
                            width: `${width}px`,
                            height: `${height}px`,
                        }}
                    >
                        {/* Label Tag - Integrated Style */}
                        <div className="absolute -top-[1.5em] left-[-2px] flex items-center">
                            <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-t-md shadow-sm whitespace-nowrap">
                                {box.label}
                            </span>
                        </div>

                        {/* Edit Handle - Corner Style */}
                        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-emerald-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                );
            })}
        </div>
    );
}
