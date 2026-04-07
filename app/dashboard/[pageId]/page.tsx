import { notFound } from 'next/navigation'
import { getPage } from '@/app/actions/pages'
import EditorClient from './_components/EditorClient'

interface PageProps {
  params: Promise<{ pageId: string }>
}

export default async function EditorPage({ params }: PageProps) {
  const { pageId } = await params
  const page = await getPage(pageId)

  if (!page) {
    notFound()
  }

  return (
    <EditorClient
      pageId={page.id}
      initialTitle={page.title}
      initialEmoji={page.emoji}
      initialContent={page.content}
    />
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { pageId } = await params
  const page = await getPage(pageId)
  return {
    title: page ? `${page.emoji} ${page.title} — Veloscribe` : 'Page — Veloscribe',
  }
}