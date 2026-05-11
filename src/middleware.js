import { NextResponse } from 'next/server'

const COOKIE_SECRET = process.env.ADMIN_COOKIE_SECRET ?? 'fallback_secret'

function isValidToken(token) {
  if (!token) return false
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const [secret] = decoded.split(':')
    return secret === COOKIE_SECRET
  } catch {
    return false
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Only guard /admin routes — but NOT /admin/login (infinite redirect)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('wv_admin')?.value
    if (!isValidToken(token)) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
