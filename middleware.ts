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
    if (pathname.startsWith('/dashboard') || pathname === '/create-profile') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return supabaseResponse
  }

  // ── Authenticated — check onboarding via workspace (NOT full_name) ─────────
  //
  // Google & GitHub OAuth auto-populate full_name in profiles, so checking
  // full_name gives a false "complete" signal. A workspace only exists after
  // the user finishes /create-profile, making it the reliable onboarding flag.
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id')
    .eq('owner_id', user.id)
    .limit(1)
    .maybeSingle()

  const onboardingComplete = !!workspace

  // Already logged in → don't let them stay on /login
  if (pathname === '/login') {
    const dest = onboardingComplete ? '/dashboard' : '/create-profile'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  // Trying to access dashboard but onboarding not done → must complete profile first
  if (pathname.startsWith('/dashboard') && !onboardingComplete) {
    return NextResponse.redirect(new URL('/create-profile', request.url))
  }

  // Trying to access create-profile but already onboarded → go to dashboard
  if (pathname === '/create-profile' && onboardingComplete) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/create-profile'],
}
