import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/professor', '/colegiado', '/departamento'];
const publicRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get('role')?.value;
  const userName = request.cookies.get('user_name')?.value;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If the user is not logged in and tries to access a protected route
  if (isProtectedRoute && (!role || !userName)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user is logged in, handle routing
  if (role && userName) {
    // If trying to access login page, redirect to their dashboard
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }

    // If trying to access a protected route that is not their own, redirect
    if (isProtectedRoute && !pathname.startsWith(`/${role}`) && pathname !== '/dashboard') {
       return NextResponse.redirect(new URL(`/${role}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
