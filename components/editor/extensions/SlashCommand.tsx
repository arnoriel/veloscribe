import { Extension } from '@tiptap/core'
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import type { Editor, Range } from '@tiptap/core'
import SlashCommandMenu, { SlashCommandItem } from '../SlashCommandMenu'

// ─── All slash-command definitions ───────────────────────────────────────────

export const SLASH_ITEMS: SlashCommandItem[] = [
  // ── Text ──────────────────────────────────────────────────────────────────
  {
    title: 'Text',
    description: 'Plain paragraph text',
    icon: '¶',
    group: 'Text',
    keywords: ['paragraph', 'plain', 'body', 'p'],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setParagraph().run(),
  },
  {
    title: 'Heading 1',
    description: 'Big section title',
    icon: 'H1',
    group: 'Text',
    shortcut: '#',
    keywords: ['h1', 'title', 'big', 'heading'],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: 'H2',
    group: 'Text',
    shortcut: '##',
    keywords: ['h2', 'sub', 'heading', 'medium'],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    icon: 'H3',
    group: 'Text',
    shortcut: '###',
    keywords: ['h3', 'heading', 'small'],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run(),
  },
  {
    title: 'Quote',
    description: 'Capture a quotation or excerpt',
    icon: '"',
    group: 'Text',
    shortcut: '>',
    keywords: ['quote', 'blockquote', 'excerpt', 'pullquote'],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },

  // ── Lists ─────────────────────────────────────────────────────────────────
  {
    title: 'Bullet List',
    description: 'Simple unordered list',
    icon: '•',
    group: 'Lists',
    shortcut: '-',
    keywords: ['bullet', 'ul', 'list', 'unordered', 'dash'],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: 'Numbered List',
    description: 'Ordered list with numbers',
    icon: '1.',
    group: 'Lists',
    shortcut: '1.',
    keywords: ['numbered', 'ol', 'ordered', 'list', 'numbers'],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: 'To-do List',
    description: 'Track tasks with checkboxes',
    icon: '☑',
    group: 'Lists',
    keywords: ['todo', 'task', 'check', 'checkbox', 'done'],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },

  // ── Blocks ────────────────────────────────────────────────────────────────
  {
    title: 'Callout',
    description: 'Highlight text with an icon',
    icon: '💡',
    group: 'Blocks',
    keywords: ['callout', 'info', 'tip', 'note', 'warning', 'highlight', 'alert'],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'callout',
          attrs: { emoji: '💡', color: 'blue' },
          content: [{ type: 'paragraph' }],
        })
        .run()
    },
  },
  {
    title: 'Code Block',
    description: 'Multi-line code with syntax',
    icon: '</>',
    group: 'Blocks',
    shortcut: '```',
    keywords: ['code', 'codeblock', 'snippet', 'pre', 'syntax'],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: 'Divider',
    description: 'Visual separator between sections',
    icon: '—',
    group: 'Blocks',
    shortcut: '---',
    keywords: ['divider', 'separator', 'hr', 'rule', 'line', 'break'],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },

  // ── Advanced ──────────────────────────────────────────────────────────────
  {
    title: 'Table',
    description: 'Insert a table with rows and columns',
    icon: '⊞',
    group: 'Advanced',
    keywords: ['table', 'grid', 'row', 'column', 'spreadsheet'],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run()
    },
  },
]

// ─── Suggestion renderer ──────────────────────────────────────────────────────
//
// CRITICAL: @tiptap/suggestion calls render() ONCE when the plugin initialises,
// then reuses the returned handler object for EVERY suggestion session.
// 
// The previous implementation used an `active` flag that was set to false in
// onExit() — which meant every session after the first one would silently bail
// out in onStart() because `if (!active) return` evaluated true.
//
// Fix: the handler object manages PER-SESSION state (component, containerEl) as
// plain mutable variables. onStart() always reinitialises them regardless of any
// previous session. No boolean gate needed — just clean up whatever was there
// before and start fresh.

type SuggestionRenderer = SuggestionOptions['render']

