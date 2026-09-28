import { create } from 'zustand'

interface UserStore {
  user: any | null
  setUser: (user: any | null) => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))

