import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { AppState, User } from '@/types'

interface AppStore extends AppState {
  // Ações
  setUser: (user: User | null) => void
  setOnlineStatus: (isOnline: boolean) => void
  setLoading: (isLoading: boolean) => void
  updateLastSync: () => void
  logout: () => void
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        // Estado inicial
        user: null,
        isOnline: navigator.onLine,
        isLoading: false,
        lastSync: null,

        // Ações
        setUser: (user) => set({ user }),
        setOnlineStatus: (isOnline) => set({ isOnline }),
        setLoading: (isLoading) => set({ isLoading }),
        updateLastSync: () => set({ lastSync: new Date() }),
        logout: () => set({ user: null, lastSync: null })
      }),
      {
        name: 'agrogest-app-storage',
        partialize: (state) => ({
          user: state.user,
          lastSync: state.lastSync
        })
      }
    ),
    {
      name: 'app-store'
    }
  )
)
