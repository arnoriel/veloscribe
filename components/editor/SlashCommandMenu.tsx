'use client'

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import type { Editor, Range } from '@tiptap/core'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SlashCommandItem {
  title: string
  description: string
  icon: string
  group: 'Text' | 'Lists' | 'Blocks' | 'Advanced'
  keywords?: string[]
  shortcut?: string
  command: (args: { editor: Editor; range: Range }) => void
}

interface SlashCommandMenuProps {
  items: SlashCommandItem[]
  command: (item: SlashCommandItem) => void
}

// ─── Palette (matches app) ────────────────────────────────────────────────────

const C = {
  bg:            '#0B1325',
  bgHover:       'rgba(77,127,255,0.10)',
  bgActive:      'rgba(77,127,255,0.16)',
  border:        'rgba(226,234,255,0.08)',
  borderActive:  'rgba(77,127,255,0.32)',
  text:          '#E2EAFF',
  muted:         'rgba(226,234,255,0.52)',
  dim:           'rgba(226,234,255,0.28)',
  accent:        '#4D7FFF',
  accentLight:   '#7AA3FF',
}

const GROUP_ORDER: Array<SlashCommandItem['group']> = ['Text', 'Lists', 'Blocks', 'Advanced']

const GROUP_ICONS: Record<SlashCommandItem['group'], string> = {
  Text:     'Aa',
  Lists:    '≡',
  Blocks:   '⬛',
  Advanced: '⚙',
}

// ─── Component ────────────────────────────────────────────────────────────────
//
// IMPORTANT: `items` here are already filtered by TipTap's Suggestion extension
// (via the `items()` function in SlashCommand.tsx). Do NOT re-filter them here —
// that causes double-filtering bugs where results stop appearing mid-query.

const SlashCommandMenu = forwardRef<
  { onKeyDown: (args: { event: KeyboardEvent }) => boolean },
  SlashCommandMenuProps
