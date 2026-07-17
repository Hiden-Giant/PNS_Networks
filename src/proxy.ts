import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "pns_session";

export function proxy(request: NextRequest) {
  if (!request.cookies.has(SESSION_COOKIE)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/history/:path*",
    "/integrations/:path*",
    "/master-data/:path*",
    "/quotations/:path*",
    "/quote-requests/:path*",
    "/settings/:path*",
  ],
};
