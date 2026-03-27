'use client'

import { signOut } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { FileText, Plus, Settings, LogOut, Search } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="w-64 h-full bg-[#161616] border-r border-white/5 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-white/5">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 cursor-pointer">
          <div className="w-5 h-5 bg-violet-500 rounded text-xs flex items-center justify-center font-bold">V</div>
          <span className="text-sm font-medium">My Workspace</span>
        </div>
      </div>

      {/* Nav */}
      <div className="p-2 flex flex-col gap-0.5">
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-neutral-400 hover:text-neutral-200 hover:bg-white/5">
            <Search size={15} />
                Search
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-neutral-400 hover:text-neutral-200 hover:bg-white/5">
            <Settings size={15} />
                Settings
        </Button>
      </div>

      {/* Pages */}
      <div className="flex-1 p-2">
        <div className="flex items-center justify-between px-2 py-1 mb-1">
          <span className="text-xs text-neutral-500 uppercase tracking-wider">Pages</span>
          <Button variant="ghost" size="icon" className="h-5 w-5 text-neutral-500 hover:text-white">
            <Plus size={13} />
          </Button>
        </div>
        {/* Placeholder pages */}
        {['Getting Started', 'My Notes', 'Projects'].map((page) => (
          <div key={page} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 cursor-pointer text-neutral-400 hover:text-neutral-200">
            <FileText size={14} />
            <span className="text-sm">{page}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-white/5">
        <form action={signOut}>
          <Button variant="ghost" size="sm" type="submit" className="w-full justify-start gap-2 text-neutral-400 hover:text-neutral-200 hover:bg-white/5">
            <LogOut size={15} />
            Sign Out
          </Button>
        </form>
      </div>
    </aside>
  )
}