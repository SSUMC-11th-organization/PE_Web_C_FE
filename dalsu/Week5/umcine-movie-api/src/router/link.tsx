import type { MouseEvent, ReactNode } from "react";
import { navigate } from "./navigation";

interface LinkProps {
  to: string;
  className?: string;
  children: ReactNode;
}

export default function Link({ to, className, children }: LinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // 새 탭 열기(Cmd/Ctrl 클릭)는 브라우저 기본 동작에 맡겨요.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    navigate(to);
  }

  return (
    <a href={to} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
