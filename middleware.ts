import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const { pathname } = req.nextUrl;

  // Skip middleware for API routes and static files
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Allow access to home page, login, and signup without authentication
  if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    // If user is authenticated and trying to access login/signup, redirect to dashboard
    if (token && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // For all other pages, require authentication
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
