import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'nvidia/nemotron-3-super-120b-a12b:free'

const SYSTEM_PROMPTS: Record<string, string> = {
  improve:
    'You are an expert writing assistant. Improve the clarity, flow, and quality of the given text. Keep the same language, tone, and approximate length. Return only the improved text, no explanations.',
  summarize:
    'You are a concise summarizer. Summarize the given text into 2-3 clear sentences. Return only the summary, no explanations.',
  expand:
    'You are a creative writing assistant. Expand the given text with more detail, examples, or elaboration while preserving the original tone and intent. Return only the expanded text.',
  fix_grammar:
    'You are a grammar expert. Fix all grammar, spelling, and punctuation errors in the given text. Preserve the original meaning exactly. Return only the corrected text.',
  make_shorter:
    'You are an editing assistant. Make the given text more concise without losing key information. Return only the shortened text.',
  make_longer:
    'You are a writing assistant. Expand the given text to be more detailed and comprehensive. Return only the longer version.',
  change_tone_professional:
    'You are a writing assistant. Rewrite the given text in a professional, formal tone. Return only the rewritten text.',
  change_tone_casual:
    'You are a writing assistant. Rewrite the given text in a casual, friendly, conversational tone. Return only the rewritten text.',
  continue:
    'You are a writing assistant. Continue the given text naturally, matching the style and tone. Write 2-4 additional sentences. Return only the continuation (not the original text).',
}

export async function POST(req: NextRequest) {
  try {
    const { action, selectedText, context } = await req.json()

    if (!action || !selectedText) {
      return NextResponse.json({ error: 'Missing action or selectedText' }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 })
    }

    const systemPrompt = SYSTEM_PROMPTS[action] ?? SYSTEM_PROMPTS.improve

    const userMessage = context
      ? `Document context:\n${context}\n\n---\nSelected text to process:\n${selectedText}`
      : selectedText

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
        max_tokens: 2048,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('OpenRouter error:', err)
      return NextResponse.json({ error: 'AI service error' }, { status: response.status })
    }

    // Pipe the SSE stream through to the client
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
                // skip malformed lines
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
  } catch (error) {
    console.error('AI route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}