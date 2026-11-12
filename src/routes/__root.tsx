import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <div className="app-content"><Outlet /></div>
      <footer className="site-footer"><div><img src="/images/logos/tmdb-logo.svg" alt="TMDB" /><span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span></div></footer>
    </>
  ),
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});