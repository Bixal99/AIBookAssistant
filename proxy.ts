import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

import { ROUTES } from "@/lib/auth-constants";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  const isAuthPage =
    pathname === ROUTES.signIn || pathname === ROUTES.signUp;
  const isProtected =
    pathname === ROUTES.dashboard ||
    pathname === ROUTES.library ||
    pathname === ROUTES.settings ||
    pathname === ROUTES.admin ||
    pathname === ROUTES.notifications ||
    pathname.startsWith("/books");

  if (isProtected && !sessionCookie) {
    const signInUrl = new URL(ROUTES.signIn, request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/library",
    "/settings",
    "/admin",
    "/notifications",
    "/books/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
