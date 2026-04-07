'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useDebouncedCallback } from 'use-debounce'
import { SlashCommand } from './extensions/SlashCommand'
import { updatePageContent } from '@/app/actions/pages'

// ─── Colours (matches app palette) ───────────────────────────────────────────

const C = {
  bg: '#06091A',
  text: '#E2EAFF',
  muted: 'rgba(226,234,255,0.45)',
  dim: 'rgba(226,234,255,0.25)',
  border: 'rgba(226,234,255,0.07)',
  accent: '#4D7FFF',
  accentLight: '#7AA3FF',
  accentBorder: 'rgba(77,127,255,0.25)',
}

// ─── Save status indicator ────────────────────────────────────────────────────

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error'

function SaveIndicator({ status }: { status: SaveStatus }) {
  const labels: Record<SaveStatus, string> = {
    saved: '✓ Saved',
    saving: 'Saving…',
    unsaved: 'Unsaved changes',
    error: '⚠ Save failed',
  }
  const colors: Record<SaveStatus, string> = {
    saved: 'rgba(74,222,128,0.65)',
    saving: C.dim,
    unsaved: 'rgba(250,204,21,0.60)',
    error: 'rgba(248,113,113,0.80)',
  }
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: colors[status],
        letterSpacing: '0.01em',
        transition: 'color 0.3s',
        userSelect: 'none',
      }}
    >
      {labels[status]}
    </span>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface TipTapEditorProps {
  pageId: string
  initialTitle: string
  initialEmoji: string
  // content is TipTap JSON stored as jsonb in Supabase
  initialContent: object | null
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TipTapEditor({
  pageId,
  initialTitle,
  initialEmoji,
  initialContent,
}: TipTapEditorProps) {
  const [title, setTitle] = useState(initialTitle || 'Untitled')
  const [emoji, setEmoji] = useState(initialEmoji || '📄')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const titleRef = useRef<HTMLTextAreaElement>(null)

  // ── Auto-resize title textarea ──────────────────────────────────────────
  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [title])

  // ── Debounced save (1.5 s after last change) ────────────────────────────
  const debouncedSave = useDebouncedCallback(
    async (content: object, currentTitle: string, currentEmoji: string) => {
      setSaveStatus('saving')
      try {
        await updatePageContent(pageId, content, currentTitle, currentEmoji)
        setSaveStatus('saved')
      } catch {
        setSaveStatus('error')
      }
    },
    1500
  )

  // ── TipTap editor setup ─────────────────────────────────────────────────
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false,
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
        },
        heading: { levels: [1, 2, 3] },
        codeBlock: { languageClassPrefix: 'language-' },
        }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') return 'Heading…'
          return "Type '/' for commands, or just start writing…"
        },
        showOnlyWhenEditable: true,
        includeChildren: true,
      }),
      SlashCommand,
    ],
    content: initialContent ?? undefined,
    autofocus: !initialContent,
    editorProps: {
      attributes: {
        class: 'veloscribe-editor',
        spellcheck: 'true',
      },
    },
    onUpdate({ editor }) {
      setSaveStatus('unsaved')
      const json = editor.getJSON()
      debouncedSave(json, title, emoji)
    },
  })

  // ── Trigger save also when title/emoji changes ──────────────────────────
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value
      setTitle(val)
      setSaveStatus('unsaved')
      if (editor) {
        debouncedSave(editor.getJSON(), val, emoji)
      }
    },
    [editor, emoji, debouncedSave]
  )

  const handleEmojiChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setEmoji(val)
      setSaveStatus('unsaved')
      if (editor) {
        debouncedSave(editor.getJSON(), title, val)
      }
    },
    [editor, title, debouncedSave]
  )

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: C.bg,
          borderBottom: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '10px 40px',
          gap: 12,
        }}
      >
        <SaveIndicator status={saveStatus} />
      </div>

      {/* ── Editor area ─────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          maxWidth: 720,
          width: '100%',
          margin: '0 auto',
          padding: '48px 24px 120px',
        }}
      >
        {/* Emoji picker */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            value={emoji}
            onChange={handleEmojiChange}
            maxLength={4}
            aria-label="Page emoji"
            style={{
              fontSize: 48,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              padding: 0,
              lineHeight: 1,
              width: 64,
              color: C.text,
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Title */}
        <textarea
          ref={titleRef}
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
            fontSize: 40,
            fontWeight: 800,
            color: C.text,
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            marginBottom: 32,
            display: 'block',
            overflow: 'hidden',
            padding: 0,
          }}
        />

        {/* TipTap editor */}
        <EditorContent editor={editor} />
      </div>

      {/* ── Global editor styles ─────────────────────────────────────── */}
      <style>{`
        .veloscribe-editor {
          outline: none;
          min-height: 200px;
          color: ${C.text};
          font-size: 16px;
          line-height: 1.75;
          font-family: inherit;
          caret-color: ${C.accent};
        }

        /* Placeholder */
        .veloscribe-editor p.is-editor-empty:first-child::before,
        .veloscribe-editor .is-empty::before {
          content: attr(data-placeholder);
          float: left;
          color: ${C.dim};
          pointer-events: none;
          height: 0;
          font-style: normal;
        }

        /* Headings */
        .veloscribe-editor h1 {
          font-size: 2em;
          font-weight: 800;
          color: ${C.text};
          letter-spacing: -0.03em;
          margin: 1.4em 0 0.4em;
          line-height: 1.2;
          border-bottom: 1px solid ${C.border};
          padding-bottom: 0.3em;
        }
        .veloscribe-editor h2 {
          font-size: 1.45em;
          font-weight: 700;
          color: ${C.text};
          letter-spacing: -0.02em;
          margin: 1.2em 0 0.35em;
          line-height: 1.3;
        }
        .veloscribe-editor h3 {
          font-size: 1.15em;
          font-weight: 700;
          color: ${C.text};
          letter-spacing: -0.01em;
          margin: 1em 0 0.3em;
          line-height: 1.4;
        }

        /* Paragraph */
        .veloscribe-editor p {
          margin: 0 0 0.6em;
          color: ${C.text};
        }
        .veloscribe-editor p:last-child {
          margin-bottom: 0;
        }

        /* Bold / italic / code */
        .veloscribe-editor strong { font-weight: 700; color: ${C.text}; }
        .veloscribe-editor em { font-style: italic; color: ${C.muted}; }
        .veloscribe-editor code {
          background: rgba(77,127,255,0.10);
          border: 1px solid rgba(77,127,255,0.20);
          border-radius: 4px;
          padding: 0.1em 0.4em;
          font-size: 0.88em;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          color: ${C.accentLight};
        }
        .veloscribe-editor s { opacity: 0.5; }

        /* Lists */
        .veloscribe-editor ul {
        list-style-type: disc;
        padding-left: 1.6em;
        margin: 0.4em 0 0.8em;
        }
        .veloscribe-editor ol {
        list-style-type: decimal;
        padding-left: 1.6em;
        margin: 0.4em 0 0.8em;
        }
        .veloscribe-editor li {
        margin: 0.25em 0;
        color: ${C.text};
        }
        .veloscribe-editor li > p {
        margin: 0;
        }
        .veloscribe-editor ul li::marker { color: ${C.accent}; }
        .veloscribe-editor ol li::marker { color: ${C.accent}; font-weight: 700; }

        /* Blockquote */
        .veloscribe-editor blockquote {
          border-left: 3px solid ${C.accent};
          margin: 1em 0;
          padding: 0.5em 0 0.5em 1.2em;
          background: rgba(77,127,255,0.05);
          border-radius: 0 8px 8px 0;
          color: ${C.muted};
          font-style: italic;
        }

        /* Code block */
        .veloscribe-editor pre {
          background: rgba(12,20,40,0.95);
          border: 1px solid rgba(77,127,255,0.15);
          border-radius: 10px;
          padding: 16px 20px;
          overflow-x: auto;
          margin: 1em 0;
        }
        .veloscribe-editor pre code {
          background: none;
          border: none;
          padding: 0;
          font-size: 0.9em;
          color: rgba(226,234,255,0.80);
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
        }

        /* Horizontal rule */
        .veloscribe-editor hr {
          border: none;
          border-top: 1px solid ${C.border};
          margin: 2em 0;
        }

        /* Selection */
        .veloscribe-editor ::selection {
          background: rgba(77,127,255,0.28);
        }
      `}</style>
    </div>
  )
}