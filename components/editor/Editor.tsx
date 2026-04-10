'use client'

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  type CSSProperties,
} from 'react'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import CharacterCount from '@tiptap/extension-character-count'
import { useDebouncedCallback } from 'use-debounce'
import { SlashCommand } from './extensions/SlashCommand'
import { CalloutBlock } from './extensions/CallOutBlock'
import { Columns, Column } from './extensions/ColumnBlock'
import { updatePageContent } from '@/app/actions/pages'
import { usePagesStore } from '@/store/pagesStore'

// ─── Drag handle button style (hoisted to top so it's available in JSX) ──────

const handleBtnStyle: CSSProperties = {
  width: 22,
  height: 22,
  borderRadius: 5,
  background: 'rgba(226,234,255,0.06)',
  border: '1px solid rgba(226,234,255,0.10)',
  color: 'rgba(226,234,255,0.28)',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 700,
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  fontFamily: 'inherit',
  transition: 'background 0.1s, color 0.1s',
}

// ─── Colours ──────────────────────────────────────────────────────────────────

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
}

// ─── Text colours for colour picker ──────────────────────────────────────────

const TEXT_COLORS = [
  { label: 'Default',  value: '',        dot: C.text },
  { label: 'Blue',     value: '#7AA3FF', dot: '#7AA3FF' },
  { label: 'Purple',   value: '#A78BFA', dot: '#A78BFA' },
  { label: 'Green',    value: '#4ADE80', dot: '#4ADE80' },
  { label: 'Yellow',   value: '#FACC15', dot: '#FACC15' },
  { label: 'Orange',   value: '#FB923C', dot: '#FB923C' },
  { label: 'Red',      value: '#F87171', dot: '#F87171' },
  { label: 'Gray',     value: '#94A3B8', dot: '#94A3B8' },
]

const HIGHLIGHT_COLORS = [
  { label: 'None',     value: '',                          dot: 'transparent', border: C.borderStrong },
  { label: 'Blue',     value: 'rgba(77,127,255,0.25)',     dot: 'rgba(77,127,255,0.55)' },
  { label: 'Purple',   value: 'rgba(167,139,250,0.25)',    dot: 'rgba(167,139,250,0.60)' },
  { label: 'Green',    value: 'rgba(74,222,128,0.22)',     dot: 'rgba(74,222,128,0.55)' },
  { label: 'Yellow',   value: 'rgba(250,204,21,0.25)',     dot: 'rgba(250,204,21,0.65)' },
  { label: 'Red',      value: 'rgba(248,113,113,0.22)',    dot: 'rgba(248,113,113,0.55)' },
]

// ─── Save status ──────────────────────────────────────────────────────────────

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error'

function SaveIndicator({ status }: { status: SaveStatus }) {
  const map: Record<SaveStatus, { label: string; color: string }> = {
    saved:   { label: '✓ Saved',               color: 'rgba(74,222,128,0.70)' },
    saving:  { label: 'Saving…',               color: C.dim },
    unsaved: { label: 'Unsaved changes',        color: 'rgba(250,204,21,0.65)' },
    error:   { label: '⚠ Save failed',          color: 'rgba(248,113,113,0.85)' },
  }
  const { label, color } = map[status]
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color, letterSpacing: '0.01em', transition: 'color 0.3s', userSelect: 'none' }}>
      {label}
    </span>
  )
}

// ─── Generic bubble-menu button ───────────────────────────────────────────────

function BB({
  onClick,
  active,
  title,
  style,
  children,
}: {
  onClick: () => void
  active?: boolean
  title?: string
  style?: CSSProperties
  children: React.ReactNode
}) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      title={title}
      style={{
        padding: '4px 7px',
        borderRadius: 6,
        background: active ? C.accentBg : 'transparent',
        border: `1px solid ${active ? C.accentBorder : 'transparent'}`,
        color: active ? C.accentLight : C.muted,
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 700,
        lineHeight: 1,
        transition: 'all 0.08s',
        fontFamily: 'inherit',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 26,
        height: 26,
        flexShrink: 0,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          ;(e.currentTarget as HTMLElement).style.background = 'rgba(226,234,255,0.07)'
          ;(e.currentTarget as HTMLElement).style.color = C.text
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          ;(e.currentTarget as HTMLElement).style.background = 'transparent'
          ;(e.currentTarget as HTMLElement).style.color = C.muted
        }
      }}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div style={{ width: 1, height: 16, background: 'rgba(226,234,255,0.10)', margin: '0 1px', flexShrink: 0 }} />
}

// ─── Colour picker flyout ─────────────────────────────────────────────────────

