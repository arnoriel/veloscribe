'use server'

import { createClient } from '@/lib/supabase/server'

export type SaveProfileResult =
  | { success: true }
  | { success: false; error: string }

export async function saveProfile(
  fullName: string,
  /** Either an emoji string (e.g. "🦊") or a full https:// URL from OAuth */
  avatarValue: string,
  workspaceName: string
): Promise<SaveProfileResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user || authError) {
      return { success: false, error: 'Not authenticated' }
    }

    // Upsert profile row
    const { error: profileError } = await supabase.from('profiles').upsert(
      {
        id: user.id,
        full_name: fullName.trim(),
        avatar_url: avatarValue,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )

    if (profileError) {
      return { success: false, error: profileError.message }
    }

    // Create workspace only if one doesn't exist yet
    const { data: existing } = await supabase
      .from('workspaces')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1)
      .maybeSingle()

    if (!existing) {
      const { error: wsError } = await supabase.from('workspaces').insert({
        owner_id: user.id,
        name: workspaceName.trim() || 'My Workspace',
      })

      if (wsError) {
        return { success: false, error: wsError.message }
      }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
