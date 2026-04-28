import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'nvidia/nemotron-3-super-120b-a12b:free'

// ─── Document type configs ────────────────────────────────────────────────────

const DOC_TYPES: Record<string, { label: string; emoji: string; structure: string }> = {
  blog_post: {
    label: 'Blog Post',
    emoji: '✍️',
    structure: `Structure it as:
- A compelling introduction (2-3 paragraphs)
- 3-4 main sections with H2 headings, each with 2-3 paragraphs
- Bullet points or numbered lists where appropriate
- A conclusion with key takeaways`,
  },
  meeting_notes: {
    label: 'Meeting Notes',
    emoji: '📋',
    structure: `Structure it as:
- Meeting overview (date, attendees, objective)
- Agenda items as H2 headings
- Key discussion points as bullet lists under each item
- Action items section with checkboxes (use - [ ] format)
- Next steps and follow-ups`,
  },
  project_plan: {
    label: 'Project Plan',
    emoji: '🗂️',
    structure: `Structure it as:
- Project overview and goals
- H2: Objectives (3-5 bullet points)
- H2: Timeline / Milestones (numbered list with phases)
- H2: Deliverables (bullet list)
- H2: Risks & Mitigations (bullet list)
- H2: Resources Needed
- H2: Success Metrics`,
  },
  research_notes: {
    label: 'Research Notes',
    emoji: '🔬',
    structure: `Structure it as:
- Research question / objective
- H2: Background & Context
- H2: Key Findings (bullet points with subpoints)
- H2: Analysis
- H2: Sources / References
- H2: Conclusions & Next Steps`,
  },
  product_spec: {
    label: 'Product Spec',
    emoji: '⚙️',
    structure: `Structure it as:
- H2: Overview & Problem Statement
- H2: Goals & Non-Goals (bullet lists)
- H2: User Stories (numbered list)
- H2: Functional Requirements (numbered/bullet list)
- H2: Technical Considerations
- H2: Open Questions
- H2: Success Metrics`,
  },
  weekly_report: {
    label: 'Weekly Report',
    emoji: '📊',
    structure: `Structure it as:
- Week summary (1 paragraph)
- H2: Accomplishments This Week (bullet list)
- H2: In Progress (bullet list with status)
- H2: Blockers & Challenges (bullet list)
- H2: Planned for Next Week (bullet list)
- H2: Metrics / KPIs (bullet list with values)`,
  },
  creative_story: {
    label: 'Creative Story',
    emoji: '📖',
    structure: `Structure it as:
- An engaging opening scene (2-3 paragraphs)
- Rising action with 2-3 story beats
- A climax moment
- Resolution (1-2 paragraphs)
Use vivid descriptions and natural dialogue where fitting.`,
  },
  email_draft: {
    label: 'Email Draft',
    emoji: '📨',
    structure: `Structure it as:
- Subject line after EMOJI line, before ---
- Brief opening (1-2 sentences)
- Main message (2-3 short paragraphs)
- Clear call-to-action
- Professional sign-off`,
  },
  study_guide: {
    label: 'Study Guide',
    emoji: '🎓',
    structure: `Structure it as:
- Topic overview (1 paragraph)
- H2: Key Concepts (each as H3 with explanation)
- H2: Important Terms (bullet list: term — definition)
- H2: Core Principles (numbered list)
- H2: Practice Questions (numbered list)
- H2: Summary & Key Takeaways (bullet list)`,
  },
  presentation_outline: {
    label: 'Presentation Outline',
    emoji: '🎯',
    structure: `Structure it as:
- H2: Slide 1 – Title (title text + 1-line description)
- H2: Slide 2 – Agenda (bullet list)
- H2 for each content slide with bullet points of speaking notes
- H2: Final Slide – Q&A / Thank You
Keep each slide section brief and scannable.`,
  },
}

// ─── System prompt factory ────────────────────────────────────────────────────

function buildSystemPrompt(docType: string, tone: string): string {
  const dt = DOC_TYPES[docType] ?? DOC_TYPES.blog_post
  const toneDesc =
    tone === 'professional'
      ? 'professional and polished'
      : tone === 'casual'
        ? 'friendly and conversational'
        : tone === 'academic'
          ? 'academic and authoritative'
          : 'clear and engaging'

  return `You are VeloScribe AI — an expert writing assistant inside a Notion-like editor app.

The user wants you to generate a complete, well-structured document.

Your response MUST follow this exact format:

TITLE: <a concise, compelling title for the document>
EMOJI: <a single relevant emoji that represents the document topic>
---
<the full document body in Markdown>

Rules:
- Output ONLY the above format. No preamble, no explanation.
- The body MUST use proper Markdown: # ## ### for headings, - for bullets, 1. for numbered lists, **bold**, *italic*, \`code\`.
- Write in a ${toneDesc} tone.
- Make it genuinely useful, specific, and well-structured — not generic.
- ${dt.structure}
- Aim for a thorough, complete document (at least 300-500 words of body content).`
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { prompt, docType = 'blog_post', tone = 'professional' } = await req.json()

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 })
    }

    const systemPrompt = buildSystemPrompt(docType, tone)
    const userMessage = `Write a ${DOC_TYPES[docType]?.label ?? 'document'} about: ${prompt}`

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://veloscribe.app',
        'X-Title': 'VeloScribe',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        stream: true,
        max_tokens: 3000,
        temperature: 0.75,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('OpenRouter error:', err)
      return NextResponse.json({ error: 'AI service error' }, { status: response.status })
    }

    // Pipe SSE stream through to client
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue
              const data = line.slice(6).trim()
              if (data === '[DONE]') {
                controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
                continue
              }
              try {
                const parsed = JSON.parse(data)
                const token = parsed.choices?.[0]?.delta?.content
                if (token) {
                  controller.enqueue(
                    new TextEncoder().encode(`data: ${JSON.stringify({ token })}\n\n`)
                  )
                }
              } catch {
                // skip malformed
              }
            }
          }
        } finally {
          controller.close()
          reader.releaseLock()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    console.error('AI generate route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
