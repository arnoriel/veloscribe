'use client'

import { useState } from 'react'
import { signInWithGoogle, signInWithGithub } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { motion, AnimatePresence } from 'framer-motion'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
})

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

const C = {
  bg: '#06091A',
  bgCard: '#0C1428',
  accent: '#4D7FFF',
  accentLight: '#7AA3FF',
  accentGlow: 'rgba(77,127,255,0.15)',
  accentBorder: 'rgba(77,127,255,0.25)',
  text: '#E2EAFF',
  muted: 'rgba(226,234,255,0.5)',
  dim: 'rgba(226,234,255,0.28)',
  border: 'rgba(226,234,255,0.07)',
  borderStrong: 'rgba(226,234,255,0.12)',
}

function OAuthButton({
  action,
  icon,
  label,
}: {
  action: () => Promise<void>
  icon: React.ReactNode
  label: string
}) {
  return (
    <form action={action} className="w-full">
      <button
        type="submit"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '11px 16px',
          background: 'rgba(226,234,255,0.04)',
          border: `1px solid ${C.borderStrong}`,
          borderRadius: 10,
          color: 'rgba(226,234,255,0.75)',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.2s, border-color 0.2s, color 0.2s',
          fontFamily: 'var(--font-jakarta)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.background = 'rgba(226,234,255,0.07)'
          el.style.borderColor = C.accentBorder
          el.style.color = C.text
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.background = 'rgba(226,234,255,0.04)'
          el.style.borderColor = C.borderStrong
          el.style.color = 'rgba(226,234,255,0.75)'
        }}
      >
        {icon}
        {label}
      </button>
    </form>
  )
}

function VSInput({
  type,
  placeholder,
  value,
  onChange,
  required,
  minLength,
  rightEl,
}: {
  type: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  minLength?: number
  rightEl?: React.ReactNode
}) {
  return (
    <div className="relative w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        className="vs-input"
        style={{
          width: '100%',
          padding: rightEl ? '12px 44px 12px 14px' : '12px 14px',
          fontSize: 14,
          fontFamily: 'var(--font-jakarta)',
          // PENYESUAIAN DISINI:
          backgroundColor: 'rgba(255, 255, 255, 0.03)', // Latar sedikit lebih terang dari kartu
          border: `1px solid ${C.borderStrong}`, // Border lebih tegas
          borderRadius: 10,
          color: C.text,
          outline: 'none',
          transition: 'all 0.2s ease',
        }}
        // Menambahkan efek glow saat fokus via onFocus/onBlur jika tidak pakai CSS eksternal
        onFocus={(e) => {
          e.currentTarget.style.borderColor = C.accent
          e.currentTarget.style.backgroundColor = 'rgba(77, 127, 255, 0.05)'
          e.currentTarget.style.boxShadow = `0 0 0 4px ${C.accentGlow}`
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = C.borderStrong
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      />
      {rightEl && (
        <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}>
          {rightEl}
        </div>
      )}
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

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
      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      })
      // middleware will redirect to /create-profile if no profile
      router.push('/dashboard')
      router.refresh()
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
      // Step 1: Register
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registration failed')
        return
      }

      // Step 2: Auto sign-in
      const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regEmail, password: regPassword }),
      })
      const loginData = await loginRes.json()
      if (!loginRes.ok) {
        // fallback: redirect to login tab
        setTab('login')
        setError('Account created! Please sign in.')
        return
      }

      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      await supabase.auth.setSession({
        access_token: loginData.access_token,
        refresh_token: loginData.refresh_token,
      })

      // New users always go to profile setup
      router.push('/create-profile')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const eyeBtn = (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      style={{ color: C.dim, cursor: 'pointer', background: 'none', border: 'none', padding: 0, display: 'flex' }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.muted)}
      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.dim)}
    >
      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  )

  return (
    <div
      className={jakarta.variable}
      style={{
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'var(--font-jakarta)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glows */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(77,127,255,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '20%', width: 250, height: 250, background: 'radial-gradient(ellipse, rgba(77,127,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: 200, height: 200, background: 'radial-gradient(ellipse, rgba(77,127,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        style={{
          width: '100%',
          maxWidth: 420,
          background: C.bgCard,
          border: `1px solid ${C.accentBorder}`,
          borderRadius: 20,
          padding: '36px 32px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02) inset',
        }}
      >
        {/* Card inner glow */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 65%)`, pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 28, position: 'relative' }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: 'linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(77,127,255,0.4)' }}>
            <Zap size={20} color="#fff" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: '-0.025em', margin: 0 }}>VeloScribe</h1>
            <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Your AI-powered workspace</p>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          <OAuthButton
            action={signInWithGoogle}
            label="Continue with Google"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            }
          />
          <OAuthButton
            action={signInWithGithub}
            label="Continue with GitHub"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            }
          />
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 12, color: C.dim, fontWeight: 500 }}>or</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'rgba(10,14,35,0.6)', borderRadius: 10, padding: 4, marginBottom: 20, border: `1px solid ${C.border}` }}>
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); setShowPassword(false) }}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'var(--font-jakarta)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'capitalize',
                background: tab === t ? C.accentGlow : 'transparent',
                color: tab === t ? C.accentLight : C.dim,
                borderColor: tab === t ? C.accentBorder : 'transparent',
                outline: tab === t ? `1px solid ${C.accentBorder}` : 'none',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              style={{
                padding: '10px 14px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 9,
                color: '#fc8b8b',
                fontSize: 13,
                marginBottom: 14,
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <AnimatePresence mode="wait">
          {tab === 'login' && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleLogin}
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              <VSInput type="email" placeholder="Email address" value={loginEmail} onChange={setLoginEmail} required />
              <VSInput
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={loginPassword}
                onChange={setLoginPassword}
                required
                rightEl={eyeBtn}
              />
              <button
                type="submit"
                disabled={loading}
                className="vs-btn-primary"
                style={{
                  padding: '12px 0',
                  fontSize: 14,
                  fontFamily: 'var(--font-jakarta)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  marginTop: 4,
                  width: '100%',
                  background: 'linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  boxShadow: '0 4px 20px rgba(77,127,255,0.35)',
                }}
              >
                {loading ? (
                  <span>Signing in…</span>
                ) : (
                  <>Sign In <ArrowRight size={15} /></>
                )}
              </button>
            </motion.form>
          )}

          {tab === 'register' && (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleRegister}
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              <VSInput type="text" placeholder="Full name" value={regName} onChange={setRegName} required />
              <VSInput type="email" placeholder="Email address" value={regEmail} onChange={setRegEmail} required />
              <VSInput
                type={showPassword ? 'text' : 'password'}
                placeholder="Password (min 8 characters)"
                value={regPassword}
                onChange={setRegPassword}
                required
                minLength={8}
                rightEl={eyeBtn}
              />
              <button
                type="submit"
                disabled={loading}
                className="vs-btn-primary"
                style={{
                  padding: '12px 0',
                  fontSize: 14,
                  fontFamily: 'var(--font-jakarta)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  marginTop: 4,
                  width: '100%',
                  background: 'linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  boxShadow: '0 4px 20px rgba(77,127,255,0.35)',
                }}
              >
                {loading ? (
                  <span>Creating account…</span>
                ) : (
                  <>Create Free Account <ArrowRight size={15} /></>
                )}
              </button>

              <p style={{ textAlign: 'center', fontSize: 12, color: C.dim, marginTop: 4 }}>
                Free forever. No credit card required.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