>((props, ref) => {
  const { items, command } = props
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Clamp selectedIndex when item list changes (TipTap updates `items` on each keystroke)
  useEffect(() => {
    setSelectedIndex(0)
  }, [items])

  // Expose keyboard handler to TipTap suggestion system
  useImperativeHandle(ref, () => ({
    onKeyDown({ event }: { event: KeyboardEvent }) {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((p) => (p - 1 + items.length) % Math.max(items.length, 1))
        return true
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((p) => (p + 1) % Math.max(items.length, 1))
        return true
      }
      if (event.key === 'Enter') {
        const item = items[selectedIndex]
        if (item) command(item)
        return true
      }
      return false
    },
  }))

  if (!items.length) {
    return (
      <div style={menuWrapStyle}>
        <div
          style={{
            padding: '20px 12px',
            fontSize: 13,
            color: C.dim,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
          No blocks match
        </div>
      </div>
    )
  }

  // Group the items
  const grouped: Partial<Record<SlashCommandItem['group'], SlashCommandItem[]>> = {}
  for (const item of items) {
    if (!grouped[item.group]) grouped[item.group] = []
    grouped[item.group]!.push(item)
  }

  const orderedGroups = GROUP_ORDER.filter((g) => grouped[g]?.length)

  // Flat ordered list for index tracking
  const flatOrdered = orderedGroups.flatMap((g) => grouped[g]!)

  function renderItem(item: SlashCommandItem) {
    const index = flatOrdered.indexOf(item)
    const isActive = index === selectedIndex

    return (
      <button
        key={item.title}
        onClick={() => command(item)}
        onMouseEnter={() => setSelectedIndex(index)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '7px 8px',
          borderRadius: 8,
          background: isActive ? C.bgActive : 'transparent',
          border: isActive ? `1px solid ${C.borderActive}` : '1px solid transparent',
          cursor: 'pointer',
          transition: 'all 0.08s',
          textAlign: 'left',
          fontFamily: 'var(--font-sans, system-ui)',
          outline: 'none',
        }}
      >
        {/* Icon badge */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: isActive ? 'rgba(77,127,255,0.22)' : 'rgba(226,234,255,0.05)',
            border: `1px solid ${isActive ? 'rgba(77,127,255,0.32)' : 'rgba(226,234,255,0.08)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: item.icon.length > 2 ? 15 : 12,
            fontWeight: 800,
            color: isActive ? C.accentLight : C.muted,
            letterSpacing: item.icon.length > 2 ? 0 : '-0.02em',
            lineHeight: 1,
            fontFamily: item.icon.length > 2 ? 'inherit' : 'var(--font-sans, system-ui)',
          }}
        >
          {item.icon}
        </div>

        {/* Labels */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: isActive ? C.text : C.muted,
              lineHeight: 1.3,
              marginBottom: 1,
              letterSpacing: '-0.01em',
            }}
          >
            {item.title}
          </div>
          <div
            style={{
              fontSize: 11,
              color: C.dim,
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item.description}
          </div>
        </div>

        {/* Shortcut badge */}
        {item.shortcut && (
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: C.dim,
              background: 'rgba(226,234,255,0.06)',
              border: '1px solid rgba(226,234,255,0.10)',
              borderRadius: 4,
              padding: '1px 5px',
              fontFamily: 'monospace',
              flexShrink: 0,
              opacity: isActive ? 0.8 : 0.5,
            }}
          >
            {item.shortcut}
          </div>
        )}
      </button>
    )
  }

  return (
    <div style={menuWrapStyle}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div
        style={{
          padding: '6px 8px 4px',
          borderBottom: `1px solid ${C.border}`,
          marginBottom: 4,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: C.dim,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}
        >
          Insert block
        </div>
        {/* Group hint row */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {orderedGroups.map((g) => (
            <span
              key={g}
              style={{
                fontSize: 10,
                color: C.dim,
                background: 'rgba(226,234,255,0.05)',
                border: '1px solid rgba(226,234,255,0.08)',
                borderRadius: 4,
                padding: '1px 5px',
              }}
            >
              {GROUP_ICONS[g]} {g}
            </span>
          ))}
        </div>
      </div>

      {/* ── Grouped items ────────────────────────────────────────────── */}
      <div style={{ padding: '2px 4px', overflowY: 'auto', maxHeight: 330 }}>
        {orderedGroups.map((group, gi) => (
          <div key={group}>
            {/* Group label */}
            <div
              style={{
                padding: gi === 0 ? '4px 6px 3px' : '8px 6px 3px',
                fontSize: 10,
                fontWeight: 700,
                color: C.dim,
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span>{GROUP_ICONS[group]}</span>
              {group}
            </div>
            {grouped[group]!.map(renderItem)}
          </div>
        ))}
      </div>

      {/* ── Footer hint ──────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: `1px solid ${C.border}`,
          padding: '5px 10px',
          display: 'flex',
          gap: 10,
          alignItems: 'center',
        }}
      >
        {[
          { key: '↑↓', label: 'navigate' },
          { key: '↵', label: 'select' },
          { key: 'esc', label: 'dismiss' },
        ].map(({ key, label }) => (
          <span key={key} style={{ fontSize: 10, color: C.dim, display: 'flex', alignItems: 'center', gap: 4 }}>
            <kbd
              style={{
                fontSize: 9,
                fontWeight: 700,
                background: 'rgba(226,234,255,0.07)',
                border: '1px solid rgba(226,234,255,0.10)',
                borderRadius: 3,
                padding: '1px 4px',
                fontFamily: 'monospace',
                color: 'rgba(226,234,255,0.50)',
              }}
            >
              {key}
            </kbd>
            {label}
          </span>
        ))}
      </div>
    </div>
  )
})

SlashCommandMenu.displayName = 'SlashCommandMenu'

export default SlashCommandMenu

// ─── Shared styles ────────────────────────────────────────────────────────────

const menuWrapStyle: React.CSSProperties = {
  width: 280,
  background: C.bg,
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  boxShadow: '0 20px 56px rgba(0,0,0,0.65), 0 0 0 1px rgba(77,127,255,0.07)',
  fontFamily: 'var(--font-sans, system-ui)',
  overflow: 'hidden',
}