const renderMenu: SuggestionRenderer = () => {
  // These are per-session references, reset on every onStart().
  let component: ReactRenderer | null = null
  let containerEl: HTMLDivElement | null = null

  return {
    onStart(props) {
      // Always clean up any leftover DOM from a previous session before starting.
      // This is a safety net — normally onExit() handles cleanup, but defensive
      // teardown here ensures a fresh state even if onExit() was missed.
      cleanup(component, containerEl)
      component = null
      containerEl = null

      containerEl = document.createElement('div')
      containerEl.style.cssText = 'position:absolute;z-index:9999;'
      document.body.appendChild(containerEl)

      component = new ReactRenderer(SlashCommandMenu, {
        props,
        editor: props.editor as Editor,
      })
      containerEl.appendChild(component.element)
      positionContainer(containerEl, props.clientRect)
    },

    onUpdate(props) {
      // Guard: if component is null this session never started properly — skip.
      if (!component) return
      component.updateProps(props)
      positionContainer(containerEl, props.clientRect)
    },

    onKeyDown(props) {
      if (!component) return false

      if (props.event.key === 'Escape') {
        cleanup(component, containerEl)
        component = null
        containerEl = null
        return true
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (component.ref as any)?.onKeyDown?.(props) ?? false
    },

    onExit() {
      cleanup(component, containerEl)
      component = null
      containerEl = null
      // NOTE: do NOT set any shared boolean flag here.
      // onStart() will be called again for the next session and will reinitialise.
    },
  }
}

function positionContainer(
  el: HTMLDivElement | null,
  getRectFn?: (() => DOMRect | null) | null,
) {
  if (!el || !getRectFn) return
  const rect = getRectFn()
  if (!rect) return

  const menuW = 280
  const menuH = 400
  const vpW = window.innerWidth
  const vpH = window.innerHeight

  let left = rect.left + window.scrollX
  const spaceBelow = vpH - rect.bottom
  const spaceAbove = rect.top

  let top: number
  if (spaceBelow >= menuH || spaceBelow >= spaceAbove) {
    top = rect.bottom + window.scrollY + 6
  } else {
    top = rect.top + window.scrollY - menuH - 6
  }

  if (left + menuW > vpW - 8) left = Math.max(8, vpW - menuW - 8)
  if (left < 8) left = 8

  el.style.left = `${left}px`
  el.style.top = `${top}px`
}

function cleanup(component: ReactRenderer | null, el: HTMLDivElement | null) {
  try { component?.destroy() } catch { /* already destroyed */ }
  try { el?.remove() } catch { /* already removed */ }
}

// ─── Extension ────────────────────────────────────────────────────────────────

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        allowSpaces: false,
        // startOfLine: false allows '/' to be detected anywhere in the node,
        // but we use `allow()` below to restrict it to empty lines only.
        startOfLine: false,

        // Only trigger the slash menu when '/' is typed at the very start of an
        // otherwise-empty block (parentOffset === 0 means no text precedes it).
        // This satisfies the requirement: '/' mid-sentence = plain text,
        // '/' on a blank line = open command menu, works on ANY line without refresh.
        allow({ state, range }) {
          const $from = state.doc.resolve(range.from)
          // parentOffset is the character offset within the parent node.
          // 0 means the cursor / trigger char is at the very beginning of the node.
          return $from.parentOffset === 0
        },

        // NOTE: TipTap's suggestion `items()` is the single source of truth for filtering.
        // SlashCommandMenu must NOT re-filter — that causes double-filtering bugs.
        items: ({ query }: { query: string }): SlashCommandItem[] => {
          const q = query.toLowerCase().trim()
          if (!q) return SLASH_ITEMS
          return SLASH_ITEMS.filter(
            (item) =>
              item.title.toLowerCase().includes(q) ||
              item.description.toLowerCase().includes(q) ||
              item.keywords?.some((kw) => kw.includes(q)),
          )
        },

        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor
          range: Range
          props: SlashCommandItem
        }) => {
          props.command({ editor, range })
        },

        render: renderMenu,
      } as Partial<SuggestionOptions>,
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        ...(this.options.suggestion as SuggestionOptions),
        editor: this.editor,
      }),
    ]
  },
})