'use client'

import { useState, useRef, useCallback, type CSSProperties } from 'react'
import { Editor } from '@tiptap/react'
import { getDocumentContext } from '@/lib/ai/contextParser'

// ─── Theme colours (match Editor.tsx) ────────────────────────────────────────
const C = {
  bg:           '#06091A',
  bgCard:       '#0B1325',
  text:         '#E2EAFF',
  muted:        'rgba(226,234,255,0.50)',
  dim:          'rgba(226,234,255,0.28)',
  border:       'rgba(226,234,255,0.07)',
  borderStrong: 'rgba(226,234,255,0.12)',
  accent:       '#4D7FFF',
  accentLight:  '#7AA3FF',
  accentBorder: 'rgba(77,127,255,0.28)',
  accentBg:     'rgba(77,127,255,0.12)',
  success:      'rgba(74,222,128,0.70)',
  error:        'rgba(248,113,113,0.85)',
}

// ─── Action definitions ───────────────────────────────────────────────────────

type AIAction = {
  id: string
  label: string
  icon: string
  description: string
  group: 'edit' | 'transform' | 'tone'
}

const AI_ACTIONS: AIAction[] = [
  { id: 'improve',                  label: 'Improve writing',     icon: '✨', description: 'Enhance clarity & flow',    group: 'edit' },
  { id: 'fix_grammar',              label: 'Fix grammar',          icon: '✓',  description: 'Fix errors & punctuation', group: 'edit' },
  { id: 'summarize',               label: 'Summarize',            icon: '⊟',  description: 'Condense to key points',   group: 'edit' },
  { id: 'continue',                label: 'Continue writing',     icon: '→',  description: 'Extend the text',          group: 'edit' },
  { id: 'make_shorter',            label: 'Make shorter',         icon: '↕',  description: 'Be more concise',          group: 'transform' },
  { id: 'expand',                  label: 'Expand',               icon: '⟷',  description: 'Add more detail',          group: 'transform' },
  { id: 'change_tone_professional', label: 'Professional tone',   icon: '💼', description: 'Formal & polished',        group: 'tone' },
  { id: 'change_tone_casual',      label: 'Casual tone',          icon: '💬', description: 'Friendly & relaxed',       group: 'tone' },
]

// ─── Types ────────────────────────────────────────────────────────────────────

type StreamState = 'idle' | 'streaming' | 'done' | 'error'

