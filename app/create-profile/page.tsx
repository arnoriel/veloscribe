'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Zap, ArrowRight, Check } from 'lucide-react'
import { saveProfile } from '@/app/actions/profile'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
})

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

const AVATARS = [
  '🦊', '🐻', '🐼', '🦁', '🐯', '🐨',
  '🦅', '🦋', '🐬', '🦄', '🐉', '🌟',
  '🎭', '🚀', '⚡', '🔮', '🎯', '🌊',
]

const STEPS = [
  { id: 1, label: 'Your Identity' },
  { id: 2, label: 'Your Workspace' },
]

export default function CreateProfilePage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dir, setDir] = useState(1)

  const [fullName, setFullName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('🦊')
  const [workspaceName, setWorkspaceName] = useState('')

  // Derived suggested workspace name
  const suggestedWorkspaceName = `${fullName.split(' ')[0] || 'My'}'s Workspace`

  async function handleFinish() {
    setLoading(true)
    setError('')
    try {
      // Use whatever user typed, or fall back to the suggested name (never empty)
      const finalWorkspaceName = workspaceName.trim() || suggestedWorkspaceName
      const result = await saveProfile(fullName, selectedAvatar, finalWorkspaceName)
      if (!result.success) {
        setError(result.error)
        return
      }
      // Hard navigation — forces middleware to re-check the now-complete profile
      window.location.href = '/dashboard'
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleStep1Next() {
    if (!fullName.trim()) {
      setError('Please enter your full name.')
      return
    }
    setError('')
    // Pre-fill workspace name with suggestion when moving to step 2
    if (!workspaceName.trim()) {
      setWorkspaceName(suggestedWorkspaceName)
    }
    setDir(1)
    setStep(2)
  }

  function goBack() {
    setDir(-1)
    setError('')
    setStep(1)
  }

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 32 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: -d * 32 }),
  }

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
      <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(77,127,255,0.09) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: 300, height: 300, background: 'radial-gradient(ellipse, rgba(77,127,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative' }}>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}
        >
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, color: C.text, letterSpacing: '-0.02em' }}>VeloScribe</span>
        </motion.div>

        {/* Step progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}
        >
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, transition: 'all 0.3s',
                  background: step > s.id ? 'linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)' : step === s.id ? C.accentGlow : 'rgba(226,234,255,0.04)',
                  border: step > s.id ? '2px solid #5d8aff' : step === s.id ? `2px solid ${C.accent}` : `2px solid ${C.border}`,
                  color: step > s.id ? '#fff' : step === s.id ? C.accentLight : C.dim,
                  boxShadow: step === s.id ? `0 0 0 4px rgba(77,127,255,0.12)` : 'none',
                }}>
                  {step > s.id ? <Check size={14} /> : s.id}
                </div>
                <span style={{ fontSize: 11, color: step === s.id ? C.accentLight : C.dim, fontWeight: step === s.id ? 600 : 400, whiteSpace: 'nowrap' }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 64, height: 2, margin: '0 8px', marginTop: -20, background: step > s.id ? `linear-gradient(90deg, #4d7fff, #5d8aff)` : C.border, transition: 'background 0.4s', borderRadius: 1 }} />
              )}
            </div>
          ))}
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            background: C.bgCard,
            border: `1px solid ${C.accentBorder}`,
            borderRadius: 20,
            padding: '36px 32px',
            boxShadow: '0 40px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.02) inset',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 65%)`, pointerEvents: 'none' }} />

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 9, color: '#fc8b8b', fontSize: 13, marginBottom: 20 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait" custom={dir}>
            {/* ── STEP 1 ── */}
            {step === 1 && (
              <motion.div key="step1" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <div style={{ marginBottom: 28 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: '-0.025em', margin: '0 0 8px' }}>Nice to meet you! 👋</h2>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>Let&apos;s set up your profile. This is how you&apos;ll appear in VeloScribe.</p>
                </div>

                {/* Full name */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.dim, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStep1Next()}
                    style={{ width: '100%', padding: '12px 14px', fontSize: 15, fontFamily: 'var(--font-jakarta)', fontWeight: 500, color: '#E2EAFF', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(226,234,255,0.12)', borderRadius: 10, outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#4D7FFF'; e.currentTarget.style.backgroundColor = 'rgba(77,127,255,0.05)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(77,127,255,0.15)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(226,234,255,0.12)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.boxShadow = 'none' }}
                    autoFocus
                  />
                </div>

                {/* Avatar picker */}
                <div style={{ marginBottom: 28 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.dim, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Pick an Avatar</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                    {AVATARS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedAvatar(emoji)}
                        style={{
                          padding: '10px 0', fontSize: 20, borderRadius: 10,
                          border: selectedAvatar === emoji ? `2px solid ${C.accent}` : `2px solid ${C.border}`,
                          background: selectedAvatar === emoji ? C.accentGlow : 'rgba(226,234,255,0.03)',
                          cursor: 'pointer', transition: 'all 0.15s',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: selectedAvatar === emoji ? `0 0 0 3px rgba(77,127,255,0.15)` : 'none',
                          transform: selectedAvatar === emoji ? 'scale(1.08)' : 'scale(1)',
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(77,127,255,0.06)', borderRadius: 10, border: `1px solid ${C.accentBorder}`, marginBottom: 24 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentGlow, border: `1px solid ${C.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {selectedAvatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{fullName || 'Your Name'}</div>
                    <div style={{ fontSize: 12, color: C.dim }}>Free plan</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStep1Next}
                  style={{ width: '100%', padding: '13px 0', fontSize: 14, fontFamily: 'var(--font-jakarta)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 'none', borderRadius: 10, cursor: 'pointer', background: 'linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)', color: '#fff', fontWeight: 700, boxShadow: '0 4px 20px rgba(77,127,255,0.35)', transition: 'box-shadow 0.2s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 28px rgba(77,127,255,0.55)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(77,127,255,0.35)' }}
                >
                  Continue <ArrowRight size={15} />
                </button>
              </motion.div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <motion.div key="step2" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <div style={{ marginBottom: 28 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: '-0.025em', margin: '0 0 8px' }}>Set up your workspace ✨</h2>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>This is your personal space. You can rename it later anytime.</p>
                </div>

                {/* Profile summary */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(77,127,255,0.06)', borderRadius: 10, border: `1px solid ${C.accentBorder}`, marginBottom: 24 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentGlow, border: `1px solid ${C.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {selectedAvatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{fullName}</div>
                    <div style={{ fontSize: 12, color: C.dim }}>Profile ready ✓</div>
                  </div>
                </div>

                {/* Workspace name — pre-filled, user can edit */}
                <div style={{ marginBottom: 28 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.dim, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Workspace Name</label>
                  <input
                    type="text"
                    placeholder={suggestedWorkspaceName}
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFinish()}
                    style={{ width: '100%', padding: '12px 14px', fontSize: 15, fontFamily: 'var(--font-jakarta)', fontWeight: 500, color: '#E2EAFF', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(226,234,255,0.12)', borderRadius: 10, outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#4D7FFF'; e.currentTarget.style.backgroundColor = 'rgba(77,127,255,0.05)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(77,127,255,0.15)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(226,234,255,0.12)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.boxShadow = 'none' }}
                    autoFocus
                  />
                  <p style={{ fontSize: 12, color: C.dim, marginTop: 6 }}>
                    This will be the name of your first workspace — you can create more later.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={goBack}
                    style={{ flex: '0 0 auto', padding: '13px 20px', borderRadius: 10, border: `1px solid ${C.borderStrong}`, background: 'transparent', color: C.muted, fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-jakarta)', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(226,234,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = C.text }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = C.muted }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleFinish}
                    disabled={loading}
                    style={{ flex: 1, padding: '13px 0', fontSize: 14, fontFamily: 'var(--font-jakarta)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, background: 'linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)', color: '#fff', fontWeight: 700, boxShadow: '0 4px 20px rgba(77,127,255,0.35)', transition: 'box-shadow 0.2s' }}
                    onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 28px rgba(77,127,255,0.55)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(77,127,255,0.35)' }}
                  >
                    {loading ? 'Setting up…' : <><Zap size={14} /> Get Started</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ textAlign: 'center', fontSize: 12, color: C.dim, marginTop: 20 }}>
          You can update your profile at any time in Settings.
        </motion.p>
      </div>
    </div>
  )
}