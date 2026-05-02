import { exchangeCodeForSession } from "@/libs/auth/actions/exchange-code-for-session"
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const { error } = await exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Si no hay código o hubo error, redirigir a error o login
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}