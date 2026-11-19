import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "../../pages/members/profile-page";

export const Route = createFileRoute("/(authenticated)/_protected/members")({
  component: ProfilePage,
});
