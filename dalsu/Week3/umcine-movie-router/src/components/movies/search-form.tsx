import { type SubmitEvent } from "react";
import { cn } from "../../utils/cn";
import { CloseIcon, SearchIcon } from "../icons";

interface SearchFormProps {
  // hero: 검색어가 없을 때 가운데에 크게 보이는 모양, compact: 결과 화면 위쪽의 모양
  variant: "hero" | "compact";
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function SearchForm({ variant, value, onChange, onSubmit }: SearchFormProps) {
  const isHero = variant === "hero";

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full items-center gap-3 bg-white",
        isHero
          ? "h-[72px] rounded-xl border-2 border-ink pl-5 pr-4 shadow-xl"
          : "h-[52px] rounded-lg pl-4 pr-1.5 shadow-sm",
      )}
    >
      <SearchIcon className="size-5 shrink-0 text-gray-600" />
      <input
        className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-gray-400"
        type="search"
        aria-label="검색어"
        placeholder="예: 스파이더맨"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {!isHero && value && (
        <button
          type="button"
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
          aria-label="검색어 지우기"
          onClick={() => onChange("")}
        >
          <CloseIcon className="size-5" />
        </button>
      )}
      <button
        type="submit"
        className={cn(
          "shrink-0 rounded-lg bg-ink text-sm font-bold text-white hover:bg-black",
          isHero ? "h-10 px-4" : "h-10 px-5",
        )}
      >
        {isHero ? "검색" : "다시 검색"}
      </button>
    </form>
  );
}
