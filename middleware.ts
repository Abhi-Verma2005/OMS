import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const { nextUrl } = request
  const token = request.cookies.get("authjs.session-token") || 
                request.cookies.get("__Secure-authjs.session-token")

  // Protected routes
  const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard') || 
                          nextUrl.pathname.startsWith('/admin') ||
                          nextUrl.pathname.startsWith('/profile') ||
                          nextUrl.pathname.startsWith('/data')

  // Admin routes
  const isAdminRoute = nextUrl.pathname.startsWith('/admin')

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/signin', nextUrl))
  }

  // For admin routes, we'll let the page handle the role check
  // since we can't easily decode the JWT in middleware without the secret

  return NextResponse.next()
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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
