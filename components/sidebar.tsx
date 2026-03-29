'use client'

import { signOut } from '@/app/actions/auth'
import {
  FileText,
  Plus,
  Settings,
  LogOut,
  Search,
  Zap,
  ChevronDown,
  Home,
} from 'lucide-react'
import { useState } from 'react'

const C = {
  bg: '#070B1D',
  bgHover: 'rgba(77,127,255,0.07)',
  bgActive: 'rgba(77,127,255,0.12)',
  accent: '#4D7FFF',
  accentLight: '#7AA3FF',
  accentBorder: 'rgba(77,127,255,0.25)',
  text: '#E2EAFF',
  muted: 'rgba(226,234,255,0.5)',
  dim: 'rgba(226,234,255,0.28)',
  border: 'rgba(226,234,255,0.06)',
  borderStrong: 'rgba(226,234,255,0.10)',
}

function isUrl(value: string) {
  return value.startsWith('http://') || value.startsWith('https://')
}

interface SidebarProps {
  userFullName: string
  userAvatar: string
  workspaceName: string
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '7px 10px',
        borderRadius: 8,
        background: active ? C.bgActive : hovered ? C.bgHover : 'transparent',
        border: active ? `1px solid ${C.accentBorder}` : '1px solid transparent',
        color: active ? C.accentLight : hovered ? C.muted : C.dim,
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        cursor: 'pointer',
        transition: 'all 0.15s',
        textAlign: 'left',
        fontFamily: 'inherit',
      }}
    >
      <span style={{ opacity: active ? 1 : 0.65, display: 'flex', alignItems: 'center' }}>
        {icon}
      </span>
      {label}
    </button>
  )
}

function PageItem({
  label,
  active = false,
  emoji,
}: {
  label: string
  active?: boolean
  emoji?: string
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 10px',
        borderRadius: 7,
        background: active ? C.bgActive : hovered ? C.bgHover : 'transparent',
        border: active ? `1px solid ${C.accentBorder}` : '1px solid transparent',
        color: active ? C.text : hovered ? C.muted : C.dim,
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.15s',
        userSelect: 'none',
      }}
    >
      {emoji ? (
        <span style={{ fontSize: 13, flexShrink: 0, lineHeight: 1 }}>{emoji}</span>
      ) : (
        <FileText size={13} style={{ opacity: 0.55, flexShrink: 0 }} />
      )}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
        {label}
      </span>
    </div>
  )
}

/** Renders a URL-based photo or an emoji/text avatar in the sidebar user chip */
function AvatarChip({ value, size = 26 }: { value: string; size?: number }) {
  const borderRadius = 8

  if (isUrl(value)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={value}
        alt="Profile photo"
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        style={{
          width: size,
          height: size,
          borderRadius,
          objectFit: 'cover',
          flexShrink: 0,
          border: '1px solid rgba(77,127,255,0.24)',
        }}
      />
    )
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius,
        background: 'rgba(77,127,255,0.14)',
        border: '1px solid rgba(77,127,255,0.24)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 15,
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      {value}
    </div>
  )
}

