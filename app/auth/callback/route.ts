import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  // If provider returned an error, send to login with error info
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`)
  }

  if (!code) {
    // No code and no error — something unexpected, send to login
    return NextResponse.redirect(`${origin}/login`)
  }

  const supabase = await createClient()
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message)}`)
  }

  // Get the user after session is established
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}/login`)
  }

  // Retry profile check a few times to handle async trigger delay
  // (Supabase triggers that create the profile row may not fire instantly)
  let profile = null
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle()

    if (data !== null) {
      profile = data
      break
    }

    // Wait 300ms before retrying (only needed on first OAuth login)
    if (attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
  }

  // If profile exists and has a full_name, they've completed onboarding
  if (profile?.full_name) {
    return NextResponse.redirect(`${origin}/dashboard`)
  }

  // Otherwise send to create-profile (new user or incomplete profile)
  return NextResponse.redirect(`${origin}/create-profile`)
}