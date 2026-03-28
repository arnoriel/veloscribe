import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-4xl mb-4">👋</p>
        <h1 className="text-2xl font-bold text-white">
          Welcome, {(user?.user_metadata?.full_name ?? user?.user_metadata?.name)?.split(' ')[0] ?? 'there'}
        </h1>
        <p className="text-neutral-400 mt-2 text-sm">
          Select a page from the sidebar, or create a new one.
        </p>
      </div>
    </div>
  )
}