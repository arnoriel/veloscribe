'use client'

import { useState, useTransition } from 'react'
import { restorePage, permanentDeletePage, Page } from '@/app/actions/pages'
import { useRouter } from 'next/navigation'
import { Trash2, RotateCcw, FileText, AlertTriangle, X } from 'lucide-react'

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

// ─── Days remaining helper ─────────────────────────────────────────────────

function getDaysRemaining(deletedAt: string | null): number {
  if (!deletedAt) return 30
  const deletedDate = new Date(deletedAt)
  const expiresAt = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000)
  const now = new Date()
  const msRemaining = expiresAt.getTime() - now.getTime()
  return Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)))
}

function DaysLeftBadge({ days }: { days: number }) {
  const isUrgent = days <= 7
  const isWarning = days <= 14 && days > 7

  let bg = 'rgba(77,127,255,0.10)'
  let border = 'rgba(77,127,255,0.22)'
  let color = C.accentLight

  if (isUrgent) {
    bg = 'rgba(239,68,68,0.10)'
    border = 'rgba(239,68,68,0.24)'
    color = '#f87171'
  } else if (isWarning) {
    bg = 'rgba(251,191,36,0.10)'
    border = 'rgba(251,191,36,0.24)'
    color = '#fbbf24'
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        fontWeight: 700,
        color,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 6,
        padding: '2px 8px',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {isUrgent && <AlertTriangle size={10} style={{ flexShrink: 0 }} />}
      {days === 0 ? 'Deleting soon' : `${days}d left`}
    </span>
  )
}

// ─── Permanent Delete Confirmation Modal ──────────────────────────────────

function PermanentDeleteModal({
  title,
  onConfirm,
  onCancel,
  isLoading,
}: {
  title: string
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(4,7,20,0.78)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.15s ease',
      }}
      onClick={isLoading ? undefined : onCancel}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 380,
          background: 'linear-gradient(160deg, #110A0A 0%, #0D0810 100%)',
          border: '1px solid rgba(239,68,68,0.18)',
          borderRadius: 16,
          padding: '28px 28px 24px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(239,68,68,0.08)',
          animation: 'slideUp 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Close */}
        <button
          onClick={onCancel}
          disabled={isLoading}
          style={{
            position: 'absolute' as const,
            top: 14,
            right: 14,
            width: 24,
            height: 24,
            borderRadius: 6,
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: C.dim,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <X size={14} />
        </button>

        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 13,
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
          }}
        >
          <Trash2 size={22} color="#f87171" />
        </div>

        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: C.text,
            marginBottom: 10,
            letterSpacing: '-0.02em',
          }}
        >
          Delete forever?
        </div>

        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 8 }}>
          <span
            style={{
              color: C.text,
              fontWeight: 600,
            }}
          >
            &ldquo;{title || 'Untitled'}&rdquo;
          </span>{' '}
          will be permanently deleted and{' '}
          <span style={{ color: '#f87171', fontWeight: 600 }}>cannot be recovered</span>.
        </div>

        <div
          style={{
            fontSize: 12,
            color: 'rgba(251,191,36,0.7)',
            background: 'rgba(251,191,36,0.06)',
            border: '1px solid rgba(251,191,36,0.14)',
            borderRadius: 8,
            padding: '8px 12px',
            marginBottom: 22,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
          }}
        >
          <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
          This action is irreversible. All content in this page will be lost.
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onCancel}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 9,
              background: 'rgba(226,234,255,0.05)',
              border: '1px solid rgba(226,234,255,0.10)',
              color: C.muted,
              fontSize: 13,
              fontWeight: 600,
              cursor: isLoading ? 'default' : 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            Keep It
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 9,
              background: isLoading ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.18)',
              border: '1px solid rgba(239,68,68,0.32)',
              color: '#f87171',
              fontSize: 13,
              fontWeight: 700,
              cursor: isLoading ? 'default' : 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Trash2 size={13} />
            {isLoading ? 'Deleting…' : 'Delete Forever'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Single trash item ─────────────────────────────────────────────────────

function TrashItem({
  page,
  onRestore,
  onDelete,
}: {
  page: Page
  onRestore: (id: string) => void
  onDelete: (id: string, title: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const days = getDaysRemaining(page.deleted_at)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 18px',
        background: hovered
          ? 'rgba(226,234,255,0.03)'
          : C.bgCard,
        border: `1px solid ${hovered ? C.borderStrong : C.border}`,
        borderRadius: 12,
        transition: 'all 0.18s',
      }}
    >
      {/* Emoji */}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: 'rgba(226,234,255,0.04)',
          border: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
          opacity: 0.7,
        }}
      >
        {page.emoji || '📄'}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: hovered ? C.text : C.muted,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: 'color 0.15s',
            marginBottom: 3,
          }}
        >
          {page.title || 'Untitled'}
        </div>
        <div style={{ fontSize: 11, color: C.dim }}>
          Deleted{' '}
          {page.deleted_at
            ? new Date(page.deleted_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : '—'}
        </div>
      </div>

      {/* Days left badge */}
      <DaysLeftBadge days={days} />

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button
          onClick={() => onRestore(page.id)}
          title="Restore page"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 12px',
            borderRadius: 8,
            background: 'rgba(77,127,255,0.09)',
            border: '1px solid rgba(77,127,255,0.20)',
            color: C.accentLight,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'rgba(77,127,255,0.18)'
            el.style.borderColor = C.accentBorder
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'rgba(77,127,255,0.09)'
            el.style.borderColor = 'rgba(77,127,255,0.20)'
          }}
        >
          <RotateCcw size={12} />
          Restore
        </button>

        <button
          onClick={() => onDelete(page.id, page.title)}
          title="Delete forever"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 12px',
            borderRadius: 8,
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.16)',
            color: '#f87171',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'rgba(239,68,68,0.15)'
            el.style.borderColor = 'rgba(239,68,68,0.30)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'rgba(239,68,68,0.07)'
            el.style.borderColor = 'rgba(239,68,68,0.16)'
          }}
        >
          <Trash2 size={12} />
          Delete
        </button>
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────

