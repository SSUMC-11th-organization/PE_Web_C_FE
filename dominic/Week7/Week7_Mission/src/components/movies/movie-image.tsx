import { useState } from 'react';
import { cn } from '../../utils/cn';

export function MovieImage({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className: string;
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
  return <img src={src} alt={alt} className={className} onError={() => setFailedSrc(src)} />;
}
