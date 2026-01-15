"use client";

import { RouteGuard } from "@/components/RouteGuard";

export default function SeafarerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard allowedRoles={["seafarer"]}>{children}</RouteGuard>;
}
