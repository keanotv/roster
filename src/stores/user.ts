import { defineStore } from 'pinia'
import type { User } from 'user-types'

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
  })
})
