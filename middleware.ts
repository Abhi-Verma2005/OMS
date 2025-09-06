import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
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

  // User-only routes (shopping, cart, checkout, orders)
  const isUserOnlyRoute = nextUrl.pathname.startsWith('/cart') ||
                         nextUrl.pathname.startsWith('/checkout') ||
                         nextUrl.pathname.startsWith('/orders') ||
                         nextUrl.pathname.startsWith('/data')

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/signin', nextUrl))
  }

  // Check if user is admin and trying to access user-only features
  if (token && isUserOnlyRoute) {
    try {
      const session = await auth()
      if (session?.user && (session.user as any)?.isAdmin) {
        // Redirect admin users to admin dashboard when they try to access user features
        return NextResponse.redirect(new URL('/admin', nextUrl))
      }
    } catch (error) {
      console.error('Error checking admin status in middleware:', error)
      // Continue with normal flow if there's an error
    }
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
