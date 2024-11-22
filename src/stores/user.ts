import { login, logout, refreshToken } from '@/utils/supabase'
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
    isLoggedIn: false,
    lastRefreshed: Date.now() + 60_000
  }),
  actions: {
    async login(password: string) {
      await login(password)
    },
    async logout() {
      await logout()
    },
    async refreshToken() {
      if (Date.now() - 3_600_000> this.lastRefreshed) {
        this.lastRefreshed = Date.now()
        await refreshToken()
      }
    }
  }
})
