import { useState } from "react";
import type { FormEvent } from "react";
import Link from "../router/link";
import { navigate, useLocation } from "../router/navigation";

export default function Header() {
  const { pathname, searchParams } = useLocation();
  const currentQuery = pathname === "/search" ? (searchParams.get("query") ?? "") : "";
  const [draft, setDraft] = useState(currentQuery);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = draft.trim();
    navigate(query ? `/search?query=${encodeURIComponent(query)}` : "/search");
  }

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        UMCine
      </Link>
      <form className="header__search" onSubmit={handleSubmit}>
        <input
          type="search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="영화 제목을 검색해요"
          aria-label="영화 검색"
        />
        <button type="submit">검색</button>
      </form>
    </header>
  );
}
