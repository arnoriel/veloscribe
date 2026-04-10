// components/editor/extensions/ColumnBlock.tsx
//
// Implements a Notion-style multi-column layout for TipTap.
// Two node types:
//   • `columns`  — the grid wrapper, holds 2-3 `column` children
//   • `column`   — an isolated content area, holds any block content
//
// No DB schema changes needed — the layout is serialised as part of the
// existing `content` JSONB field (TipTap JSON format).

import { Node, mergeAttributes } from '@tiptap/core'

// ─── Columns wrapper node ─────────────────────────────────────────────────────

export const Columns = Node.create({
  name: 'columns',
  group: 'block',

  // Must have at least 1 column child; practically always 2-3
  content: 'column+',

  // Treat the whole grid as one structural unit
  defining: true,

  addAttributes() {
    return {
      // Number of columns: 2 or 3
      cols: {
        default: 2,
        parseHTML: (el) => parseInt(el.getAttribute('data-cols') ?? '2', 10),
        renderHTML: (attrs) => ({ 'data-cols': attrs.cols }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="columns"]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'columns',
        'data-cols': node.attrs.cols,
      }),
      0,
    ]
  },
})

// ─── Individual column node ───────────────────────────────────────────────────

export const Column = Node.create({
  name: 'column',

  // Any standard block content (paragraphs, headings, lists, callouts, …)
  content: 'block+',

  // `defining: true`  — the column is its own structural scope
  // `isolating: true` — Backspace at col start won't merge into previous block
  defining: true,
  isolating: true,

  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'column' }), 0]
  },
})