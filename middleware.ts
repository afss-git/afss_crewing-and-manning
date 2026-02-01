import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Only apply to admin routes (except login)
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login")
  ) {
    // Check for auth token in request
    const token =
      request.cookies.get("crew-manning-token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      // Redirect to admin login if no token
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // TODO: Add JWT validation here for stronger security
    // For now, just check token exists
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
