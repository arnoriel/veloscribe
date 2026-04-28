/**
 * Converts AI-generated Markdown into TipTap-compatible JSON.
 * Supports: headings (H1-H3), paragraphs, bullet lists, ordered lists,
 * blockquotes, horizontal rules, bold, italic, inline code.
 */

type Mark = { type: string; attrs?: Record<string, unknown> }

type TipTapTextNode = {
  type: 'text'
  text: string
  marks?: Mark[]
}

type TipTapNode = {
  type: string
  attrs?: Record<string, unknown>
  content?: TipTapNode[]
  marks?: Mark[]
  text?: string
}

type TipTapDoc = {
  type: 'doc'
  content: TipTapNode[]
}

// ─── Inline parser (bold, italic, code) ──────────────────────────────────────

function parseInline(raw: string): TipTapTextNode[] {
  const nodes: TipTapTextNode[] = []
  // Combined regex for **bold**, *italic*, _italic_, `code`
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|_([^_]+)_)/g
  let lastIdx = 0
  let m: RegExpExecArray | null

  while ((m = re.exec(raw)) !== null) {
    if (m.index > lastIdx) {
      nodes.push({ type: 'text', text: raw.slice(lastIdx, m.index) })
    }
    if (m[2]) nodes.push({ type: 'text', text: m[2], marks: [{ type: 'bold' }] })
    else if (m[3]) nodes.push({ type: 'text', text: m[3], marks: [{ type: 'italic' }] })
    else if (m[4]) nodes.push({ type: 'text', text: m[4], marks: [{ type: 'code' }] })
    else if (m[5]) nodes.push({ type: 'text', text: m[5], marks: [{ type: 'italic' }] })
    lastIdx = re.lastIndex
  }

  if (lastIdx < raw.length) nodes.push({ type: 'text', text: raw.slice(lastIdx) })
  return nodes.length > 0 ? nodes : [{ type: 'text', text: raw }]
}

// ─── Main converter ───────────────────────────────────────────────────────────

export function markdownToTipTap(markdown: string): TipTapDoc {
  const lines = markdown.split('\n')
  const nodes: TipTapNode[] = []
  let bulletItems: TipTapNode[] = []
  let orderedItems: TipTapNode[] = []

  const flushBullets = () => {
    if (bulletItems.length) {
      nodes.push({ type: 'bulletList', content: [...bulletItems] })
      bulletItems = []
    }
  }
  const flushOrdered = () => {
    if (orderedItems.length) {
      nodes.push({ type: 'orderedList', content: [...orderedItems] })
      orderedItems = []
    }
  }
  const flushLists = () => { flushBullets(); flushOrdered() }

  for (const raw of lines) {
    const line = raw.trimEnd()
    const trimmed = line.trim()

    // Heading
    const hMatch = trimmed.match(/^(#{1,3})\s+(.+)$/)
    if (hMatch) {
      flushLists()
      nodes.push({
        type: 'heading',
        attrs: { level: hMatch[1].length },
        content: parseInline(hMatch[2]),
      })
      continue
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushLists()
      nodes.push({ type: 'horizontalRule' })
      continue
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushLists()
      nodes.push({
        type: 'blockquote',
        content: [{ type: 'paragraph', content: parseInline(trimmed.slice(2)) }],
      })
      continue
    }

    // Bullet list
    const bMatch = trimmed.match(/^[-*+]\s+(.+)$/)
    if (bMatch) {
      flushOrdered()
      bulletItems.push({
        type: 'listItem',
        content: [{ type: 'paragraph', content: parseInline(bMatch[1]) }],
      })
      continue
    }

    // Ordered list
    const oMatch = trimmed.match(/^\d+[.)]\s+(.+)$/)
    if (oMatch) {
      flushBullets()
      orderedItems.push({
        type: 'listItem',
        content: [{ type: 'paragraph', content: parseInline(oMatch[1]) }],
      })
      continue
    }

    // Empty line
    if (trimmed === '') {
      flushLists()
      continue
    }

    // Default: paragraph
    flushLists()
    nodes.push({ type: 'paragraph', content: parseInline(trimmed) })
  }

  flushLists()

  if (nodes.length === 0) {
    nodes.push({ type: 'paragraph', content: [{ type: 'text', text: '' }] })
  }

  return { type: 'doc', content: nodes }
}

// ─── Parse AI raw output → title, emoji, body ────────────────────────────────

export interface ParsedAIContent {
  title: string
  emoji: string
  bodyMarkdown: string
  tiptapDoc: TipTapDoc
}

/**
 * Parses the structured AI output:
 * TITLE: <title>
 * EMOJI: <emoji>
 * ---
 * <markdown body>
 */
export function parseAIWriteOutput(raw: string): ParsedAIContent {
  let title = 'Untitled'
  let emoji = '✨'
  let bodyMarkdown = ''

  const titleMatch = raw.match(/^TITLE:\s*(.+)$/m)
  if (titleMatch) title = titleMatch[1].trim()

  const emojiMatch = raw.match(/^EMOJI:\s*(.+)$/m)
  if (emojiMatch) emoji = emojiMatch[1].trim()

  const separatorIdx = raw.indexOf('\n---\n')
  if (separatorIdx !== -1) {
    bodyMarkdown = raw.slice(separatorIdx + 5).trim()
  } else {
    // Fallback: strip header lines and use the rest
    bodyMarkdown = raw
      .replace(/^TITLE:.*$/m, '')
      .replace(/^EMOJI:.*$/m, '')
      .replace(/^---$/m, '')
      .trim()
  }

  return {
    title,
    emoji,
    bodyMarkdown,
    tiptapDoc: markdownToTipTap(bodyMarkdown),
  }
}
