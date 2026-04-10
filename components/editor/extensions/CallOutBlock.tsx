'use client'
import { Node as TiptapNode, mergeAttributes } from '@tiptap/core'
import type { NodeViewProps } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import React, { useState, useRef, useEffect } from 'react'

// ─── Callout color palette ────────────────────────────────────────────────────

export const CALLOUT_COLORS: Record<
  string,
  { bg: string; border: string; dot: string; label: string }
> = {
  blue:   { bg: 'rgba(77,127,255,0.07)',   border: 'rgba(77,127,255,0.22)',   dot: '#4D7FFF', label: 'Blue'   },
  yellow: { bg: 'rgba(250,204,21,0.07)',   border: 'rgba(250,204,21,0.28)',   dot: '#FACC15', label: 'Yellow' },
  red:    { bg: 'rgba(248,113,113,0.07)',  border: 'rgba(248,113,113,0.28)',  dot: '#F87171', label: 'Red'    },
  green:  { bg: 'rgba(74,222,128,0.07)',   border: 'rgba(74,222,128,0.25)',   dot: '#4ADE80', label: 'Green'  },
  purple: { bg: 'rgba(167,139,250,0.07)',  border: 'rgba(167,139,250,0.28)',  dot: '#A78BFA', label: 'Purple' },
  orange: { bg: 'rgba(251,146,60,0.07)',   border: 'rgba(251,146,60,0.28)',   dot: '#FB923C', label: 'Orange' },
  gray:   { bg: 'rgba(226,234,255,0.04)',  border: 'rgba(226,234,255,0.12)',  dot: '#94A3B8', label: 'Gray'   },
}

const COMMON_EMOJIS = ['💡', '📌', '⚠️', '✅', '❌', '🔥', '💬', '📝', '🎯', '🚀', '⭐', '🔑']

// ─── Node view (rendered in React) ───────────────────────────────────────────

function CalloutNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)

  // Cast attrs locally so TypeScript knows the shape
  const attrs = node.attrs as { emoji: string; color: string }
  const palette = CALLOUT_COLORS[attrs.color] ?? CALLOUT_COLORS.blue

  // Close popup on outside click (replaces the fragile onBlur approach)
  useEffect(() => {
    if (!menuOpen) return
    const handleOutsideClick = (e: MouseEvent) => {
        const target = e.target as globalThis.Node
        if (
            menuRef.current && !menuRef.current.contains(target) &&
            triggerRef.current && !triggerRef.current.contains(target)
        ) {
            setMenuOpen(false)
        }
    }
    // Use capture phase so we catch clicks before they bubble
    document.addEventListener('mousedown', handleOutsideClick, true)
    return () => document.removeEventListener('mousedown', handleOutsideClick, true)
  }, [menuOpen])

  return (
    <NodeViewWrapper>
      <div
        data-type="callout"
        style={{
          display: 'flex',
          gap: 12,
          background: palette.bg,
          borderRadius: 10,
          padding: '12px 16px',
          border: `1px solid ${palette.border}`,
          margin: '6px 0',
          position: 'relative',
          outline: selected ? '2px solid rgba(77,127,255,0.35)' : 'none',
          outlineOffset: 2,
          transition: 'outline 0.1s',
        }}
      >
        {/* ── Emoji + picker trigger ───────────────────────────────── */}
        <div contentEditable={false} style={{ flexShrink: 0, position: 'relative' }}>
          <span
            ref={triggerRef}
            role="button"
            title="Change icon & color"
            onClick={() => setMenuOpen((p) => !p)}
            style={{
              fontSize: 22,
              lineHeight: 1.35,
              cursor: 'pointer',
              userSelect: 'none',
              display: 'inline-block',
              borderRadius: 6,
              padding: '1px 3px',
              transition: 'background 0.12s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(226,234,255,0.10)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            {attrs.emoji}
          </span>

          {/* ── Emoji/color popup ───────────────────────────────────── */}
          {menuOpen && (
            <div
              ref={menuRef}
              style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                zIndex: 200,
                background: '#0C1428',
                border: '1px solid rgba(226,234,255,0.10)',
                borderRadius: 12,
                padding: 14,
                boxShadow: '0 16px 40px rgba(0,0,0,0.65)',
                width: 240,
              }}
              // Prevent mousedown from bubbling so outside-click handler ignores this element
              onMouseDown={(e) => e.stopPropagation()}
            >
              {/* Quick emoji grid */}
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(226,234,255,0.38)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                Quick icons
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                {COMMON_EMOJIS.map((em) => (
                  <button
                    key={em}
                    title={em}
                    onMouseDown={(e) => {
                      // Use onMouseDown to prevent focus loss before onClick fires
                      e.preventDefault()
                      updateAttributes({ emoji: em })
                      setMenuOpen(false)
                    }}
                    style={{
                      fontSize: 18,
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: attrs.emoji === em ? 'rgba(77,127,255,0.18)' : 'rgba(226,234,255,0.05)',
                      border: attrs.emoji === em ? '1px solid rgba(77,127,255,0.35)' : '1px solid transparent',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => {
                      if (attrs.emoji !== em) {
                        ;(e.currentTarget as HTMLElement).style.background = 'rgba(226,234,255,0.10)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (attrs.emoji !== em) {
                        ;(e.currentTarget as HTMLElement).style.background = 'rgba(226,234,255,0.05)'
                      }
                    }}
                  >
                    {em}
                  </button>
                ))}
              </div>

              {/* Custom emoji input */}
              <input
                type="text"
                defaultValue={attrs.emoji}
                maxLength={4}
                placeholder="Or type any emoji…"
                style={{
                  width: '100%',
                  background: 'rgba(226,234,255,0.06)',
                  border: '1px solid rgba(226,234,255,0.12)',
                  borderRadius: 7,
                  padding: '6px 10px',
                  color: '#E2EAFF',
                  fontSize: 14,
                  outline: 'none',
                  marginBottom: 12,
                  boxSizing: 'border-box',
                }}
                onChange={(e) => { if (e.target.value) updateAttributes({ emoji: e.target.value }) }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') {
                    setMenuOpen(false)
                    e.preventDefault()
                  }
                }}
              />

              {/* Color swatches */}
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(226,234,255,0.38)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                Background
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {Object.entries(CALLOUT_COLORS).map(([key, val]) => (
                  <button
                    key={key}
                    title={val.label}
                    onMouseDown={(e) => {
                      // Use onMouseDown so click registers before popup might close
                      e.preventDefault()
                      updateAttributes({ color: key })
                      setMenuOpen(false)
                    }}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: val.bg,
                      border: `2px solid ${attrs.color === key ? val.dot : 'rgba(226,234,255,0.12)'}`,
                      cursor: 'pointer',
                      padding: 0,
                      position: 'relative',
                      transition: 'border 0.1s',
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 4,
                      background: val.dot,
                      opacity: 0.6,
                    }} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Editable content ─────────────────────────────────────── */}
        <NodeViewContent
          style={{
            flex: 1,
            minWidth: 0,
            color: 'rgba(226,234,255,0.88)',
            fontSize: '0.95em',
            lineHeight: 1.75,
          }}
        />
      </div>
    </NodeViewWrapper>
  )
}

// ─── TipTap Node definition ───────────────────────────────────────────────────

export const CalloutBlock = TiptapNode.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      emoji: { default: '💡' },
      color: { default: 'blue' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'callout',
        'data-emoji': node.attrs.emoji,
        'data-color': node.attrs.color,
      }),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutNodeView)
  },
})