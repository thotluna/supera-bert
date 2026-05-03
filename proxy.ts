import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 1. Detección de bypass para pruebas E2E
  // Priorizamos headers de Playwright o la cookie de sesión de test
  const hasTestCookie = request.cookies.get('e2e-test-auth')?.value === 'true'
  const hasTestHeader = request.headers.get('x-e2e-test-auth') === 'true'
  const isBypassActive = hasTestCookie || hasTestHeader

  let user = null

  if (isBypassActive) {
    // Inyectamos usuario de prueba inmediatamente
    // Definimos la estructura mínima para cumplir con el tipo User de Supabase
    user = {
      id: 'e2e-test-id',
      email: 'test@example.com',
      user_metadata: { full_name: 'Test User' },
      app_metadata: {},
      aud: 'authenticated',
      role: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      factors: [],
      phone: '',
    } as unknown as ReturnType<typeof supabase.auth.getUser> extends Promise<{ data: { user: infer U } }> ? U : null
  } else {
    // Solo consultamos a Supabase si no hay bypass activo
    try {
      const { data } = await supabase.auth.getUser()
      user = data.user
    } catch {
      // En producción, si falla getUser, el usuario seguirá siendo null
      user = null
    }
  }

  const isPublicRoute = request.nextUrl.pathname.startsWith('/login') || 
                        request.nextUrl.pathname.startsWith('/auth')

  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
