import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ── Not authenticated ──────────────────────────────────────
  if (!user) {
    // Protect dashboard and create-profile
    if (pathname.startsWith('/dashboard') || pathname === '/create-profile') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return supabaseResponse
  }

  // ── Authenticated — check profile completion ───────────────
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle()

  const profileComplete = !!(profile?.full_name)

  // Already logged in → don't let them stay on /login
  if (pathname === '/login') {
    const dest = profileComplete ? '/dashboard' : '/create-profile'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  // Trying to access dashboard but no profile yet → must complete profile first
  if (pathname.startsWith('/dashboard') && !profileComplete) {
    return NextResponse.redirect(new URL('/create-profile', request.url))
  }

  // Trying to access create-profile but profile already done → go to dashboard
  if (pathname === '/create-profile' && profileComplete) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/create-profile'],
}