function EmptyTrash() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '72px 24px',
        textAlign: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          background: 'rgba(226,234,255,0.04)',
          border: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        }}
      >
        <Trash2 size={26} color={C.dim} />
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: C.muted,
          letterSpacing: '-0.02em',
        }}
      >
        Trash is empty
      </div>
      <div style={{ fontSize: 13, color: C.dim, maxWidth: 280, lineHeight: 1.65 }}>
        Pages you delete will appear here. They&apos;ll be permanently removed after 30 days.
      </div>
    </div>
  )
}

// ─── Main client component ────────────────────────────────────────────────

interface TrashClientProps {
  pages: Page[]
}

export default function TrashClient({ pages: initialPages }: TrashClientProps) {
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>(initialPages)
  const [, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // ── Restore ────────────────────────────────────────────────────

  function handleRestore(id: string) {
    startTransition(async () => {
      setIsProcessing(true)
      try {
        await restorePage(id)
        setPages((prev) => prev.filter((p) => p.id !== id))
        router.refresh()
      } catch (err) {
        console.error('[handleRestore]', err)
      } finally {
        setIsProcessing(false)
      }
    })
  }

  // ── Permanent delete ───────────────────────────────────────────

  function handleDeleteClick(id: string, title: string) {
    setConfirmDelete({ id, title })
  }

  async function handleConfirmPermanentDelete() {
    if (!confirmDelete) return
    setIsProcessing(true)
    try {
      await permanentDeletePage(confirmDelete.id)
      setPages((prev) => prev.filter((p) => p.id !== confirmDelete.id))
      router.refresh()
    } catch (err) {
      console.error('[handleConfirmPermanentDelete]', err)
    } finally {
      setIsProcessing(false)
      setConfirmDelete(null)
    }
  }

  return (
    <>
      {confirmDelete && (
        <PermanentDeleteModal
          title={confirmDelete.title}
          isLoading={isProcessing}
          onConfirm={handleConfirmPermanentDelete}
          onCancel={() => !isProcessing && setConfirmDelete(null)}
        />
      )}

      <div
        style={{
          minHeight: '100%',
          padding: '36px 40px 48px',
          background: C.bg,
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: 'fixed',
            top: '10%',
            right: '15%',
            width: 400,
            height: 300,
            background: 'radial-gradient(ellipse, rgba(239,68,68,0.04) 0%, transparent 65%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720 }}>
          {/* ── Header ─────────────────────────────────────────── */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  background: 'rgba(239,68,68,0.10)',
                  border: '1px solid rgba(239,68,68,0.20)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Trash2 size={18} color="#f87171" />
              </div>
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: C.text,
                  letterSpacing: '-0.03em',
                  margin: 0,
                }}
              >
                Trash
              </h1>
              {pages.length > 0 && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.dim,
                    background: 'rgba(226,234,255,0.06)',
                    border: `1px solid ${C.border}`,
                    borderRadius: 20,
                    padding: '2px 9px',
                  }}
                >
                  {pages.length} {pages.length === 1 ? 'page' : 'pages'}
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: C.dim, margin: 0, lineHeight: 1.65, maxWidth: 520 }}>
              Pages in trash will be{' '}
              <span style={{ color: '#fbbf24' }}>permanently deleted after 30 days</span>.
              You can restore them or remove them now.
            </p>
          </div>

          {/* ── Notice banner (if any pages exist) ─────────────── */}
          {pages.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 16px',
                background: 'rgba(251,191,36,0.05)',
                border: '1px solid rgba(251,191,36,0.14)',
                borderRadius: 10,
                marginBottom: 22,
              }}
            >
              <AlertTriangle size={14} color="#fbbf24" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: 'rgba(251,191,36,0.75)', margin: 0, lineHeight: 1.6 }}>
                Deleted pages are auto-cleaned by the system after 30 days. Restore important pages
                before they expire. Pages with{' '}
                <span style={{ color: '#f87171', fontWeight: 600 }}>red badges</span> expire within
                7 days.
              </p>
            </div>
          )}

          {/* ── Trash items or empty state ──────────────────────── */}
          {pages.length === 0 ? (
            <EmptyTrash />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pages.map((page) => (
                <TrashItem
                  key={page.id}
                  page={page}
                  onRestore={handleRestore}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}

          {/* ── Divider + file icon legend ──────────────────────── */}
          {pages.length > 0 && (
            <div
              style={{
                marginTop: 32,
                paddingTop: 20,
                borderTop: `1px solid ${C.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: C.accentLight,
                    opacity: 0.7,
                  }}
                />
                <span style={{ fontSize: 11, color: C.dim }}>Safe (&gt;14 days)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: '#fbbf24',
                    opacity: 0.7,
                  }}
                />
                <span style={{ fontSize: 11, color: C.dim }}>Warning (7–14 days)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: '#f87171',
                    opacity: 0.7,
                  }}
                />
                <span style={{ fontSize: 11, color: C.dim }}>Critical (&lt;7 days)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}