'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ─── Types ─────────────────────────────────────────────────────────────────

export interface Page {
  id: string
  workspace_id: string
  title: string
  emoji: string
  content: object | null
  created_at: string
  updated_at: string
}

// ─── Get all pages for a workspace ─────────────────────────────────────────

export async function getPages(workspaceId: string): Promise<Page[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pages')
    .select('id, workspace_id, title, emoji, content, created_at, updated_at')
    .eq('workspace_id', workspaceId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('[getPages] error:', error)
    return []
  }
  return (data ?? []) as Page[]
}

// ─── Get a single page ──────────────────────────────────────────────────────

export async function getPage(pageId: string): Promise<Page | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pages')
    .select('id, workspace_id, title, emoji, content, created_at, updated_at')
    .eq('id', pageId)
    .maybeSingle()

  if (error) {
    console.error('[getPage] error:', error)
    return null
  }
  return data as Page | null
}

// ─── Create a new page ──────────────────────────────────────────────────────

export async function createPage(workspaceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('pages')
    .insert({
      workspace_id: workspaceId,
      title: 'Untitled',
      emoji: '📄',
      content: null,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[createPage] error:', error)
    throw new Error('Failed to create page')
  }

  revalidatePath('/dashboard')
  redirect(`/dashboard/${data.id}`)
}

// ─── Update page content + title (called by debounced save) ────────────────

export async function updatePageContent(
  pageId: string,
  content: object,
  title: string,
  emoji?: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pages')
    .update({
      content,
      title: title || 'Untitled',
      ...(emoji ? { emoji } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)

  if (error) {
    console.error('[updatePageContent] error:', error)
    throw new Error('Failed to save page')
  }

  // We do NOT revalidatePath here on purpose — the editor handles
  // optimistic local state, and we don't want a full server re-render
  // on every keystroke save.
}

// ─── Update page title only ─────────────────────────────────────────────────

export async function updatePageTitle(pageId: string, title: string, emoji?: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pages')
    .update({
      title: title || 'Untitled',
      ...(emoji ? { emoji } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)

  if (error) {
    console.error('[updatePageTitle] error:', error)
    throw new Error('Failed to update title')
  }

  revalidatePath('/dashboard')
}

// ─── Delete a page ──────────────────────────────────────────────────────────

export async function deletePage(pageId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('pages').delete().eq('id', pageId)

  if (error) {
    console.error('[deletePage] error:', error)
    throw new Error('Failed to delete page')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}