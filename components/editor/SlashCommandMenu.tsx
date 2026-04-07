'use client'

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import type { Editor, Range } from '@tiptap/core'

// ─── Types ─────────────────────────────────────────────────────────────────

export interface SlashCommandItem {
  title: string
  description: string
  icon: string
  group: 'Basic' | 'Advanced'
  command: (args: { editor: Editor; range: Range }) => void
}

interface SlashCommandMenuProps {
  items: SlashCommandItem[]
  command: (item: SlashCommandItem) => void
}

// ─── Color palette (matches rest of app) ──────────────────────────────────

const C = {
  bg: '#0C1428',
  bgHover: 'rgba(77,127,255,0.10)',
  bgActive: 'rgba(77,127,255,0.18)',
  border: 'rgba(226,234,255,0.08)',
  borderActive: 'rgba(77,127,255,0.35)',
  text: '#E2EAFF',
  muted: 'rgba(226,234,255,0.50)',
  dim: 'rgba(226,234,255,0.28)',
  accent: '#4D7FFF',
  accentLight: '#7AA3FF',
}

// ─── Group label separator ──────────────────────────────────────────────────

function GroupLabel({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: '6px 10px 4px',
        fontSize: 10,
        fontWeight: 700,
        color: C.dim,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
  )
}

function GroupDivider() {
  return (
    <div
      style={{
        height: 1,
        background: C.border,
        margin: '4px 6px',
      }}
    />
  )
}

// ─── Component ─────────────────────────────────────────────────────────────

const SlashCommandMenu = forwardRef<
  { onKeyDown: (args: { event: KeyboardEvent }) => boolean },
  SlashCommandMenuProps
>((props, ref) => {
  const { items, command } = props
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Reset selection when items change
  useEffect(() => {
    setSelectedIndex(0)
  }, [items])

  // Expose keyboard handler to parent renderer
  useImperativeHandle(ref, () => ({
    onKeyDown({ event }: { event: KeyboardEvent }) {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length)
        return true
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((prev) => (prev + 1) % items.length)
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
      <div
        style={{
          width: 260,
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: '8px 6px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(77,127,255,0.08)',
          fontFamily: 'var(--font-sans, system-ui)',
        }}
      >
        <div
          style={{
            padding: '8px 12px',
            fontSize: 13,
            color: C.dim,
            textAlign: 'center',
          }}
        >
          No results
        </div>
      </div>
    )
  }

  // Group items
  const basicItems = items.filter((i) => i.group === 'Basic')
  const advancedItems = items.filter((i) => i.group === 'Advanced')

  // Flat list for index tracking (same order as rendered)
  const flatItems = [...basicItems, ...advancedItems]

  function renderItem(item: SlashCommandItem) {
    const index = flatItems.indexOf(item)
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
          padding: '8px 10px',
          borderRadius: 8,
          background: isActive ? C.bgActive : 'transparent',
          border: isActive
            ? `1px solid ${C.borderActive}`
            : '1px solid transparent',
          cursor: 'pointer',
          transition: 'all 0.1s',
          textAlign: 'left',
          fontFamily: 'inherit',
        }}
      >
        {/* Icon badge */}
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 7,
            background: isActive
              ? 'rgba(77,127,255,0.20)'
              : 'rgba(226,234,255,0.05)',
            border: `1px solid ${
              isActive
                ? 'rgba(77,127,255,0.30)'
                : 'rgba(226,234,255,0.08)'
            }`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 11,
            fontWeight: 800,
            color: isActive ? C.accentLight : C.muted,
            letterSpacing: '-0.02em',
          }}
        >
          {item.icon}
        </div>

        {/* Text */}
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: isActive ? C.text : C.muted,
              lineHeight: 1.3,
              marginBottom: 1,
            }}
          >
            {item.title}
          </div>
          <div
            style={{
              fontSize: 11,
              color: C.dim,
              lineHeight: 1.3,
            }}
          >
            {item.description}
          </div>
        </div>
      </button>
    )
  }

  return (
    <div
      style={{
        width: 260,
        background: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: '6px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(77,127,255,0.08)',
        fontFamily: 'var(--font-sans, system-ui)',
        maxHeight: 340,
        overflowY: 'auto',
      }}
    >
      {/* Basic Blocks group */}
      {basicItems.length > 0 && (
        <>
          <GroupLabel label="Basic Blocks" />
          {basicItems.map(renderItem)}
        </>
      )}

      {/* Divider between groups */}
      {basicItems.length > 0 && advancedItems.length > 0 && (
        <GroupDivider />
      )}

      {/* Advanced Blocks group */}
      {advancedItems.length > 0 && (
        <>
          <GroupLabel label="Advanced Blocks" />
          {advancedItems.map(renderItem)}
        </>
      )}
    </div>
  )
})

SlashCommandMenu.displayName = 'SlashCommandMenu'

export default SlashCommandMenu