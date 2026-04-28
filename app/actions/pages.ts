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
  is_deleted: boolean
  deleted_at: string | null
}

// ─── Get all ACTIVE pages for a workspace ──────────────────────────────────

export async function getPages(workspaceId: string): Promise<Page[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pages')
    .select('id, workspace_id, title, emoji, content, created_at, updated_at, is_deleted, deleted_at')
    .eq('workspace_id', workspaceId)
    .eq('is_deleted', false)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('[getPages] error:', error)
    return []
  }
  return (data ?? []) as Page[]
}

// ─── Get all TRASHED pages for a workspace ─────────────────────────────────

export async function getTrashPages(workspaceId: string): Promise<Page[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pages')
    .select('id, workspace_id, title, emoji, content, created_at, updated_at, is_deleted, deleted_at')
    .eq('workspace_id', workspaceId)
    .eq('is_deleted', true)
    .order('deleted_at', { ascending: false })

  if (error) {
    console.error('[getTrashPages] error:', error)
    return []
  }
  return (data ?? []) as Page[]
}

// ─── Get a single ACTIVE page ───────────────────────────────────────────────

export async function getPage(pageId: string): Promise<Page | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pages')
    .select('id, workspace_id, title, emoji, content, created_at, updated_at, is_deleted, deleted_at')
    .eq('id', pageId)
    .eq('is_deleted', false)
    .maybeSingle()

  if (error) {
    console.error('[getPage] error:', error)
    return null
  }
  return data as Page | null
}

// ─── Create a page pre-filled with content (no redirect) ───────────────────
// Used by AI Write flow — creates the page and returns the id.

export async function createPageWithContent(
  workspaceId: string,
  title: string,
  emoji: string,
  content: object
): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('pages')
    .insert({
      workspace_id: workspaceId,
      title: title || 'Untitled',
      emoji: emoji || '✨',
      content,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[createPageWithContent] error:', error)
    throw new Error('Failed to create page')
  }

  revalidatePath('/dashboard')
  return data.id
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
    .eq('is_deleted', false)

  if (error) {
    console.error('[updatePageContent] error:', error)
    throw new Error('Failed to save page')
  }
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
    .eq('is_deleted', false)

  if (error) {
    console.error('[updatePageTitle] error:', error)
    throw new Error('Failed to update title')
  }

  revalidatePath('/dashboard')
}

// ─── Soft delete a page (moves to trash) ───────────────────────────────────

export async function softDeletePage(pageId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pages')
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    })
    .eq('id', pageId)
    .eq('is_deleted', false)

  if (error) {
    console.error('[softDeletePage] error:', error)
    throw new Error('Failed to move page to trash')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/trash')
}

// ─── Restore a page from trash ─────────────────────────────────────────────

export async function restorePage(pageId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pages')
    .update({
      is_deleted: false,
      deleted_at: null,
    })
    .eq('id', pageId)
    .eq('is_deleted', true)

  if (error) {
    console.error('[restorePage] error:', error)
    throw new Error('Failed to restore page')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/trash')
}

// ─── Permanently delete a page (hard delete, no recovery) ──────────────────

export async function permanentDeletePage(pageId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', pageId)
    .eq('is_deleted', true) // safety: only delete pages already in trash

  if (error) {
    console.error('[permanentDeletePage] error:', error)
    throw new Error('Failed to permanently delete page')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/trash')
}

// ─── Legacy hard delete (kept for internal use / compatibility) ─────────────

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