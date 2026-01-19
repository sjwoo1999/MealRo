'use client';

import { useState } from 'react';

interface Box {
    id: string;
    label: string;
    x: number; // percentage (0-100)
    y: number; // percentage (0-100)
    width: number; // percentage
    height: number; // percentage
}

interface BoundingBoxOverlayProps {
    boxes: Box[];
    onBoxClick: (boxId: string) => void;
}

export default function BoundingBoxOverlay({ boxes, onBoxClick }: BoundingBoxOverlayProps) {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {boxes.map((box) => (
                <button
                    key={box.id}
                    onClick={() => onBoxClick(box.id)}
                    className="absolute border-2 border-emerald-400 bg-emerald-400/10 rounded-lg pointer-events-auto hover:bg-emerald-400/20 active:bg-emerald-400/30 transition-colors group"
                    style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.width}%`,
                        height: `${box.height}%`,
                    }}
                >
                    {/* Label Tag */}
                    <span className="absolute -top-7 left-0 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm opacity-90 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {box.label}
                    </span>

                    {/* Edit Handle (Visual only for now) */}
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border border-emerald-500 rounded-full shadow-sm" />
                </button>
            ))}
        </div>
    );
}
