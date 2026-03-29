'use client'

import { useEffect, useState, useRef } from 'react'
import { Zap } from 'lucide-react'

interface WelcomeAnimationProps {
  firstName: string
  onDone: () => void
}

export default function WelcomeAnimation({ firstName, onDone }: WelcomeAnimationProps) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function dismiss() {
    if (phase === 'exit') return
    setPhase('exit')
    timerRef.current = setTimeout(onDone, 700)
  }

  useEffect(() => {
    // enter → hold after 600ms, hold → exit after 2600ms total
    const t1 = setTimeout(() => setPhase('hold'), 600)
    const t2 = setTimeout(() => dismiss(), 3200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Click or keypress also dismisses
  useEffect(() => {
    const handleKey = () => dismiss()
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  return (
    <>
      <style>{`
        @keyframes vs-fade-in   { from { opacity: 0 } to { opacity: 1 } }
        @keyframes vs-fade-out  { from { opacity: 1 } to { opacity: 0 } }
        @keyframes vs-scale-in  { from { opacity: 0; transform: scale(0.82) } to { opacity: 1; transform: scale(1) } }
        @keyframes vs-rise      { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes vs-rise-2    { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes vs-rise-3    { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes vs-exit      { from { opacity: 1; transform: scale(1) } to { opacity: 0; transform: scale(1.04) } }
        @keyframes vs-pulse-ring {
          0%   { transform: scale(0.85); opacity: 0.5 }
          50%  { transform: scale(1.15); opacity: 0 }
          100% { transform: scale(0.85); opacity: 0 }
        }
        @keyframes vs-particle-1 { 0% { transform: translate(0,0) scale(1); opacity: 0.7 } 100% { transform: translate(-60px,-80px) scale(0); opacity: 0 } }
        @keyframes vs-particle-2 { 0% { transform: translate(0,0) scale(1); opacity: 0.6 } 100% { transform: translate(70px,-60px) scale(0); opacity: 0 } }
        @keyframes vs-particle-3 { 0% { transform: translate(0,0) scale(1); opacity: 0.5 } 100% { transform: translate(-40px,70px) scale(0); opacity: 0 } }
        @keyframes vs-particle-4 { 0% { transform: translate(0,0) scale(1); opacity: 0.6 } 100% { transform: translate(80px,50px) scale(0); opacity: 0 } }
        @keyframes vs-particle-5 { 0% { transform: translate(0,0) scale(1); opacity: 0.4 } 100% { transform: translate(20px,-90px) scale(0); opacity: 0 } }
        @keyframes vs-particle-6 { 0% { transform: translate(0,0) scale(1); opacity: 0.5 } 100% { transform: translate(-80px,30px) scale(0); opacity: 0 } }
        @keyframes vs-glow-spin { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }
        @keyframes vs-dots { 0%, 80%, 100% { opacity: 0.2; transform: scale(0.7) } 40% { opacity: 1; transform: scale(1) } }

        .vs-overlay-enter { animation: vs-fade-in 0.5s ease forwards; }
        .vs-overlay-exit  { animation: vs-exit 0.7s cubic-bezier(0.4,0,0.2,1) forwards; }

        .vs-logo-wrap { animation: vs-scale-in 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.2s both; }

        .vs-tag  { animation: vs-rise   0.5s ease 0.5s both; }
        .vs-name { animation: vs-rise-2 0.5s ease 0.7s both; }
        .vs-sub  { animation: vs-rise-3 0.5s ease 0.9s both; }
        .vs-hint { animation: vs-fade-in 0.5s ease 1.6s both; }

        .vs-ring {
          position: absolute; inset: -20px;
          border-radius: 50%;
          border: 2px solid rgba(77,127,255,0.35);
          animation: vs-pulse-ring 2s ease-out infinite;
        }
        .vs-ring-2 {
          position: absolute; inset: -36px;
          border-radius: 50%;
          border: 1.5px solid rgba(77,127,255,0.20);
          animation: vs-pulse-ring 2s ease-out 0.5s infinite;
        }

        .vs-p1 { position:absolute; width:8px; height:8px; border-radius:50%; background:#4D7FFF; animation: vs-particle-1 1.2s ease-out 0.4s both; }
        .vs-p2 { position:absolute; width:6px; height:6px; border-radius:50%; background:#7AA3FF; animation: vs-particle-2 1.0s ease-out 0.5s both; }
        .vs-p3 { position:absolute; width:5px; height:5px; border-radius:50%; background:#4D7FFF; animation: vs-particle-3 1.3s ease-out 0.6s both; }
        .vs-p4 { position:absolute; width:7px; height:7px; border-radius:50%; background:#AABFFF; animation: vs-particle-4 1.1s ease-out 0.45s both; }
        .vs-p5 { position:absolute; width:4px; height:4px; border-radius:50%; background:#7AA3FF; animation: vs-particle-5 1.4s ease-out 0.55s both; }
        .vs-p6 { position:absolute; width:6px; height:6px; border-radius:50%; background:#4D7FFF; animation: vs-particle-6 1.2s ease-out 0.5s both; }

        .vs-skip-dot { display:inline-block; animation: vs-dots 1.4s ease-in-out infinite; }
        .vs-skip-dot:nth-child(2) { animation-delay: 0.2s; }
        .vs-skip-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <div
        className={phase === 'exit' ? 'vs-overlay-exit' : 'vs-overlay-enter'}
        onClick={dismiss}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: '#06091A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
      >
        {/* Background radial glows */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 500,
          background: 'radial-gradient(ellipse, rgba(77,127,255,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', left: '15%',
          width: 350, height: 350,
          background: 'radial-gradient(ellipse, rgba(77,127,255,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '12%',
          width: 280, height: 280,
          background: 'radial-gradient(ellipse, rgba(100,140,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Center content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, position: 'relative' }}>

          {/* Logo icon with particles */}
          <div className="vs-logo-wrap" style={{ position: 'relative', marginBottom: 32 }}>
            {/* Pulse rings */}
            <div className="vs-ring" />
            <div className="vs-ring-2" />

            {/* Particles */}
            <div className="vs-p1" />
            <div className="vs-p2" style={{ top: '-10px', right: '-10px' }} />
            <div className="vs-p3" style={{ bottom: '-8px', left: '-12px' }} />
            <div className="vs-p4" style={{ bottom: '-12px', right: '-8px' }} />
            <div className="vs-p5" style={{ top: '-14px', left: '20px' }} />
            <div className="vs-p6" style={{ top: '10px', right: '-18px' }} />

            {/* Main icon */}
            <div style={{
              width: 80, height: 80, borderRadius: 22,
              background: 'linear-gradient(135deg, #2952CC 0%, #4D7FFF 50%, #6B9FFF 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 1px rgba(77,127,255,0.4), 0 20px 60px rgba(77,127,255,0.45), 0 0 80px rgba(77,127,255,0.25)',
              position: 'relative', zIndex: 1,
            }}>
              <Zap size={38} color="#fff" strokeWidth={2.5} />
            </div>
          </div>

          {/* App tag */}
          <div className="vs-tag" style={{
            fontSize: 12, fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(77,127,255,0.85)',
            marginBottom: 16,
          }}>
            VeloScribe
          </div>

          {/* Welcome headline */}
          <div className="vs-name" style={{
            fontSize: 42, fontWeight: 800,
            color: '#E2EAFF',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            textAlign: 'center',
            marginBottom: 14,
          }}>
            Welcome,{' '}
            <span style={{
              background: 'linear-gradient(90deg, #7AA3FF 0%, #AABFFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {firstName}!
            </span>
          </div>

          {/* Subtitle */}
          <div className="vs-sub" style={{
            fontSize: 16, color: 'rgba(226,234,255,0.45)',
            fontWeight: 400, textAlign: 'center',
            maxWidth: 320, lineHeight: 1.6,
          }}>
            Your workspace is ready. Let&apos;s build something great.
          </div>
        </div>

        {/* Skip hint */}
        <div className="vs-hint" style={{
          position: 'absolute', bottom: 36,
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, color: 'rgba(226,234,255,0.22)',
          fontWeight: 500,
          letterSpacing: '0.04em',
        }}>
          <span className="vs-skip-dot">•</span>
          <span className="vs-skip-dot">•</span>
          <span className="vs-skip-dot">•</span>
          <span style={{ marginLeft: 4 }}>click anywhere or press any key to skip</span>
        </div>
      </div>
    </>
  )
}