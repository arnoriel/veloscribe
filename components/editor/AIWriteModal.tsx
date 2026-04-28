'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createPageWithContent } from '@/app/actions/pages'
import { parseAIWriteOutput } from '@/lib/ai/markdownToTipTap'
import { Sparkles, X, ChevronDown, Loader2 } from 'lucide-react'

// ─── Theme ────────────────────────────────────────────────────────────────────

const C = {
  bg:           '#06091A',
  bgCard:       '#0B1325',
  bgInput:      '#0D1526',
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
  overlay:      'rgba(6,9,26,0.80)',
}

// ─── Document type options ────────────────────────────────────────────────────

const DOC_TYPES = [
  { id: 'blog_post',           emoji: '✍️',  label: 'Blog Post',           desc: 'Article or thought piece' },
  { id: 'meeting_notes',       emoji: '📋',  label: 'Meeting Notes',       desc: 'Agenda, notes, action items' },
  { id: 'project_plan',        emoji: '🗂️', label: 'Project Plan',        desc: 'Milestones, deliverables, risks' },
  { id: 'research_notes',      emoji: '🔬',  label: 'Research Notes',      desc: 'Findings, analysis, sources' },
  { id: 'product_spec',        emoji: '⚙️', label: 'Product Spec',        desc: 'Requirements, user stories' },
  { id: 'weekly_report',       emoji: '📊',  label: 'Weekly Report',       desc: 'Progress, blockers, next steps' },
  { id: 'creative_story',      emoji: '📖',  label: 'Creative Story',      desc: 'Narrative, scenes, dialogue' },
  { id: 'email_draft',         emoji: '📨',  label: 'Email Draft',         desc: 'Professional email' },
  { id: 'presentation_outline',emoji: '🎯',  label: 'Presentation Outline',desc: 'Slide-by-slide structure' },
  { id: 'study_guide',         emoji: '🎓',  label: 'Study Guide',         desc: 'Key concepts, terms, questions' },
]

const TONES = [
  { id: 'professional', label: '💼 Professional' },
  { id: 'casual',       label: '💬 Casual' },
  { id: 'academic',     label: '🎓 Academic' },
]

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'input' | 'generating' | 'done' | 'error'

