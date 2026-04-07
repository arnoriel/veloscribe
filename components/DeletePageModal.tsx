'use client'

import { Trash2 } from 'lucide-react'

const C = {
  text: '#E2EAFF',
  muted: 'rgba(226,234,255,0.5)',
}

interface DeletePageModalProps {
  title: string
  onConfirm: () => void | Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export default function DeletePageModal({
  title,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeletePageModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(4,7,20,0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
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
          width: 360,
          background: 'linear-gradient(160deg, #0D1330 0%, #0A0F25 100%)',
          border: '1px solid rgba(226,234,255,0.09)',
          borderRadius: 16,
          padding: '28px 28px 24px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(239,68,68,0.06)',
          animation: 'slideUp 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(239,68,68,0.10)',
            border: '1px solid rgba(239,68,68,0.20)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Trash2 size={20} color="#f87171" />
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: C.text,
            marginBottom: 8,
            letterSpacing: '-0.01em',
          }}
        >
          Move to Trash?
        </div>

        {/* Description */}
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>
          <span
            style={{
              color: C.text,
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              maxWidth: 220,
              verticalAlign: 'bottom',
            }}
          >
            &ldquo;{title || 'Untitled'}&rdquo;
          </span>{' '}
          will be moved to trash. You can restore it within{' '}
          <span style={{ color: '#fbbf24', fontWeight: 600 }}>30 days</span>{' '}
          before it&apos;s permanently deleted.
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onCancel}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '9px 0',
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
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: 9,
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.24)',
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
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            <Trash2 size={13} />
            {isLoading ? 'Moving…' : 'Move to Trash'}
          </button>
        </div>
      </div>
    </div>
  )
}