/** Logout confirmation modal */
function LogoutModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void
  onCancel: () => void
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
        background: 'rgba(4,7,20,0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        animation: 'fadeIn 0.15s ease',
      }}
      onClick={onCancel}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 340,
          background: 'linear-gradient(160deg, #0D1330 0%, #0A0F25 100%)',
          border: '1px solid rgba(226,234,255,0.09)',
          borderRadius: 16,
          padding: '28px 28px 24px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(77,127,255,0.08)',
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
          <LogOut size={20} color="#f87171" />
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
          Sign out?
        </div>

        {/* Body */}
        <div
          style={{
            fontSize: 13,
            color: C.muted,
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          You&apos;ll be redirected to the login page. Any unsaved changes will be lost.
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: 9,
              background: 'rgba(226,234,255,0.05)',
              border: '1px solid rgba(226,234,255,0.10)',
              color: C.muted,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'rgba(226,234,255,0.09)'
              el.style.color = C.text
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'rgba(226,234,255,0.05)'
              el.style.color = C.muted
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: 9,
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.24)',
              color: '#f87171',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'rgba(239,68,68,0.20)'
              el.style.borderColor = 'rgba(239,68,68,0.38)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'rgba(239,68,68,0.12)'
              el.style.borderColor = 'rgba(239,68,68,0.24)'
            }}
          >
            <LogOut size={13} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ userFullName, userAvatar, workspaceName }: SidebarProps) {
  const [wsOpen, setWsOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const firstName = userFullName.split(' ')[0] || 'User'

  async function handleConfirmLogout() {
    setShowLogoutModal(false)
    await signOut()
  }

  return (
    <>
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleConfirmLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      <aside
        style={{
          width: 240,
          height: '100%',
          background: C.bg,
          borderRight: `1px solid ${C.border}`,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          userSelect: 'none',
        }}
      >
        {/* ── Workspace header ─────────────────────── */}
        <div style={{ padding: '12px 8px 8px', borderBottom: `1px solid ${C.border}` }}>
          <button
            onClick={() => setWsOpen(!wsOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '7px 10px',
              borderRadius: 9,
              background: 'transparent',
              border: '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = C.bgHover
              el.style.borderColor = 'rgba(77,127,255,0.14)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'transparent'
              el.style.borderColor = 'transparent'
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 7,
                background: 'linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 3px 10px rgba(77,127,255,0.38)',
              }}
            >
              <Zap size={12} color="#fff" />
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.text,
                flex: 1,
                textAlign: 'left',
                letterSpacing: '-0.01em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {workspaceName}
            </span>
            <ChevronDown
              size={13}
              color={C.dim}
              style={{
                transform: wsOpen ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s',
                flexShrink: 0,
              }}
            />
          </button>
        </div>

        {/* ── Nav items ───────────────────────────── */}
        <div style={{ padding: '8px 8px 4px' }}>
          <NavItem icon={<Search size={14} />} label="Search" />
          <NavItem icon={<Home size={14} />} label="Home" active />
          <NavItem icon={<Settings size={14} />} label="Settings" />
        </div>

        <div style={{ height: 1, background: C.border, margin: '2px 12px 4px' }} />

        {/* ── Pages ───────────────────────────────── */}
        <div style={{ flex: 1, padding: '4px 8px', overflow: 'auto', minHeight: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 10px',
              marginBottom: 2,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(226,234,255,0.18)',
              }}
            >
              Pages
            </span>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 18,
                height: 18,
                borderRadius: 5,
                background: 'transparent',
                border: 'none',
                color: C.dim,
                cursor: 'pointer',
                transition: 'all 0.15s',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.background = C.bgHover
                el.style.color = C.accentLight
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.background = 'transparent'
                el.style.color = C.dim
              }}
            >
              <Plus size={12} />
            </button>
          </div>

          <PageItem label="Getting Started" emoji="🚀" active />
          <PageItem label="My Notes" emoji="📝" />
          <PageItem label="Projects" emoji="🗂️" />

          {/* New page hint */}
          <div
            style={{
              margin: '10px 2px 0',
              padding: '8px 10px',
              borderRadius: 8,
              border: `1px dashed rgba(77,127,255,0.15)`,
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement
              el.style.background = 'rgba(77,127,255,0.06)'
              el.style.borderColor = 'rgba(77,127,255,0.28)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement
              el.style.background = 'transparent'
              el.style.borderColor = 'rgba(77,127,255,0.15)'
            }}
          >
            <Plus size={12} color={C.accentLight} style={{ opacity: 0.6 }} />
            <span style={{ fontSize: 12, color: C.dim, fontWeight: 500 }}>New page</span>
          </div>
        </div>

        {/* ── User + Sign out ─────────────────────── */}
        <div style={{ padding: '8px', borderTop: `1px solid ${C.border}` }}>
          {/* User chip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '8px 10px',
              borderRadius: 9,
              marginBottom: 2,
              background: 'rgba(77,127,255,0.05)',
              border: `1px solid rgba(77,127,255,0.10)`,
            }}
          >
            {/* ✅ Avatar: renders <img> if URL, fallback emoji/text div otherwise */}
            <AvatarChip value={userAvatar} size={26} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.text,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.3,
                }}
              >
                {firstName}
              </div>
              <div style={{ fontSize: 10, color: C.dim, marginTop: 1 }}>Free plan</div>
            </div>
          </div>

          {/* Sign out — now opens confirmation modal instead of directly submitting */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '7px 10px',
              borderRadius: 8,
              background: 'transparent',
              border: '1px solid transparent',
              color: C.dim,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
              textAlign: 'left',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'rgba(239,68,68,0.07)'
              el.style.color = '#fc8b8b'
              el.style.borderColor = 'rgba(239,68,68,0.18)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'transparent'
              el.style.color = C.dim
              el.style.borderColor = 'transparent'
            }}
          >
            <LogOut size={13} style={{ opacity: 0.65 }} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}