function ColorFlyout({
  open,
  colors,
  activeColor,
  onSelect,
  onClose,
  label,
  flyoutRef,
}: {
  open: boolean
  colors: { label: string; value: string; dot: string; border?: string }[]
  activeColor: string
  onSelect: (v: string) => void
  onClose: () => void
  label: string
  flyoutRef?: React.RefObject<HTMLDivElement | null>
}) {
  if (!open) return null
  return (
    <div
      ref={flyoutRef}
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: '50%',
        transform: 'translateX(-50%)',
        background: C.bgCard,
        border: `1px solid ${C.borderStrong}`,
        borderRadius: 10,
        padding: 10,
        boxShadow: '0 12px 32px rgba(0,0,0,0.65)',
        zIndex: 1000,
        minWidth: 140,
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div style={{ fontSize: 10, fontWeight: 700, color: C.dim, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 7 }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {colors.map((c) => (
          <button
            key={c.value || 'none'}
            title={c.label}
            onMouseDown={(e) => { e.preventDefault(); onSelect(c.value); onClose() }}
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              background: c.value || 'transparent',
              border: `2px solid ${activeColor === c.value ? C.accent : (c.border ?? 'rgba(226,234,255,0.12)')}`,
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'border 0.1s',
            }}
          >
            {!c.value && <span style={{ color: C.muted, fontSize: 12, lineHeight: 1 }}>✕</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Block options menu (drag handle) ────────────────────────────────────────

function BlockOptionsMenu({
  open,
  onDelete,
  onDuplicate,
  onClose,
  menuRef,
  onMenuEnter,
  onMenuLeave,
}: {
  open: boolean
  onDelete: () => void
  onDuplicate: () => void
  onClose: () => void
  menuRef?: import('react').RefObject<HTMLDivElement | null>
  onMenuEnter?: () => void
  onMenuLeave?: () => void
}) {
  if (!open) return null
  const ITEMS = [
    { icon: '⎘', label: 'Duplicate',   action: onDuplicate },
    { icon: '🗑', label: 'Delete block', action: onDelete, danger: true },
  ]
  return (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        zIndex: 300,
        paddingTop: 4,
      }}
      onMouseEnter={onMenuEnter}
      onMouseLeave={onMenuLeave}
      onMouseDown={(e) => e.preventDefault()}
    >
    <div
      style={{
        background: C.bgCard,
        border: `1px solid ${C.borderStrong}`,
        borderRadius: 10,
        padding: 5,
        boxShadow: '0 12px 32px rgba(0,0,0,0.65)',
        minWidth: 160,
      }}
    >
      {ITEMS.map((item) => (
        <button
          key={item.label}
          onMouseDown={(e) => { e.preventDefault(); item.action(); onClose() }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 10px',
            borderRadius: 7,
            background: 'transparent',
            border: '1px solid transparent',
            color: item.danger ? 'rgba(248,113,113,0.85)' : C.muted,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            textAlign: 'left',
            fontFamily: 'inherit',
            transition: 'background 0.08s, color 0.08s',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.background = item.danger
              ? 'rgba(248,113,113,0.10)'
              : 'rgba(226,234,255,0.06)'
            ;(e.currentTarget as HTMLElement).style.color = item.danger
              ? '#F87171'
              : C.text
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLElement).style.color = item.danger
              ? 'rgba(248,113,113,0.85)'
              : C.muted
          }}
        >
          <span style={{ fontSize: 14 }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface TipTapEditorProps {
  pageId: string
  initialTitle: string
  initialEmoji: string
  initialContent: object | null
}

// ─── Main editor component ────────────────────────────────────────────────────

export default function TipTapEditor({
  pageId,
  initialTitle,
  initialEmoji,
  initialContent,
}: TipTapEditorProps) {
  // ── Core state ──────────────────────────────────────────────────────────
  const [title, setTitle]           = useState(initialTitle || 'Untitled')
  const [emoji, setEmoji]           = useState(initialEmoji || '📄')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const [fullWidth, setFullWidth]   = useState(false)

  // ── Bubble-menu sub-state ────────────────────────────────────────────────
  const [linkMode, setLinkMode]           = useState(false)
  const [linkUrl, setLinkUrl]             = useState('')
  const [showTextColor, setShowTextColor] = useState(false)
  const [showHighlight, setShowHighlight] = useState(false)

  // ── Drag handle state ────────────────────────────────────────────────────
  const [handle, setHandle] = useState({ y: 0, visible: false, el: null as HTMLElement | null })
  const [blockMenu, setBlockMenu] = useState(false)
  const setBlockMenuSynced = useCallback((val: boolean | ((p: boolean) => boolean)) => {
    setBlockMenu((prev) => {
      const next = typeof val === 'function' ? val(prev) : val
      blockMenuOpenRef.current = next
      return next
    })
  }, [])

  // ── Refs ────────────────────────────────────────────────────────────────
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null)
  const titleRef         = useRef(title)
  const emojiRef         = useRef(emoji)
  const editorWrapRef    = useRef<HTMLDivElement>(null)
  const handleDivRef     = useRef<HTMLDivElement>(null)
  const blockMenuRef     = useRef<HTMLDivElement>(null)
  const linkInputRef     = useRef<HTMLInputElement>(null)
  const hideTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const blockMenuOpenRef = useRef(false)
  const textColorFlyoutRef  = useRef<HTMLDivElement>(null)
  const highlightFlyoutRef  = useRef<HTMLDivElement>(null)

  useEffect(() => { titleRef.current = title }, [title])
  useEffect(() => { emojiRef.current = emoji }, [emoji])

  // ── Store ────────────────────────────────────────────────────────────────
  const updatePageMeta = usePagesStore((s) => s.updatePageMeta)
  const setSavingPageId = usePagesStore((s) => s.setSavingPageId)

  // ── Title auto-resize ────────────────────────────────────────────────────
  useEffect(() => {
    const el = titleTextareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [title])

  // ── Browser tab title ────────────────────────────────────────────────────
  useEffect(() => {
    document.title = `${emoji} ${title} — Veloscribe`
  }, [title, emoji])

  // ── Beforeunload guard ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'unsaved' || saveStatus === 'saving') {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [saveStatus])

  // ── Close color flyouts on outside click ─────────────────────────────────
  useEffect(() => {
    if (!showTextColor && !showHighlight) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        showTextColor &&
        textColorFlyoutRef.current &&
        !textColorFlyoutRef.current.contains(target)
      ) {
        setShowTextColor(false)
      }
      if (
        showHighlight &&
        highlightFlyoutRef.current &&
        !highlightFlyoutRef.current.contains(target)
      ) {
        setShowHighlight(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showTextColor, showHighlight])

  // ── Close block menu on outside click ────────────────────────────────────
  useEffect(() => {
    if (!blockMenu) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        blockMenuRef.current &&
        !blockMenuRef.current.contains(target) &&
        handleDivRef.current &&
        !handleDivRef.current.contains(target)
      ) {
        setBlockMenuSynced(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [blockMenu, setBlockMenuSynced])

  // ── Debounced save ───────────────────────────────────────────────────────
  const debouncedSave = useDebouncedCallback(
    async (content: object, currentTitle: string, currentEmoji: string) => {
      setSaveStatus('saving')
      setSavingPageId(pageId)
      try {
        await updatePageContent(pageId, content, currentTitle, currentEmoji)
        setSaveStatus('saved')
        updatePageMeta(pageId, currentTitle, currentEmoji)
        setSavingPageId(null)
      } catch {
        setSaveStatus('error')
        setTimeout(async () => {
          try {
            await updatePageContent(pageId, content, currentTitle, currentEmoji)
            setSaveStatus('saved')
            updatePageMeta(pageId, currentTitle, currentEmoji)
          } catch {
            setSaveStatus('error')
          } finally {
            setSavingPageId(null)
          }
        }, 2000)
      }
    },
    1500,
  )

  // ── TipTap editor ────────────────────────────────────────────────────────
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList:  { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        heading:     { levels: [1, 2, 3] },
        codeBlock:   { languageClassPrefix: 'language-' },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') return 'Heading…'
          return "Press '/' for commands…"
        },
        showOnlyWhenEditable: true,
        // includeChildren: false (default) — do NOT show placeholder inside child nodes
        // like table cells, task list items, callout inner paragraphs, etc.
        // This prevents the double/misplaced placeholder UI bug.
        includeChildren: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'editor-link', rel: 'noopener noreferrer', target: '_blank' },
      }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList.configure({ HTMLAttributes: { class: 'task-list' } }),
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      CharacterCount,
      CalloutBlock,
      Columns,
      Column,
      SlashCommand,
    ],
    content: initialContent ?? undefined,
    autofocus: !initialContent,
    editorProps: {
      attributes: { class: 'veloscribe-editor', spellcheck: 'true' },
    },
    onUpdate({ editor }) {
      setSaveStatus('unsaved')
      debouncedSave(editor.getJSON(), titleRef.current, emojiRef.current)
    },
  })

  // ── Ctrl+S flush ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        debouncedSave.flush()
      }
      // Ctrl+K = link
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (editor?.state.selection.empty) return
        const existing = editor?.getAttributes('link').href ?? ''
        setLinkUrl(existing)
        setLinkMode(true)
        setTimeout(() => linkInputRef.current?.focus(), 50)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [debouncedSave, editor])

  // ── Drag handle tracking ─────────────────────────────────────────────────
  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      // Don't hide if blockMenu is open
      if (blockMenuOpenRef.current) return
      setHandle((p) => ({ ...p, visible: false, el: null }))
    }, 120)
  }, [])

  const cancelHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
  }, [])

  useEffect(() => {
    const wrap = editorWrapRef.current
    if (!wrap) return

    const onMove = (e: MouseEvent) => {
      // If block menu is open, freeze handle position — don't move it while user aims at menu items
      if (blockMenuOpenRef.current) return
      const proseMirror = wrap.querySelector('.ProseMirror') as HTMLElement
      if (!proseMirror) return
      const kids = Array.from(proseMirror.children) as HTMLElement[]
      const wr = wrap.getBoundingClientRect()
      for (const child of kids) {
        const r = child.getBoundingClientRect()
        if (e.clientY >= r.top - 2 && e.clientY <= r.bottom + 2) {
          cancelHide()
          setHandle({ y: r.top - wr.top + r.height / 2 - 12, visible: true, el: child })
          return
        }
      }
      scheduleHide()
    }
    const onLeave = () => scheduleHide()

    wrap.addEventListener('mousemove', onMove)
    wrap.addEventListener('mouseleave', onLeave)
    return () => {
      wrap.removeEventListener('mousemove', onMove)
      wrap.removeEventListener('mouseleave', onLeave)
    }
  }, [scheduleHide, cancelHide])

  // ── Block delete / duplicate helpers ─────────────────────────────────────
  const getBlockPos = useCallback((): { from: number; to: number } | null => {
    if (!editor || !handle.el) return null
    try {
      const pos = editor.view.posAtDOM(handle.el, 0)
      const node = editor.state.doc.nodeAt(pos)
      if (!node) return null
      return { from: pos, to: pos + node.nodeSize }
    } catch {
      return null
    }
  }, [editor, handle.el])

  const handleDeleteBlock = useCallback(() => {
    const range = getBlockPos()
    if (range) editor?.chain().focus().deleteRange(range).run()
  }, [editor, getBlockPos])

  const handleDuplicateBlock = useCallback(() => {
    const range = getBlockPos()
    if (!range || !editor) return
    const node = editor.state.doc.nodeAt(range.from)
    if (node) {
      editor.chain().focus().insertContentAt(range.to, node.toJSON()).run()
    }
  }, [editor, getBlockPos])

  // ── Add block below via "+" handle ───────────────────────────────────────
  const handleAddBlockBelow = useCallback(() => {
    if (!editor) return
    const range = getBlockPos()
    const insertAt = range ? range.to : editor.state.doc.content.size
    editor.chain().focus().insertContentAt(insertAt, { type: 'paragraph' }).run()
  }, [editor, getBlockPos])

  // ── Link apply ───────────────────────────────────────────────────────────
  const applyLink = useCallback(() => {
    if (!editor) return
    const url = linkUrl.trim()
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url.startsWith('http') ? url : `https://${url}` })
        .run()
    }
    setLinkMode(false)
    setLinkUrl('')
  }, [editor, linkUrl])

  // ── Stats ────────────────────────────────────────────────────────────────
  const wordCount = editor?.storage.characterCount.words() ?? 0
  const charCount = editor?.storage.characterCount.characters() ?? 0

  // ── Title / emoji handlers ───────────────────────────────────────────────
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value
      setTitle(val)
      setSaveStatus('unsaved')
      if (editor) debouncedSave(editor.getJSON(), val, emojiRef.current)
    },
    [editor, debouncedSave],
  )

  const handleEmojiChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setEmoji(val)
      setSaveStatus('unsaved')
      if (editor) debouncedSave(editor.getJSON(), titleRef.current, val)
    },
    [editor, debouncedSave],
  )

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans)' }}>

      {/* ── Top bar ───────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: C.bg,
          borderBottom: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 24px',
        }}
      >
        {/* Left side: table toolbar (context-aware) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {editor && editor.isActive('table') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {[
                { label: '+ Col', action: () => editor.chain().focus().addColumnAfter().run() },
                { label: '– Col', action: () => editor.chain().focus().deleteColumn().run() },
                { label: '+ Row', action: () => editor.chain().focus().addRowAfter().run() },
                { label: '– Row', action: () => editor.chain().focus().deleteRow().run() },
                { label: '🗑 Table', action: () => editor.chain().focus().deleteTable().run(), danger: true },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={a.action}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: 5,
                    background: 'transparent',
                    border: `1px solid ${(a as { danger?: boolean }).danger ? 'rgba(248,113,113,0.25)' : C.border}`,
                    color: (a as { danger?: boolean }).danger ? 'rgba(248,113,113,0.80)' : C.muted,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right side: stats + controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 11, color: C.dim, userSelect: 'none' }}>
            {wordCount}w · {charCount}c
          </span>
          <span style={{ fontSize: 10, color: C.dim, opacity: 0.55, userSelect: 'none' }}>⌘S</span>
          {/* Full-width toggle */}
          <button
            title={fullWidth ? 'Compact width' : 'Full width'}
            onClick={() => setFullWidth((p) => !p)}
            style={{
              fontSize: 12,
              color: fullWidth ? C.accentLight : C.dim,
              background: fullWidth ? C.accentBg : 'transparent',
              border: `1px solid ${fullWidth ? C.accentBorder : 'transparent'}`,
              borderRadius: 5,
              padding: '3px 7px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 600,
              transition: 'all 0.1s',
            }}
          >
            {fullWidth ? '⟵ Compact' : '⟷ Wide'}
          </button>
          <SaveIndicator status={saveStatus} />
        </div>
      </div>

      {/* ── Bubble menu ─────────────────────────────────────────────── */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100, placement: 'top', zIndex: 50 }}
          shouldShow={({ editor, state }) => {
            return !state.selection.empty && !editor.isActive('image')
          }}
        >
          <div
            style={{
              background: C.bgCard,
              border: `1px solid ${C.borderStrong}`,
              borderRadius: 10,
              padding: '4px 5px',
              boxShadow: '0 10px 36px rgba(0,0,0,0.60), 0 0 0 1px rgba(77,127,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            {/* ── Link input mode ────────────────────────────────────── */}
            {linkMode ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 2px' }}>
                <input
                  ref={linkInputRef}
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://…"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') applyLink()
                    if (e.key === 'Escape') { setLinkMode(false); setLinkUrl('') }
                  }}
                  style={{
                    background: 'rgba(226,234,255,0.06)',
                    border: `1px solid ${C.borderStrong}`,
                    borderRadius: 6,
                    padding: '4px 10px',
                    color: C.text,
                    fontSize: 13,
                    outline: 'none',
                    width: 220,
                    fontFamily: 'inherit',
                  }}
                />
                <BB onClick={applyLink} title="Apply link" active>✓</BB>
                <BB onClick={() => { setLinkMode(false); setLinkUrl(''); editor.chain().focus().unsetLink().run() }} title="Remove link">✕</BB>
              </div>
            ) : (
              /* ── Main toolbar row ─────────────────────────────────── */
              <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Format */}
                <BB onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (⌘B)">
                  <strong>B</strong>
                </BB>
                <BB onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (⌘I)">
                  <em>I</em>
                </BB>
                <BB onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (⌘U)">
                  <span style={{ textDecoration: 'underline' }}>U</span>
                </BB>
                <BB onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
                  <s>S</s>
                </BB>
                <BB onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">
                  {'`'}
                </BB>

                <Divider />

                {/* Link */}
                <BB
                  onClick={() => {
                    const existing = editor.getAttributes('link').href ?? ''
                    setLinkUrl(existing)
                    setLinkMode(true)
                    setTimeout(() => linkInputRef.current?.focus(), 50)
                  }}
                  active={editor.isActive('link')}
                  title="Link (⌘K)"
                >
                  🔗
                </BB>

                <Divider />

                {/* Text colour */}
                <div style={{ position: 'relative' }}>
                  <BB
                    onClick={() => { setShowTextColor((p) => !p); setShowHighlight(false) }}
                    active={showTextColor}
                    title="Text color"
                  >
                    <span style={{ fontSize: 11, fontWeight: 800 }}>A</span>
                    <span style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', width: 12, height: 2, borderRadius: 1, background: editor.getAttributes('textStyle').color || C.text }} />
                  </BB>
                  <ColorFlyout
                    open={showTextColor}
                    colors={TEXT_COLORS}
                    activeColor={editor.getAttributes('textStyle').color ?? ''}
                    onSelect={(v) => {
                      if (!v) editor.chain().focus().unsetColor().run()
                      else editor.chain().focus().setColor(v).run()
                    }}
                    onClose={() => setShowTextColor(false)}
                    label="Text color"
                    flyoutRef={textColorFlyoutRef}
                  />
                </div>

                {/* Highlight */}
                <div style={{ position: 'relative' }}>
                  <BB
                    onClick={() => { setShowHighlight((p) => !p); setShowTextColor(false) }}
                    active={showHighlight}
                    title="Highlight"
                  >
                    <span style={{ fontSize: 13 }}>🖊</span>
                  </BB>
                  <ColorFlyout
                    open={showHighlight}
                    colors={HIGHLIGHT_COLORS}
                    activeColor={editor.getAttributes('highlight').color ?? ''}
                    onSelect={(v) => {
                      if (!v) editor.chain().focus().unsetHighlight().run()
                      else editor.chain().focus().setHighlight({ color: v }).run()
                    }}
                    onClose={() => setShowHighlight(false)}
                    label="Highlight"
                    flyoutRef={highlightFlyoutRef}
                  />
                </div>

                <Divider />

                {/* Align */}
                <BB onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">≡L</BB>
                <BB onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center">≡C</BB>
                <BB onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">≡R</BB>

                <Divider />

                {/* Turn into */}
                <BB onClick={() => editor.chain().focus().setNode('heading', { level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">H1</BB>
                <BB onClick={() => editor.chain().focus().setNode('heading', { level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">H2</BB>
                <BB onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph') && !editor.isActive('heading')} title="Paragraph">¶</BB>

                <Divider />

                {/* Blocks */}
                <BB onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">•≡</BB>
                <BB onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">1.</BB>
                <BB onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} title="Todo list">☑</BB>
                <BB onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote">❝</BB>
              </div>
            )}
          </div>
        </BubbleMenu>
      )}

      {/* ── Editor scroll area ─────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div
          style={{
            maxWidth: fullWidth ? '100%' : 720,
            width: '100%',
            margin: '0 auto',
            // Increase left padding in compact mode to give room for drag handle
            padding: fullWidth ? '48px 48px 140px' : '48px 24px 140px 64px',
            transition: 'max-width 0.25s ease, padding 0.25s ease',
          }}
        >
          {/* ── Page emoji ────────────────────────────────────────── */}
          <div style={{ marginBottom: 10 }}>
            <input
              type="text"
              value={emoji}
              onChange={handleEmojiChange}
              maxLength={4}
              aria-label="Page emoji"
              title="Click to change emoji"
              style={{
                fontSize: 52,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                padding: '4px 6px',
                lineHeight: 1,
                width: 72,
                color: C.text,
                fontFamily: 'inherit',
                borderRadius: 8,
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(226,234,255,0.06)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            />
          </div>

          {/* ── Page title ────────────────────────────────────────── */}
          <textarea
            ref={titleTextareaRef}
            value={title}
            onChange={handleTitleChange}
            rows={1}
            placeholder="Untitled"
            aria-label="Page title"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit',
              fontSize: 42,
              fontWeight: 800,
              color: C.text,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: 36,
              display: 'block',
              overflow: 'hidden',
              padding: 0,
            }}
          />

          {/* ── Editor + drag handle ───────────────────────────────── */}
          <div
            style={{ position: 'relative' }}
            ref={editorWrapRef}
          >
            {/* Drag handle (left of hovered block) */}
            {handle.visible && (
              <div
                ref={handleDivRef}
                style={{
                  position: 'absolute',
                  left: -48,
                  top: handle.y,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  opacity: handle.visible ? 1 : 0,
                  transition: 'opacity 0.12s',
                  zIndex: 10,
                }}
                onMouseEnter={cancelHide}
                onMouseLeave={scheduleHide}
              >
                {/* Add block */}
                <button
                  title="Add block below"
                  onClick={handleAddBlockBelow}
                  style={handleBtnStyle}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(77,127,255,0.15)'; (e.currentTarget as HTMLElement).style.color = C.accentLight }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(226,234,255,0.06)'; (e.currentTarget as HTMLElement).style.color = C.dim }}
                >
                  +
                </button>

                {/* Block options */}
                <div style={{ position: 'relative' }}>
                  <button
                    title="Block options"
                    onClick={() => setBlockMenuSynced((p) => !p)}
                    style={{
                      ...handleBtnStyle,
                      fontSize: 14,
                      letterSpacing: 0,
                      background: blockMenu ? 'rgba(77,127,255,0.15)' : 'rgba(226,234,255,0.06)',
                      color: blockMenu ? C.accentLight : C.dim,
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(77,127,255,0.15)'; (e.currentTarget as HTMLElement).style.color = C.accentLight }}
                    onMouseLeave={(e) => {
                      if (!blockMenu) {
                        ;(e.currentTarget as HTMLElement).style.background = 'rgba(226,234,255,0.06)'
                        ;(e.currentTarget as HTMLElement).style.color = C.dim
                      }
                    }}
                  >
                    ⠿
                  </button>
                  <BlockOptionsMenu
                    open={blockMenu}
                    onDelete={handleDeleteBlock}
                    onDuplicate={handleDuplicateBlock}
                    onClose={() => setBlockMenuSynced(false)}
                    menuRef={blockMenuRef}
                    onMenuEnter={cancelHide}
                    onMenuLeave={scheduleHide}
                  />
                </div>
              </div>
            )}

            {/* Actual TipTap content */}
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* ── Global CSS ──────────────────────────────────────────────────── */}
      <style>{`
        /* ─ Editor base ─────────────────────────────────────────── */
        .veloscribe-editor {
          outline: none;
          min-height: 300px;
          color: ${C.text};
          font-size: 16px;
          line-height: 1.78;
          font-family: inherit;
          caret-color: ${C.accent};
        }

        /* ─ Placeholder ─────────────────────────────────────────── */
        /* Only show placeholder on the first empty paragraph (editor is fully empty)
           OR on any focused empty paragraph — never on table cells, task items, callouts, etc.
           The .is-empty::before selector is intentionally scoped to direct children of
           ProseMirror so it does not leak into nested block nodes. */
        .veloscribe-editor.ProseMirror > p.is-empty::before,
        .veloscribe-editor > p.is-empty::before,
        .ProseMirror > p.is-empty::before {
          content: attr(data-placeholder);
          float: left;
          color: ${C.dim};
          pointer-events: none;
          height: 0;
        }
        /* Heading placeholder — only when heading itself is empty and focused */
        .veloscribe-editor h1.is-empty::before,
        .veloscribe-editor h2.is-empty::before,
        .veloscribe-editor h3.is-empty::before {
          content: attr(data-placeholder);
          float: left;
          color: ${C.dim};
          pointer-events: none;
          height: 0;
        }

        /* ─ Headings ────────────────────────────────────────────── */
        .veloscribe-editor h1 {
          font-size: 2em;
          font-weight: 800;
          color: ${C.text};
          letter-spacing: -0.03em;
          margin: 1.5em 0 0.4em;
          line-height: 1.2;
          border-bottom: 1px solid ${C.border};
          padding-bottom: 0.3em;
        }
        .veloscribe-editor h2 {
          font-size: 1.45em;
          font-weight: 700;
          color: ${C.text};
          letter-spacing: -0.02em;
          margin: 1.3em 0 0.35em;
          line-height: 1.3;
        }
        .veloscribe-editor h3 {
          font-size: 1.15em;
          font-weight: 700;
          color: ${C.text};
          letter-spacing: -0.01em;
          margin: 1.1em 0 0.3em;
          line-height: 1.4;
        }
        .veloscribe-editor h1:first-child,
        .veloscribe-editor h2:first-child,
        .veloscribe-editor h3:first-child {
          margin-top: 0;
        }

        /* ─ Paragraph ───────────────────────────────────────────── */
        .veloscribe-editor p {
          margin: 0 0 0.55em;
          color: ${C.text};
        }
        .veloscribe-editor p:last-child { margin-bottom: 0; }

        /* ─ Inline marks ────────────────────────────────────────── */
        .veloscribe-editor strong { font-weight: 700; color: ${C.text}; }
        .veloscribe-editor em     { font-style: italic; color: ${C.muted}; }
        .veloscribe-editor u      { text-decoration: underline; text-underline-offset: 2px; }
        .veloscribe-editor s      { opacity: 0.45; }

        .veloscribe-editor code {
          background: rgba(77,127,255,0.10);
          border: 1px solid rgba(77,127,255,0.20);
          border-radius: 4px;
          padding: 0.1em 0.42em;
          font-size: 0.87em;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          color: ${C.accentLight};
        }

        /* ─ Link ────────────────────────────────────────────────── */
        .veloscribe-editor a.editor-link {
          color: ${C.accentLight};
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: rgba(122,163,255,0.40);
          cursor: pointer;
          transition: text-decoration-color 0.12s;
        }
        .veloscribe-editor a.editor-link:hover {
          text-decoration-color: ${C.accentLight};
        }

        /* ─ Lists ───────────────────────────────────────────────── */
        .veloscribe-editor ul,
        .veloscribe-editor ol {
          padding-left: 1.6em;
          margin: 0.3em 0 0.7em;
        }
        .veloscribe-editor li {
          margin: 0.22em 0;
          color: ${C.text};
        }
        .veloscribe-editor li > p { margin: 0; }
        .veloscribe-editor ul li::marker { color: ${C.accent}; }
        .veloscribe-editor ol li::marker { color: ${C.accent}; font-weight: 700; }

        /* ─ Task list ───────────────────────────────────────────── */
        .veloscribe-editor ul[data-type="taskList"],
        .veloscribe-editor .task-list {
          padding: 0;
          list-style: none;
          margin: 0.3em 0 0.7em;
        }
        .veloscribe-editor ul[data-type="taskList"] li,
        .veloscribe-editor .task-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin: 0.28em 0;
        }
        .veloscribe-editor ul[data-type="taskList"] li > label,
        .veloscribe-editor .task-list li > label {
          flex-shrink: 0;
          margin-top: 3px;
          cursor: pointer;
        }
        .veloscribe-editor ul[data-type="taskList"] li input[type="checkbox"],
        .veloscribe-editor .task-list li input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border: 1.5px solid rgba(226,234,255,0.28);
          border-radius: 4px;
          background: transparent;
          cursor: pointer;
          position: relative;
          transition: all 0.12s;
          flex-shrink: 0;
        }
        .veloscribe-editor ul[data-type="taskList"] li input[type="checkbox"]:checked,
        .veloscribe-editor .task-list li input[type="checkbox"]:checked {
          background: ${C.accent};
          border-color: ${C.accent};
        }
        .veloscribe-editor ul[data-type="taskList"] li input[type="checkbox"]:checked::after,
        .veloscribe-editor .task-list li input[type="checkbox"]:checked::after {
          content: '✓';
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 800;
          color: white;
        }
        .veloscribe-editor ul[data-type="taskList"] li[data-checked="true"] > div,
        .veloscribe-editor .task-list li[data-checked="true"] > div {
          opacity: 0.50;
          text-decoration: line-through;
        }

        /* ─ Blockquote ──────────────────────────────────────────── */
        .veloscribe-editor blockquote {
          border-left: 3px solid ${C.accent};
          margin: 1em 0;
          padding: 0.4em 0 0.4em 1.2em;
          background: rgba(77,127,255,0.05);
          border-radius: 0 8px 8px 0;
          color: ${C.muted};
          font-style: italic;
        }

        /* ─ Code block ──────────────────────────────────────────── */
        .veloscribe-editor pre {
          background: rgba(9,14,30,0.97);
          border: 1px solid rgba(77,127,255,0.14);
          border-radius: 10px;
          padding: 16px 20px;
          overflow-x: auto;
          margin: 1em 0;
          position: relative;
        }
        .veloscribe-editor pre code {
          background: none;
          border: none;
          padding: 0;
          font-size: 0.875em;
          color: rgba(226,234,255,0.82);
          font-family: 'JetBrains Mono','Fira Code',monospace;
        }

        /* ─ HR ──────────────────────────────────────────────────── */
        .veloscribe-editor hr {
          border: none;
          border-top: 1px solid ${C.border};
          margin: 2em 0;
        }

        /* ─ Table ───────────────────────────────────────────────── */
        .veloscribe-editor table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid ${C.borderStrong};
        }
        .veloscribe-editor th,
        .veloscribe-editor td {
          border: 1px solid ${C.border};
          padding: 8px 12px;
          text-align: left;
          vertical-align: top;
          min-width: 80px;
          color: ${C.text};
          font-size: 14px;
        }
        .veloscribe-editor th {
          background: rgba(77,127,255,0.08);
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.01em;
          color: ${C.muted};
          border-bottom: 1px solid ${C.borderStrong};
        }
        .veloscribe-editor td:focus,
        .veloscribe-editor th:focus {
          outline: 2px solid rgba(77,127,255,0.40);
          outline-offset: -2px;
        }
        .veloscribe-editor .selectedCell::after {
          position: absolute;
          inset: 0;
          background: rgba(77,127,255,0.12);
          pointer-events: none;
          z-index: 2;
          content: '';
        }
        .veloscribe-editor .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: 0;
          width: 4px;
          background: rgba(77,127,255,0.40);
          cursor: col-resize;
          pointer-events: all;
        }
        .veloscribe-editor .tableWrapper {
          overflow-x: auto;
          padding-bottom: 2px;
        }

        /* ─ Text alignment ─────────────────────────────────────── */
        .veloscribe-editor [style*="text-align: center"] { text-align: center; }
        .veloscribe-editor [style*="text-align: right"]  { text-align: right; }
        .veloscribe-editor [style*="text-align: justify"] { text-align: justify; }

        /* ─ Highlight marks ────────────────────────────────────── */
        .veloscribe-editor mark {
          border-radius: 3px;
          padding: 0.05em 0.2em;
        }

        /* ─ Selection ──────────────────────────────────────────── */
        .veloscribe-editor ::selection {
          background: rgba(77,127,255,0.28);
        }
        
        /* ─ Scrollbar ──────────────────────────────────────────── */
        .veloscribe-editor::-webkit-scrollbar { display: none; }

        /* ─ Column layout ──────────────────────────────────────── */
        /* The columns wrapper renders as a CSS grid.              */
        /* data-cols attribute controls number of tracks.           */
        .veloscribe-editor div[data-type="columns"] {
          display: grid;
          gap: 12px;
          margin: 0.75em 0;
          align-items: start;
        }
        .veloscribe-editor div[data-type="columns"][data-cols="2"] {
          grid-template-columns: 1fr 1fr;
        }
        .veloscribe-editor div[data-type="columns"][data-cols="3"] {
          grid-template-columns: 1fr 1fr 1fr;
        }

        /* Individual column cell */
        .veloscribe-editor div[data-type="column"] {
          border: 1px solid rgba(226,234,255,0.08);
          border-radius: 8px;
          padding: 12px 14px;
          min-height: 48px;
          transition: border-color 0.15s;
          position: relative;
        }
        .veloscribe-editor div[data-type="column"]:focus-within {
          border-color: rgba(77,127,255,0.32);
          background: rgba(77,127,255,0.03);
        }
        /* Remove bottom margin from last child so column height is tight */
        .veloscribe-editor div[data-type="column"] > *:last-child {
          margin-bottom: 0;
        }
        /* Responsive: stack columns on narrow viewports */
        @media (max-width: 640px) {
          .veloscribe-editor div[data-type="columns"][data-cols="2"],
          .veloscribe-editor div[data-type="columns"][data-cols="3"] {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}