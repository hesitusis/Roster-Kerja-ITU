'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface IndotruckLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const IndotruckLogo: React.FC<IndotruckLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const [imgSrc, setImgSrc] = useState('/logo-indotruck.png');

  // Dimension mapping for Next.js Image
  const dimensions = {
    sm: { width: 140, height: 36, className: 'h-8 sm:h-9 w-auto max-h-9' },
    md: { width: 180, height: 48, className: 'h-11 sm:h-12 w-auto max-h-12' },
    lg: { width: 220, height: 60, className: 'h-14 sm:h-16 w-auto max-h-16' },
    xl: { width: 260, height: 72, className: 'h-16 sm:h-20 w-auto max-h-20' },
  };

  const currentDim = dimensions[size];

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      aria-label="PT Indotruck Utama"
    >
      <Image
        src={imgSrc}
        alt="PT INDOTRUCK UTAMA"
        width={currentDim.width}
        height={currentDim.height}
        className={`object-contain transition-all ${currentDim.className}`}
        priority
        referrerPolicy="no-referrer"
        onError={() => {
          if (imgSrc !== 'https://images.seeklogo.com/logo-png/36/1/pt-indotruck-utama-logo-png_seeklogo-363267.png') {
            setImgSrc('https://images.seeklogo.com/logo-png/36/1/pt-indotruck-utama-logo-png_seeklogo-363267.png');
          }
        }}
      />
    </div>
  );
};
