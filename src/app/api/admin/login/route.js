import { NextResponse } from 'next/server'

const PASSWORD     = process.env.ADMIN_PASSWORD
const COOKIE_SECRET = process.env.ADMIN_COOKIE_SECRET ?? 'fallback_secret'

// Simple HMAC-free token: base64(secret + ":" + timestamp)
// Good enough for a single-admin site — not a bank
function makeToken() {
  const payload = `${COOKIE_SECRET}:${Date.now()}`
  return Buffer.from(payload).toString('base64')
}

export function validateToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const [secret] = decoded.split(':')
    return secret === COOKIE_SECRET
  } catch {
    return false
  }
}

export async function POST(request) {
  const { password } = await request.json()

  if (!PASSWORD) {
    return NextResponse.json({ error: 'Admin password not configured.' }, { status: 500 })
  }

  if (password !== PASSWORD) {
    return NextResponse.json({ error: 'Wrong password.' }, { status: 401 })
  }

  const token = makeToken()
  const response = NextResponse.json({ ok: true })

  response.cookies.set('wv_admin', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('wv_admin')
  return response
}
