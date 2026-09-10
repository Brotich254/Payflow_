import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware() {
    // This middleware runs on protected routes
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/invoices/:path*',
    '/customers/:path*',
    '/payments/:path*',
    '/analytics/:path*',
    '/settings/:path*',
  ],
}
