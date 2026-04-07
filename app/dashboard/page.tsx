import { createClient } from '@/lib/supabase/server'
import DashboardClient from './_components/DashboardClient'
import { getPages } from '@/app/actions/pages'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user?.id ?? '')
    .maybeSingle()

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id, name')
    .eq('owner_id', user?.id ?? '')
    .limit(1)
    .maybeSingle()

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const avatar = profile?.avatar_url ?? '🦊'
  const workspaceName = workspace?.name ?? 'My Workspace'
  const workspaceId = workspace?.id ?? ''

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Get page count for the stats card
  const pages = workspaceId ? await getPages(workspaceId) : []
  const pageCount = pages.length

  const params = await searchParams
  const showWelcome = params?.welcome === '1'

  return (
    <DashboardClient
      firstName={firstName}
      avatar={avatar}
      workspaceName={workspaceName}
      greeting={greeting}
      showWelcome={showWelcome}
      workspaceId={workspaceId}
      pageCount={pageCount}
      pages={pages}
    />
  )
}