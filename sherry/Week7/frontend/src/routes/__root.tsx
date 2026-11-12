import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
    component: Root,
});

export function Root() {
    return <Outlet />;
}
