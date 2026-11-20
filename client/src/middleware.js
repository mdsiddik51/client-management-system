import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie =
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-better-auth.session_token');

  const isAuthenticated = !!sessionCookie;

  // If authenticated user hits auth pages, redirect them to the appropriate dashboard.
  // Role is not available in edge middleware, so we redirect to a neutral entry point
  // that the admin/client layouts will re-route from based on session role.
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    // Prefer the 'from' param if provided; otherwise default to client dashboard
    // (the client layout will redirect ADMINs to /admin/dashboard on the client side).
    const from = request.nextUrl.searchParams.get('from');
    return NextResponse.redirect(new URL(from || '/client/dashboard', request.url));
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect client routes
  if (pathname.startsWith('/client')) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/client/:path*', '/login', '/register'],
};
