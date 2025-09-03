import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/escolher-materias', '/resultado-materias', '/minhas-materias', '/dashboard'];
const publicRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If the user is trying to access a protected route without a session, redirect to login
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user is logged in and tries to access the login page, redirect to the dashboard
  if (sessionCookie && publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/escolher-materias', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Matcher to specify which routes the middleware should run on.
  // This avoids running the middleware on static files and other assets.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
