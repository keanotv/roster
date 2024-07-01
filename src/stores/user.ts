import { defineStore } from 'pinia'
import { sendError, signInOrUp, signOut } from '@/utils/supabase'
import type { TelegramUser } from 'user-types'
import type { User } from 'user-types'
import { supabase } from '@/utils/supabase'
import { useGlobalToast } from '@/utils/toast'
import { getUserSettings } from '@/utils/settings'
import { PASSWORDS } from '@/constants/constants'

const globalToast = useGlobalToast()

export const enum USER_ROLES {
  YOUTH = 'YOUTH',
  ADMIN = 'ADMIN'
}

export class UserImpl implements User {
  id: string
  supabaseUuid: string
  firstName: string
  username: string
  photoUrl: string
  authDate: string
  isLoggedIn: boolean
  role: USER_ROLES[]

  constructor() {
    this.id = ''
    this.supabaseUuid = ''
    this.firstName = ''
    this.username = ''
    this.photoUrl = ''
    this.authDate = ''
    this.isLoggedIn = false
    this.role = [USER_ROLES.YOUTH]
  }
}

export const useUserStore = defineStore({
  id: 'user',
  persist: true,
  state: () => ({
    user: new UserImpl()
  }),
  actions: {
    async login(telegramUser: TelegramUser) {
      const { data, error } = await signInOrUp(telegramUser)
      if (error || data?.success === false) {
        this.user.isLoggedIn = false
        sendError(error || data.error)
        globalToast.error('Error logging in :(')
      } else {
        this.user.isLoggedIn = true
      }
      if (this.user.isLoggedIn) {
        this.user.id = telegramUser.id
        this.user.firstName = telegramUser.first_name
        this.user.username = telegramUser.username
        this.user.photoUrl = telegramUser.photo_url
        this.user.authDate = telegramUser.auth_date
        const { data } = await supabase.auth.getSession()
        if (data && data.session?.user?.id) {
          this.user.supabaseUuid = data.session?.user?.id
        }
        globalToast.success('Logged in successfully')
        getUserSettings()
      }
    },
    async logout() {
      const response = await signOut()
      if (response?.error) {
        sendError(response.error)
        globalToast.warning('You have probably logged out :P')
      } else {
        globalToast.success('Logged out successfully')
      }
      this.user = new UserImpl()
      return
    },
    checkPassword(password: string): boolean {
      switch (password) {
        case PASSWORDS.ADMIN:
          this.user.role = [USER_ROLES.ADMIN, USER_ROLES.YOUTH]
          return true
        case PASSWORDS.YOUTH:
          this.user.role = [USER_ROLES.YOUTH]
          return true
        default:
          return false
      }
    },
    addRole(roleToAdd: USER_ROLES) {
      if (!this.user.role.some(role => role === roleToAdd)) {
        this.user.role.push(roleToAdd)
      }
    },
    removeRole(roleToRemove: USER_ROLES) {
      this.user.role = this.user.role.filter(role => role !== roleToRemove)
    }
  }
})
