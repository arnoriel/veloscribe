import { createClient } from '@/lib/supabase/server'
import DashboardClient from './_components/DashboardClient'

export default async function DashboardPage() {
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
    .select('name')
    .eq('owner_id', user?.id ?? '')
    .limit(1)
    .maybeSingle()

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const avatar = profile?.avatar_url ?? '🦊'
  const workspaceName = workspace?.name ?? 'My Workspace'

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <DashboardClient
      firstName={firstName}
      avatar={avatar}
      workspaceName={workspaceName}
      greeting={greeting}
    />
  )
}