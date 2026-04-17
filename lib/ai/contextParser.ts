/**
 * Converts a TipTap JSON document into a clean plain-text string
 * so the AI model can understand what the user is writing.
 */

type TipTapNode = {
  type: string
  text?: string
  content?: TipTapNode[]
  attrs?: Record<string, unknown>
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>
}

function extractNodeText(node: TipTapNode): string {
  // Leaf text node
  if (node.type === 'text') {
    return node.text ?? ''
  }

  // Hard break
  if (node.type === 'hardBreak') {
    return '\n'
  }

  const children = node.content ?? []

  switch (node.type) {
    case 'doc':
      return children.map(extractNodeText).join('\n\n').trim()

    case 'paragraph':
      return children.map(extractNodeText).join('')

    case 'heading': {
      const level = (node.attrs?.level as number) ?? 1
      const prefix = '#'.repeat(level) + ' '
      return prefix + children.map(extractNodeText).join('')
    }

    case 'bulletList':
    case 'orderedList':
      return children.map(extractNodeText).join('\n')

    case 'listItem':
    case 'taskItem':
      return '• ' + children.map(extractNodeText).join('')

    case 'blockquote':
      return '> ' + children.map(extractNodeText).join('')

    case 'codeBlock': {
      const lang = (node.attrs?.language as string) ?? ''
      return `\`\`\`${lang}\n${children.map(extractNodeText).join('')}\n\`\`\``
    }

    case 'horizontalRule':
      return '---'

    case 'table':
      return children.map(extractNodeText).join('\n')

    case 'tableRow':
      return children.map(extractNodeText).join(' | ')

    case 'tableHeader':
    case 'tableCell':
      return children.map(extractNodeText).join('')

    case 'calloutBlock':
      return children.map(extractNodeText).join('')

    case 'columns':
    case 'column':
      return children.map(extractNodeText).join('\n')

    case 'taskList':
      return children.map(extractNodeText).join('\n')

    default:
      return children.map(extractNodeText).join('')
  }
}

/**
 * Parse a full TipTap JSON doc into a plain-text string.
 * Returns empty string if doc is null/undefined.
 */
export function tiptapToPlainText(doc: TipTapNode | null | undefined): string {
  if (!doc) return ''
  return extractNodeText(doc)
}

/**
 * Get a shortened context (around N chars) to send alongside the selected text.
 * Keeps context relevant without blowing up the token budget.
 */
export function getDocumentContext(
  doc: TipTapNode | null | undefined,
  maxChars = 1500
): string {
  const full = tiptapToPlainText(doc)
  if (full.length <= maxChars) return full
  // Take first half + last half for context
  const half = Math.floor(maxChars / 2)
  return full.slice(0, half) + '\n…\n' + full.slice(-half)
}