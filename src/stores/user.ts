import { login, logout } from '@/utils/supabase'
import { defineStore } from 'pinia'

export const enum USER_ROLES {
  SERVER = 'SERVER',
  ADMIN = 'ADMIN'
}

export const useUserStore = defineStore({
  id: 'user',
  persist: true,
  state: () => ({
    role: [] as USER_ROLES[],
    isLoggedIn: false
  }),
  actions: {
    async login(password: string) {
      await login(password)
    },
    logout() {
      logout()
    }
  }
})
