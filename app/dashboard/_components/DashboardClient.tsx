'use client'

import {
  FileText,
  Plus,
  Zap,
  ArrowRight,
  BookOpen,
  Clock,
  Star,
  Sparkles,
} from 'lucide-react'

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

/* ── Sub-components ─────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: C.dim,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
}) {
  return (
    <div
      style={{
        background: C.bgCard,
        border: `1px solid ${C.borderStrong}`,
        borderRadius: 14,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: C.dim,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: C.accentGlow,
            border: `1px solid ${C.accentBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: C.accentLight,
          }}
        >
          {icon}
        </div>
      </div>
      <div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: C.text,
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: 12, color: C.dim, marginTop: 5 }}>{sub}</div>
        )}
      </div>
    </div>
  )
}

function QuickActionCard({
  icon,
  label,
  desc,
  accent,
}: {
  icon: React.ReactNode
  label: string
  desc: string
  accent?: boolean
}) {
  return (
    <div
      style={{
        background: accent
          ? 'linear-gradient(135deg, rgba(59,110,240,0.16) 0%, rgba(93,138,255,0.08) 100%)'
          : C.bgCard,
        border: `1px solid ${accent ? C.accentBorder : C.borderStrong}`,
        borderRadius: 13,
        padding: '16px 18px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-2px)'
        el.style.boxShadow = `0 10px 28px rgba(0,0,0,0.22), 0 0 0 1px ${
          accent ? 'rgba(77,127,255,0.4)' : 'rgba(226,234,255,0.08)'
        }`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      {accent && (
        <div
          style={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 90,
            height: 90,
            background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      )}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          flexShrink: 0,
          background: accent
            ? 'linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)'
            : 'rgba(77,127,255,0.09)',
          border: `1px solid ${accent ? '#5d8aff' : C.accentBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accent ? '#fff' : C.accentLight,
          boxShadow: accent ? '0 4px 12px rgba(77,127,255,0.38)' : 'none',
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: C.text,
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.4 }}>
          {desc}
        </div>
      </div>
      <ArrowRight
        size={14}
        color={C.dim}
        style={{ flexShrink: 0, opacity: 0.6 }}
      />
    </div>
  )
}

function EmptyRecentDocs() {
  return (
    <div
      style={{
        background: C.bgCard,
        border: `1px dashed rgba(77,127,255,0.16)`,
        borderRadius: 13,
        padding: '44px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 13,
          background: C.accentGlow,
          border: `1px solid ${C.accentBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 4,
        }}
      >
        <FileText size={20} color={C.accentLight} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
        No pages yet
      </div>
      <div style={{ fontSize: 13, color: C.dim, maxWidth: 240, lineHeight: 1.6 }}>
        Create your first page and start writing with the help of AI.
      </div>
      <button
        style={{
          marginTop: 6,
          padding: '9px 18px',
          borderRadius: 9,
          border: 'none',
          background: 'linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)',
          color: '#fff',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 4px 14px rgba(77,127,255,0.35)',
          fontFamily: 'inherit',
          transition: 'box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
            '0 6px 20px rgba(77,127,255,0.52)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
            '0 4px 14px rgba(77,127,255,0.35)'
        }}
      >
        <Plus size={13} /> New Page
      </button>
    </div>
  )
}

/* ── Main export ────────────────────────────────────────────── */

interface DashboardClientProps {
  firstName: string
  avatar: string
  workspaceName: string
  greeting: string
}

export default function DashboardClient({
  firstName,
  avatar,
  workspaceName,
  greeting,
}: DashboardClientProps) {
  return (
    <div
      style={{
        minHeight: '100%',
        padding: '36px 40px 48px',
        background: C.bg,
        fontFamily: 'var(--font-sans)',
        position: 'relative',
      }}
    >
      {/* Ambient glows */}
      <div
        style={{
          position: 'fixed',
          top: '8%',
          right: '10%',
          width: 480,
          height: 380,
          background:
            'radial-gradient(ellipse, rgba(77,127,255,0.05) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '15%',
          left: '30%',
          width: 300,
          height: 300,
          background:
            'radial-gradient(ellipse, rgba(77,127,255,0.035) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Welcome header ───────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              background: 'rgba(77,127,255,0.12)',
              border: `1px solid ${C.accentBorder}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              flexShrink: 0,
              boxShadow: '0 4px 18px rgba(77,127,255,0.14)',
            }}
          >
            {avatar}
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: C.dim,
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              {workspaceName}
            </div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: C.text,
                letterSpacing: '-0.03em',
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              {greeting},{' '}
              <span
                style={{
                  background:
                    'linear-gradient(120deg, #4d7fff 0%, #a5c0ff 50%, #4d7fff 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {firstName}
              </span>{' '}
              👋
            </h1>
          </div>
        </div>

        <p
          style={{
            fontSize: 13,
            color: C.muted,
            lineHeight: 1.65,
            maxWidth: 480,
            margin: '0 0 32px 0',
            paddingLeft: 66,
          }}
        >
          Your AI-powered writing workspace is ready — create your first page
          and let the words flow.
        </p>

        {/* ── Stats row ────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 14,
            marginBottom: 32,
          }}
        >
          <StatCard
            icon={<FileText size={13} />}
            label="Pages"
            value="0"
            sub="Create your first page"
          />
          <StatCard
            icon={<Zap size={13} />}
            label="Words Written"
            value="0"
            sub="Start writing to track"
          />
          <StatCard
            icon={<Star size={13} />}
            label="AI Assists"
            value="0"
            sub="Use AI to write faster"
          />
        </div>

        {/* ── Quick actions ─────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <SectionLabel>Quick Actions</SectionLabel>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
            }}
          >
            <QuickActionCard
              icon={<Plus size={15} />}
              label="New Page"
              desc="Start writing a blank page"
              accent
            />
            <QuickActionCard
              icon={<Sparkles size={15} />}
              label="AI Write"
              desc="Generate a page from a prompt"
            />
            <QuickActionCard
              icon={<BookOpen size={15} />}
              label="Templates"
              desc="Start from a pre-built template"
            />
            <QuickActionCard
              icon={<Clock size={15} />}
              label="Import"
              desc="Import from Notion or Markdown"
            />
          </div>
        </div>

        {/* ── Recent pages ──────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <SectionLabel>Recent Pages</SectionLabel>
            <button
              style={{
                fontSize: 12,
                color: C.accentLight,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: 0,
                opacity: 0.8,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.8' }}
            >
              View all <ArrowRight size={11} />
            </button>
          </div>
          <EmptyRecentDocs />
        </div>

        {/* ── Tip strip ─────────────────────────────────── */}
        <div
          style={{
            padding: '14px 18px',
            background: 'rgba(77,127,255,0.05)',
            border: `1px solid rgba(77,127,255,0.16)`,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              flexShrink: 0,
              background: 'linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(77,127,255,0.35)',
            }}
          >
            <Zap size={14} color="#fff" />
          </div>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.text,
                marginBottom: 2,
              }}
            >
              Tip: Try the AI assistant
            </div>
            <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.5 }}>
              Select any text in a page and press{' '}
              <span
                style={{
                  background: 'rgba(77,127,255,0.14)',
                  border: '1px solid rgba(77,127,255,0.28)',
                  borderRadius: 4,
                  padding: '1px 6px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.accentLight,
                }}
              >
                ⌘ K
              </span>{' '}
              to open the AI command menu.
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}