"use client";

import { usePathname } from "next/navigation";
import { RouteGuard } from "@/components/RouteGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Don't apply RouteGuard to login page - allow direct access
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <RouteGuard allowedRoles={["admin"]}>{children}</RouteGuard>;
}
