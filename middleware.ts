import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // THIS IS CRITICAL - refresh session before any check
  const { data: { session } } = await supabase.auth.getSession()

  // NEVER block auth routes
  if (req.nextUrl.pathname.startsWith('/auth')) {
    return res
  }

  // Protect dashboard only
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard') || 
                      req.nextUrl.pathname.startsWith('/learn') ||
                      req.nextUrl.pathname.startsWith('/admin')

  if (!session && isProtected) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/learn/:path*', '/admin/:path*', '/auth/:path*', '/subjects/:path*']
}
