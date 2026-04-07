import { Extension } from '@tiptap/core'
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import type { Editor, Range } from '@tiptap/core'
import SlashCommandMenu, { SlashCommandItem } from '../SlashCommandMenu'

// ─── Command definitions (grouped) ────────────────────────────────────────

const SLASH_ITEMS: SlashCommandItem[] = [
  // ── Basic Blocks ───────────────────────────────────────────────────────
  {
    title: 'Text',
    description: 'Plain paragraph text',
    icon: '¶',
    group: 'Basic',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run()
    },
  },
  {
    title: 'Heading 1',
    description: 'Large section heading',
    icon: 'H1',
    group: 'Basic',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 1 })
        .run()
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: 'H2',
    group: 'Basic',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run()
    },
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    icon: 'H3',
    group: 'Basic',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 3 })
        .run()
    },
  },

  // ── Advanced Blocks ────────────────────────────────────────────────────
  {
    title: 'Bullet List',
    description: 'Unordered list with bullets',
    icon: '•',
    group: 'Advanced',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: 'Numbered List',
    description: 'Ordered list with numbers',
    icon: '1.',
    group: 'Advanced',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: 'Quote',
    description: 'Blockquote for callouts',
    icon: '"',
    group: 'Advanced',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    },
  },
  {
    title: 'Code Block',
    description: 'Multi-line code block',
    icon: '</>',
    group: 'Advanced',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    },
  },
]

// ─── Suggestion config ─────────────────────────────────────────────────────

type SuggestionRenderer = SuggestionOptions['render']

const renderMenu: SuggestionRenderer = () => {
  let component: ReactRenderer | null = null
  let containerEl: HTMLDivElement | null = null

  // #4 fix: Use AbortController to detect if component was cleaned up early
  let destroyed = false

  return {
    onStart(props) {
      if (destroyed) return

      containerEl = document.createElement('div')
      containerEl.style.position = 'absolute'
      containerEl.style.zIndex = '9999'
      document.body.appendChild(containerEl)

      component = new ReactRenderer(SlashCommandMenu, {
        props,
        editor: props.editor as Editor,
      })

      containerEl.appendChild(component.element)
      positionContainer(containerEl, props.clientRect)
    },

    onUpdate(props) {
      if (destroyed) return
      component?.updateProps(props)
      positionContainer(containerEl, props.clientRect)
    },

    onKeyDown(props) {
      if (destroyed) return false
      if (props.event.key === 'Escape') {
        cleanup(component, containerEl)
        destroyed = true
        return true
      }
      // Delegate arrow / enter keys to the menu component
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (component?.ref as any)?.onKeyDown?.(props) ?? false
    },

    onExit() {
      cleanup(component, containerEl)
      component = null
      containerEl = null
      destroyed = true
    },
  }
}

function positionContainer(
  el: HTMLDivElement | null,
  getRectFn?: (() => DOMRect | null) | null
) {
  if (!el || !getRectFn) return
  const rect = getRectFn()
  if (!rect) return

  const menuWidth = 260
  const menuHeight = 340
  const viewportW = window.innerWidth
  const viewportH = window.innerHeight

  let left = rect.left + window.scrollX
  let top = rect.bottom + window.scrollY + 6

  // Clamp horizontally
  if (left + menuWidth > viewportW - 8) {
    left = viewportW - menuWidth - 8
  }

  // Flip above cursor if not enough space below
  if (top + menuHeight > viewportH + window.scrollY - 8) {
    top = rect.top + window.scrollY - menuHeight - 6
  }

  el.style.left = `${left}px`
  el.style.top = `${top}px`
}

function cleanup(component: ReactRenderer | null, el: HTMLDivElement | null) {
  try {
    component?.destroy()
  } catch {
    // silently ignore if already destroyed
  }
  try {
    el?.remove()
  } catch {
    // silently ignore
  }
}

// ─── Extension ────────────────────────────────────────────────────────────

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        allowSpaces: false,
        startOfLine: false,

        items: ({ query }: { query: string }): SlashCommandItem[] => {
          const q = query.toLowerCase().trim()
          if (!q) return SLASH_ITEMS
          return SLASH_ITEMS.filter(
            (item) =>
              item.title.toLowerCase().includes(q) ||
              item.description.toLowerCase().includes(q)
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