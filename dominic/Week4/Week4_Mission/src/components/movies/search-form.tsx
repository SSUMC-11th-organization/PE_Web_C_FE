import { useNavigate } from '@tanstack/react-router';
import { type FormEvent, useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../layout/icon';

export function SearchForm({ query, prominent = false }: { query: string; prominent?: boolean }) {
  const [input, setInput] = useState(query);
  const navigate = useNavigate();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void navigate({ to: '/search', search: { query: input.trim() } });
  };

  return (
    <search aria-label="영화 검색">
      <form
        onSubmit={submit}
        className={cn(
          'flex min-h-[54px] items-center gap-3 rounded-[9px] border border-line bg-white pr-2.5 pl-[15px] sm:gap-[18px]',
          prominent &&
            'min-h-[74px] rounded-xl border-2 border-ink pr-[17px] pl-[21px] shadow-[0_12px_17px_rgba(17,19,24,0.08)]',
        )}
      >
        <Icon name="search" />
        <label className="min-w-0 flex-1">
          <span className="sr-only">영화 제목</span>
          <input
            type="search"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="예: 스파이더맨"
            className="min-h-10 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-subtle"
          />
        </label>
        {input && (
          <button
            type="button"
            aria-label="검색어 지우기"
            onClick={() => setInput('')}
            className="flex size-8 items-center justify-center"
          >
            <Icon name="close" />
          </button>
        )}
        <button
          type="submit"
          className="h-[42px] shrink-0 rounded-lg bg-ink px-3 text-sm font-extrabold text-white hover:bg-ink/80 sm:px-4"
        >
          {prominent ? '검색' : '다시 검색'}
        </button>
      </form>
    </search>
  );
}