interface AISelectionMenuProps {
  editor: Editor
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AISelectionMenu({ editor }: AISelectionMenuProps) {
  const [open, setOpen]             = useState(false)
  const [streamState, setStreamState] = useState<StreamState>('idle')
  const [streamedText, setStreamedText] = useState('')
  const [activeAction, setActiveAction] = useState<AIAction | null>(null)
  const [originalText, setOriginalText] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  // ─── Run AI action ──────────────────────────────────────────────────────────
  const runAction = useCallback(async (action: AIAction) => {
    const { from, to } = editor.state.selection
    const selected = editor.state.doc.textBetween(from, to, '\n')
    if (!selected.trim()) return

    const docJson = editor.getJSON()
    const context = getDocumentContext(docJson as Parameters<typeof getDocumentContext>[0], 1500)

    setActiveAction(action)
    setOriginalText(selected)
    setStreamedText('')
    setStreamState('streaming')
    setOpen(false)

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: action.id, selectedText: selected, context }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) throw new Error('API error')

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue
          try {
            const { token } = JSON.parse(data)
            accumulated += token
            setStreamedText(accumulated)
          } catch {
            // skip
          }
        }
      }

      setStreamState('done')
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') return
      setStreamState('error')
    }
  }, [editor])

  // ─── Accept result → replace selected text ──────────────────────────────────
  const handleAccept = useCallback(() => {
    if (!streamedText) return
    const { from, to } = editor.state.selection
    editor.chain().focus().insertContentAt({ from, to }, streamedText).run()
    setStreamState('idle')
    setStreamedText('')
    setActiveAction(null)
  }, [editor, streamedText])

  // ─── Discard result ──────────────────────────────────────────────────────────
  const handleDiscard = useCallback(() => {
    abortRef.current?.abort()
    setStreamState('idle')
    setStreamedText('')
    setActiveAction(null)
  }, [])

  // ─── Toggle menu open ────────────────────────────────────────────────────────
  const handleToggle = useCallback(() => {
    if (streamState !== 'idle') return
    setOpen((p) => !p)
  }, [streamState])

  // ─── Shared button style ────────────────────────────────────────────────────
  const btnBase: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 9px',
    borderRadius: 7,
    background: 'transparent',
    border: '1px solid transparent',
    color: C.muted,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 500,
    fontFamily: 'inherit',
    textAlign: 'left',
    width: '100%',
    transition: 'all 0.08s',
    whiteSpace: 'nowrap',
  }

  // ─── Streaming / result panel ────────────────────────────────────────────────
  if (streamState === 'streaming' || streamState === 'done' || streamState === 'error') {
    return (
      <div
        style={{
          background: C.bgCard,
          border: `1px solid ${C.borderStrong}`,
          borderRadius: 12,
          padding: 12,
          boxShadow: '0 12px 36px rgba(0,0,0,0.65)',
          maxWidth: 380,
          minWidth: 280,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.dim, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {activeAction?.icon} {activeAction?.label}
          </span>
          {streamState === 'streaming' && (
            <span style={{ fontSize: 10, color: C.accent, fontWeight: 600 }}>
              Generating…
            </span>
          )}
          {streamState === 'done' && (
            <span style={{ fontSize: 10, color: C.success, fontWeight: 600 }}>Done</span>
          )}
          {streamState === 'error' && (
            <span style={{ fontSize: 10, color: C.error, fontWeight: 600 }}>Error</span>
          )}
        </div>

        {/* Streamed result */}
        <div
          style={{
            background: 'rgba(226,234,255,0.03)',
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: '8px 10px',
            fontSize: 13,
            color: C.text,
            lineHeight: 1.65,
            maxHeight: 180,
            overflowY: 'auto',
            minHeight: 40,
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
          }}
        >
          {streamState === 'error'
            ? <span style={{ color: C.error }}>Something went wrong. Please try again.</span>
            : streamedText || <span style={{ color: C.dim }}>…</span>
          }
          {streamState === 'streaming' && (
            <span style={{
              display: 'inline-block',
              width: 2,
              height: 13,
              background: C.accent,
              marginLeft: 2,
              verticalAlign: 'middle',
              animation: 'veloBlink 0.8s step-end infinite',
            }} />
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6 }}>
          {streamState === 'done' && (
            <button
              onMouseDown={(e) => { e.preventDefault(); handleAccept() }}
              style={{
                flex: 1,
                padding: '6px 12px',
                borderRadius: 7,
                background: C.accent,
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'inherit',
                transition: 'opacity 0.1s',
              }}
            >
              ✓ Replace
            </button>
          )}
          <button
            onMouseDown={(e) => { e.preventDefault(); handleDiscard() }}
            style={{
              flex: streamState === 'done' ? '0 0 auto' : 1,
              padding: '6px 12px',
              borderRadius: 7,
              background: 'rgba(248,113,113,0.10)',
              border: `1px solid rgba(248,113,113,0.20)`,
              color: 'rgba(248,113,113,0.85)',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            {streamState === 'streaming' ? '✕ Cancel' : 'Discard'}
          </button>
        </div>

        <style>{`
          @keyframes veloBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </div>
    )
  }

  // ─── AI trigger button + dropdown menu ──────────────────────────────────────
  return (
    <div style={{ position: 'relative' }} onMouseDown={(e) => e.preventDefault()}>
      {/* Trigger button */}
      <button
        onMouseDown={(e) => { e.preventDefault(); handleToggle() }}
        title="AI actions"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '4px 9px',
          borderRadius: 7,
          background: open ? C.accentBg : 'transparent',
          border: `1px solid ${open ? C.accentBorder : 'transparent'}`,
          color: open ? C.accentLight : C.muted,
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'inherit',
          transition: 'all 0.08s',
          height: 26,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 13 }}>✦</span>
        <span>AI</span>
        <span style={{ fontSize: 9, opacity: 0.6 }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: C.bgCard,
            border: `1px solid ${C.borderStrong}`,
            borderRadius: 12,
            padding: 6,
            boxShadow: '0 12px 36px rgba(0,0,0,0.65)',
            zIndex: 9999,
            minWidth: 200,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Group: Edit */}
          <div style={{ fontSize: 10, fontWeight: 700, color: C.dim, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '4px 8px 2px' }}>
            Edit
          </div>
          {AI_ACTIONS.filter(a => a.group === 'edit').map((action) => (
            <ActionBtn key={action.id} action={action} onRun={runAction} btnBase={btnBase} />
          ))}

          <div style={{ height: 1, background: C.border, margin: '4px 0' }} />

          {/* Group: Transform */}
          <div style={{ fontSize: 10, fontWeight: 700, color: C.dim, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '2px 8px' }}>
            Transform
          </div>
          {AI_ACTIONS.filter(a => a.group === 'transform').map((action) => (
            <ActionBtn key={action.id} action={action} onRun={runAction} btnBase={btnBase} />
          ))}

          <div style={{ height: 1, background: C.border, margin: '4px 0' }} />

          {/* Group: Tone */}
          <div style={{ fontSize: 10, fontWeight: 700, color: C.dim, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '2px 8px' }}>
            Tone
          </div>
          {AI_ACTIONS.filter(a => a.group === 'tone').map((action) => (
            <ActionBtn key={action.id} action={action} onRun={runAction} btnBase={btnBase} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── ActionBtn sub-component ─────────────────────────────────────────────────

function ActionBtn({
  action,
  onRun,
  btnBase,
}: {
  action: AIAction
  onRun: (a: AIAction) => void
  btnBase: CSSProperties
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onRun(action) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...btnBase,
        background: hovered ? 'rgba(226,234,255,0.06)' : 'transparent',
        color: hovered ? '#E2EAFF' : 'rgba(226,234,255,0.50)',
      }}
      title={action.description}
    >
      <span style={{ fontSize: 13, minWidth: 16, textAlign: 'center' }}>{action.icon}</span>
      <span>{action.label}</span>
    </button>
  )
}