'use client'

import dynamic from 'next/dynamic'

// Dynamic import prevents SSR for TipTap (it needs browser APIs)
const TipTapEditor = dynamic(() => import('@/components/editor/Editor'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: '100vh',
        background: '#06091A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 1.4s ease-in-out infinite',
          }}
        >
          <span style={{ fontSize: 18 }}>✏️</span>
        </div>
        <span
          style={{
            fontSize: 13,
            color: 'rgba(226,234,255,0.35)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Loading editor…
        </span>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.92); }
          }
        `}</style>
      </div>
    </div>
  ),
})

interface EditorClientProps {
  pageId: string
  initialTitle: string
  initialEmoji: string
  initialContent: object | null
}

export default function EditorClient(props: EditorClientProps) {
  return <TipTapEditor {...props} />
}