import { createFileRoute } from "@tanstack/react-router";
import { MemberApiPage } from "../pages/members/member-api-page";
export const Route = createFileRoute("/members_/api")({ component: MemberApiPage });
