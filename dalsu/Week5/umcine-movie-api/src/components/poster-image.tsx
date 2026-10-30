interface PosterImageProps {
  url: string | null;
  alt: string;
  className?: string;
}

// url이 없으면 같은 크기의 회색 영역에 "이미지 없음"을 보여 줘요.
export default function PosterImage({ url, alt, className = "" }: PosterImageProps) {
  if (!url) {
    return <div className={`image-placeholder ${className}`}>이미지 없음</div>;
  }
  return <img className={className} src={url} alt={alt} />;
}
