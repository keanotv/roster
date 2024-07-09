import { defineStore } from 'pinia'
import { sendError } from '@/utils/supabase'
import type { TelegramUser } from 'user-types'
import type { User } from 'user-types'
import { supabase } from '@/utils/supabase'
import { useGlobalToast } from '@/utils/toast'
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
  })
})