interface AIWriteModalProps {
  workspaceId: string
  onClose: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AIWriteModal({ workspaceId, onClose }: AIWriteModalProps) {
  const router = useRouter()

  // ── Form state ──────────────────────────────────────────────────────────────
  const [prompt, setPrompt]         = useState('')
  const [docType, setDocType]       = useState('blog_post')
  const [tone, setTone]             = useState('professional')
  const [showDocTypes, setShowDocTypes] = useState(false)
  const [phase, setPhase]           = useState<Phase>('input')
  const [streamedRaw, setStreamedRaw] = useState('')
  const [errorMsg, setErrorMsg]     = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const abortRef   = useRef<AbortController | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus textarea on mount
  useEffect(() => {
    setTimeout(() => textareaRef.current?.focus(), 80)
  }, [])

  // Auto-scroll preview
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.scrollTop = previewRef.current.scrollHeight
    }
  }, [streamedRaw])

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase !== 'generating' && phase !== 'input') return
      if (e.key === 'Escape') {
        abortRef.current?.abort()
        onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, phase])

  // ── Start generation ────────────────────────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || phase === 'generating') return

    setPhase('generating')
    setStreamedRaw('')
    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), docType, tone }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) throw new Error(`API error ${res.status}`)

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue
          try {
            const { token } = JSON.parse(data)
            accumulated += token
            setStreamedRaw(accumulated)
          } catch { /* skip */ }
        }
      }

      setPhase('done')
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') return
      setPhase('error')
      setErrorMsg('Generation failed. Please try again.')
    }
  }, [prompt, docType, tone, phase])

  // ── Create page from result ─────────────────────────────────────────────────
  const handleCreatePage = useCallback(async () => {
    if (!streamedRaw || isCreating) return
    setIsCreating(true)

    try {
      const parsed = parseAIWriteOutput(streamedRaw)
      const pageId = await createPageWithContent(
        workspaceId,
        parsed.title,
        parsed.emoji,
        parsed.tiptapDoc
      )
      router.push(`/dashboard/${pageId}`)
      onClose()
    } catch {
      setPhase('error')
      setErrorMsg('Failed to create page. Please try again.')
      setIsCreating(false)
    }
  }, [streamedRaw, workspaceId, router, onClose, isCreating])

  // ── Regenerate ──────────────────────────────────────────────────────────────
  const handleRegenerate = () => {
    setPhase('input')
    setStreamedRaw('')
  }

  // ── Derived: preview of streamed content (body only) ───────────────────────
  const previewBody = (() => {
    const sepIdx = streamedRaw.indexOf('\n---\n')
    return sepIdx !== -1 ? streamedRaw.slice(sepIdx + 5) : ''
  })()

  const previewTitle = (() => {
    const m = streamedRaw.match(/^TITLE:\s*(.+)$/m)
    return m ? m[1] : ''
  })()

  const selectedDocType = DOC_TYPES.find(d => d.id === docType) ?? DOC_TYPES[0]

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => { if (phase !== 'generating') onClose() }}
        style={{
          position: 'fixed', inset: 0, background: C.overlay,
          backdropFilter: 'blur(6px)', zIndex: 9000,
          animation: 'fadeIn 0.15s ease',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9001,
          width: '100%', maxWidth: 560,
          background: C.bgCard,
          border: `1px solid ${C.borderStrong}`,
          borderRadius: 18,
          boxShadow: '0 24px 80px rgba(0,0,0,0.70), 0 0 0 1px rgba(77,127,255,0.08)',
          overflow: 'hidden',
          animation: 'slideUp 0.18s ease',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 20px 14px',
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32, height: 32, borderRadius: 9,
                background: 'linear-gradient(135deg, #3b6ef0 0%, #6a9fff 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(77,127,255,0.35)',
              }}
            >
              <Sparkles size={15} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>AI Write</div>
              <div style={{ fontSize: 11, color: C.dim }}>Generate a full page from your prompt</div>
            </div>
          </div>
          <button
            onClick={() => { abortRef.current?.abort(); onClose() }}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: C.dim, display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: 7,
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(226,234,255,0.07)'; (e.currentTarget as HTMLElement).style.color = C.text }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = C.dim }}
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Body: INPUT phase ─────────────────────────────────────────── */}
        {phase === 'input' && (
          <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Prompt */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.dim, letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>
                What do you want to write about?
              </label>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g. The future of remote work and how companies can adapt..."
                rows={3}
                onKeyDown={e => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleGenerate()
                }}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: C.bgInput, border: `1px solid ${C.borderStrong}`,
                  borderRadius: 10, padding: '10px 13px',
                  color: C.text, fontSize: 14, lineHeight: 1.6,
                  fontFamily: 'inherit', outline: 'none', resize: 'none',
                  transition: 'border-color 0.1s',
                }}
                onFocus={e => { (e.target as HTMLElement).style.borderColor = C.accentBorder }}
                onBlur={e => { (e.target as HTMLElement).style.borderColor = C.borderStrong }}
              />
              <div style={{ fontSize: 11, color: C.dim, marginTop: 5, textAlign: 'right' }}>
                ⌘ Enter to generate
              </div>
            </div>

            {/* Doc type + Tone row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {/* Doc type picker */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.dim, letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>
                  Document Type
                </label>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowDocTypes(p => !p)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: 8, padding: '9px 12px',
                      background: C.bgInput, border: `1px solid ${C.borderStrong}`,
                      borderRadius: 9, cursor: 'pointer', color: C.text,
                      fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
                      transition: 'border-color 0.1s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.accentBorder }}
                    onMouseLeave={e => { if (!showDocTypes) (e.currentTarget as HTMLElement).style.borderColor = C.borderStrong }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span>{selectedDocType.emoji}</span>
                      <span>{selectedDocType.label}</span>
                    </span>
                    <ChevronDown size={13} color={C.dim} />
                  </button>
                  {showDocTypes && (
                    <div
                      style={{
                        position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                        background: C.bgCard, border: `1px solid ${C.borderStrong}`,
                        borderRadius: 11, padding: 5, zIndex: 100,
                        boxShadow: '0 12px 40px rgba(0,0,0,0.65)',
                        maxHeight: 260, overflowY: 'auto',
                      }}
                    >
                      {DOC_TYPES.map(dt => (
                        <button
                          key={dt.id}
                          onClick={() => { setDocType(dt.id); setShowDocTypes(false) }}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'flex-start', gap: 8,
                            padding: '7px 9px', borderRadius: 7,
                            background: dt.id === docType ? C.accentBg : 'transparent',
                            border: 'none', cursor: 'pointer', textAlign: 'left',
                            fontFamily: 'inherit', transition: 'background 0.08s',
                          }}
                          onMouseEnter={e => { if (dt.id !== docType) (e.currentTarget as HTMLElement).style.background = 'rgba(226,234,255,0.05)' }}
                          onMouseLeave={e => { if (dt.id !== docType) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                        >
                          <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{dt.emoji}</span>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: dt.id === docType ? C.accentLight : C.text }}>{dt.label}</div>
                            <div style={{ fontSize: 11, color: C.dim }}>{dt.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tone picker */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.dim, letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>
                  Tone
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {TONES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      style={{
                        padding: '8px 12px', borderRadius: 9,
                        background: tone === t.id ? C.accentBg : C.bgInput,
                        border: `1px solid ${tone === t.id ? C.accentBorder : C.borderStrong}`,
                        color: tone === t.id ? C.accentLight : C.muted,
                        cursor: 'pointer', fontSize: 12, fontWeight: 500,
                        fontFamily: 'inherit', textAlign: 'left',
                        transition: 'all 0.1s',
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              style={{
                width: '100%', padding: '11px',
                borderRadius: 10, border: 'none',
                background: prompt.trim()
                  ? 'linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)'
                  : 'rgba(226,234,255,0.06)',
                color: prompt.trim() ? '#fff' : C.dim,
                cursor: prompt.trim() ? 'pointer' : 'not-allowed',
                fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: prompt.trim() ? '0 4px 18px rgba(77,127,255,0.30)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              <Sparkles size={14} />
              Generate with AI
            </button>
          </div>
        )}

        {/* ── Body: GENERATING / DONE phase ─────────────────────────────── */}
        {(phase === 'generating' || phase === 'done') && (
          <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Status bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {phase === 'generating' && (
                  <Loader2 size={13} color={C.accent} style={{ animation: 'spin 1s linear infinite' }} />
                )}
                {phase === 'done' && (
                  <span style={{ fontSize: 13, color: C.success }}>✓</span>
                )}
                <span style={{ fontSize: 12, fontWeight: 600, color: phase === 'done' ? C.success : C.accentLight }}>
                  {phase === 'generating' ? 'Writing your document…' : 'Done! Ready to create page'}
                </span>
              </div>
              {previewTitle && (
                <span style={{ fontSize: 11, color: C.dim, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {previewTitle}
                </span>
              )}
            </div>

            {/* Live preview */}
            <div
              ref={previewRef}
              style={{
                background: 'rgba(226,234,255,0.025)',
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '12px 14px',
                maxHeight: 280,
                overflowY: 'auto',
                fontSize: 12.5,
                lineHeight: 1.72,
                color: C.muted,
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                minHeight: 80,
                wordBreak: 'break-word',
              }}
            >
              {previewBody || (
                <span style={{ color: C.dim }}>
                  {phase === 'generating' ? 'Preparing your document…' : '…'}
                </span>
              )}
              {phase === 'generating' && (
                <span style={{
                  display: 'inline-block', width: 2, height: 13,
                  background: C.accent, marginLeft: 2, verticalAlign: 'middle',
                  animation: 'veloBlink 0.8s step-end infinite',
                }} />
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              {phase === 'done' && (
                <>
                  <button
                    onClick={handleCreatePage}
                    disabled={isCreating}
                    style={{
                      flex: 1, padding: '10px',
                      borderRadius: 9, border: 'none',
                      background: 'linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)',
                      color: '#fff', cursor: isCreating ? 'wait' : 'pointer',
                      fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      boxShadow: '0 4px 18px rgba(77,127,255,0.30)',
                      opacity: isCreating ? 0.7 : 1,
                      transition: 'opacity 0.15s',
                    }}
                  >
                    {isCreating
                      ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Creating page…</>
                      : <> Open in Editor →</>
                    }
                  </button>
                  <button
                    onClick={handleRegenerate}
                    style={{
                      padding: '10px 14px', borderRadius: 9,
                      background: 'transparent',
                      border: `1px solid ${C.borderStrong}`,
                      color: C.muted, cursor: 'pointer',
                      fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.accentBorder; (e.currentTarget as HTMLElement).style.color = C.accentLight }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.borderStrong; (e.currentTarget as HTMLElement).style.color = C.muted }}
                  >
                    ↺ Retry
                  </button>
                </>
              )}
              {phase === 'generating' && (
                <button
                  onClick={() => { abortRef.current?.abort(); setPhase('input'); setStreamedRaw('') }}
                  style={{
                    flex: 1, padding: '10px',
                    borderRadius: 9,
                    background: 'rgba(248,113,113,0.08)',
                    border: `1px solid rgba(248,113,113,0.20)`,
                    color: 'rgba(248,113,113,0.85)',
                    cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    fontFamily: 'inherit',
                  }}
                >
                  ✕ Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Body: ERROR phase ─────────────────────────────────────────── */}
        {phase === 'error' && (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <div style={{ fontSize: 13, color: C.error, textAlign: 'center' }}>{errorMsg}</div>
            <button
              onClick={() => setPhase('input')}
              style={{
                padding: '9px 20px', borderRadius: 9,
                background: C.accentBg, border: `1px solid ${C.accentBorder}`,
                color: C.accentLight, cursor: 'pointer',
                fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* ── Keyframe animations ──────────────────────────────────────────── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 12px)); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes veloBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
