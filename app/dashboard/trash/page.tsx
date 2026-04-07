import { createClient } from '@/lib/supabase/server'
import { getTrashPages } from '@/app/actions/pages'
import TrashClient from './_components/TrashClient'

export const metadata = {
  title: 'Trash — VeloScribe',
}

export default async function TrashPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id')
    .eq('owner_id', user?.id ?? '')
    .limit(1)
    .maybeSingle()

  const trashedPages = workspace?.id ? await getTrashPages(workspace.id) : []

  return <TrashClient pages={trashedPages} />
}