import Sidebar from '@/components/sidebar'
import { createClient } from '@/lib/supabase/server'
import { getPages } from '@/app/actions/pages'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
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

  // Fetch all pages for this workspace to populate the sidebar
  const pages = workspace?.id ? await getPages(workspace.id) : []

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: '#06091A',
        color: '#E2EAFF',
        overflow: 'hidden',
      }}
    >
      <Sidebar
        userFullName={profile?.full_name ?? 'User'}
        userAvatar={profile?.avatar_url ?? '🦊'}
        workspaceName={workspace?.name ?? 'My Workspace'}
        workspaceId={workspace?.id ?? ''}
        pages={pages.map((p) => ({
          id: p.id,
          title: p.title,
          emoji: p.emoji,
        }))}
      />
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {children}
      </main>
    </div>
  )
}