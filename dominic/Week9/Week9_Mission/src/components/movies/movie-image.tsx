'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '../../utils/cn';

export function MovieImage({
  src,
  alt,
  className,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px',
}: {
  src: string | null;
  alt: string;
  className: string;
  sizes?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || failedSrc === src)
    return (
      <div
        role="img"
        aria-label={alt || '영화 배경 이미지 없음'}
        className={cn(
          'flex items-center justify-center bg-gray-200 text-xs text-gray-600',
          className,
        )}
      >
        이미지 없음
      </div>
    );
  return (
    <Image
      src={src}
      alt={alt}
      width={500}
      height={750}
      sizes={sizes}
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
}
