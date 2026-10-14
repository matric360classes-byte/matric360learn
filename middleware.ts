import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const code = url.searchParams.get('code')
  
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // If ?code= present anywhere, exchange it here too (safety net for /?code= bug)
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
    url.searchParams.delete('code')
    const redirectResponse = NextResponse.redirect(url.origin + '/dashboard')
    // copy cookies to redirect response
    request.cookies.getAll().forEach(c => {
      redirectResponse.cookies.set(c.name, c.value)
    })
    response.cookies.getAll().forEach(c => {
      redirectResponse.cookies.set(c.name, c.value, c as any)
    })
    return redirectResponse
  }

  await supabase.auth.getUser()
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
