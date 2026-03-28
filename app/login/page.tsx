'use client'

import { useState } from 'react'
import { signInWithGoogle, signInWithFacebook, signInWithApple } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regSuccess, setRegSuccess] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login failed'); return }

      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      })
      router.push('/dashboard')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed'); return }
      setRegSuccess(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#191919] flex items-center justify-center">
      <div className="bg-[#202020] border border-white/10 rounded-2xl p-10 flex flex-col items-center gap-5 w-full max-w-sm">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">VeloScribe</h1>
          <p className="text-sm text-neutral-400 mt-1">Your AI-powered workspace</p>
        </div>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-2 w-full">
          {/* Google */}
          <form action={signInWithGoogle} className="w-full">
            <Button type="submit" variant="outline" className="w-full gap-2 bg-white text-black hover:bg-neutral-100">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </form>

          {/* Facebook */}
          <form action={signInWithFacebook} className="w-full">
            <Button type="submit" variant="outline" className="w-full gap-2 bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#166FE5] hover:border-[#166FE5]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </Button>
          </form>

          {/* Apple */}
          <form action={signInWithApple} className="w-full">
            <Button type="submit" variant="outline" className="w-full gap-2 bg-black text-white border-white/20 hover:bg-neutral-900">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
              </svg>
              Continue with Apple
            </Button>
          </form>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-neutral-500">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Tabs */}
        <div className="flex w-full rounded-lg bg-[#191919] p-1 gap-1">
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); setRegSuccess(false) }}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors capitalize
                ${tab === t ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && <p className="text-sm text-red-400 text-center w-full">{error}</p>}

        {/* Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
            <input
              type="email" placeholder="Email" value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)} required
              className="w-full bg-[#191919] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
            />
            <input
              type="password" placeholder="Password" value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)} required
              className="w-full bg-[#191919] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
            />
            <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-neutral-100 mt-1">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          regSuccess ? (
            <div className="text-center">
              <p className="text-green-400 text-sm font-medium">🎉 Account created!</p>
              <p className="text-neutral-400 text-xs mt-1">Switch to Login tab to sign in.</p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="w-full flex flex-col gap-3">
              <input
                type="text" placeholder="Full Name" value={regName}
                onChange={e => setRegName(e.target.value)} required
                className="w-full bg-[#191919] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
              />
              <input
                type="email" placeholder="Email" value={regEmail}
                onChange={e => setRegEmail(e.target.value)} required
                className="w-full bg-[#191919] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
              />
              <input
                type="password" placeholder="Password (min 8 characters)" value={regPassword}
                onChange={e => setRegPassword(e.target.value)} required minLength={8}
                className="w-full bg-[#191919] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
              />
              <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-neutral-100 mt-1">
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          )
        )}
      </div>
    </div>
  )
}