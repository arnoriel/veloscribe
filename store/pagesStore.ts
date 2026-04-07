import { create } from 'zustand'

export interface SidebarPage {
  id: string
  title: string
  emoji: string
}

interface PagesStore {
  pages: SidebarPage[]
  setPages: (pages: SidebarPage[]) => void
  updatePageMeta: (id: string, title: string, emoji: string) => void
  savingPageId: string | null
  setSavingPageId: (id: string | null) => void
}

export const usePagesStore = create<PagesStore>((set) => ({
  pages: [],
  setPages: (pages) => set({ pages }),
  updatePageMeta: (id, title, emoji) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === id ? { ...p, title, emoji } : p
      ),
    })),
  savingPageId: null,
  setSavingPageId: (id) => set({ savingPageId: id }),
}))