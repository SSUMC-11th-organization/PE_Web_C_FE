import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface ContainerProps {
  className?: string;
  children: ReactNode;
}

// Figma 데스크톱(1440px) 기준으로 콘텐츠 폭 1280px, 양옆 여백 80px이 되도록 맞춰요.
export function Container({ className, children }: ContainerProps) {
  return <div className={cn("mx-auto w-full max-w-[1320px] px-5", className)}>{children}</div>;
}
