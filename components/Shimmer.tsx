import React from 'react';

interface ShimmerProps {
    className?: string;
    width?: string | number;
    height?: string | number;
}

export default function Shimmer({ className = '', width = '100%', height = '200px' }: ShimmerProps) {
    return (
        <div
            className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}
            style={{ width, height }}
        >
            <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
                style={{
                    animationDuration: '1.5s',
                    animationFillMode: 'forwards',
                    animationIterationCount: 'infinite',
                }}
            />
        </div>
    );
}
