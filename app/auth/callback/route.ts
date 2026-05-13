import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const proto = request.headers.get('x-forwarded-proto')
      const hostHeader = request.headers.get('host')
      const host = forwardedHost || hostHeader
      let redirectUrl = next

      if (host && host.includes('vercel.app')) {
        redirectUrl = `${proto}://${host}${next}`
      } else {
        redirectUrl = `${proto || 'http'}://${host}${next}`
      }

      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.redirect(new URL('/auth/error', request.url))
}
