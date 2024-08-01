import type { Database } from '@/types/supabase.ts'
import { createClient } from '@supabase/supabase-js'
import { useGlobalToast } from './toast'
import router from '@/router'
import { ROUTE_NAMES } from '@/constants/constants'
import { USER_ROLES, useUserStore } from '@/stores/user'
import { useRosterStore } from '@/stores/roster'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLIC_ANON_KEY
)

export const sendError = async (error: any) => {
  const errorString = `Error: ${error?.toString()} / ${JSON.stringify(
    error,
    null,
    2
  )}`
  const globalToast = useGlobalToast()
  globalToast.error(errorString)
  // return await supabase.functions.invoke('send-error-details', {
  //   body: {
  //     error: errorString,
  //     timestamp: String(new Date())
  //   }
  // })
}

export const login = async (password: string) => {
  const { data: loginData, error } = await supabase.functions.invoke('login', {
    body: { password },
  })
  if (error) {
    // some error handling
  } else {
    const globalToast = useGlobalToast()
    if (loginData.email && loginData.password && loginData.role) {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      })
      if (error) {
        // some error handling
        globalToast.error('Please try again later :(')
      } else {
        globalToast.success(loginData.message)
        const userStore = useUserStore()
        userStore.isLoggedIn = true
        userStore.role.push(USER_ROLES.SERVER)
        if (loginData.role === USER_ROLES.ADMIN) {
          userStore.role.push(USER_ROLES.ADMIN)
        }
        const rosterStore = useRosterStore()
        rosterStore.lastUpdated = 0
        rosterStore.initializeRosterStore()
        router.push(ROUTE_NAMES.HOME)
      }
    } else if (loginData.error) {
      globalToast.error(loginData.error.message)
    }
  }
}

export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  const globalToast = useGlobalToast()
  if (error) {
    // some error handling
    globalToast.error('Error logging out')
  } else {
    globalToast.success('Logged out successfully!')
    const userStore = useUserStore()
    userStore.isLoggedIn = false
    userStore.role = []
    const rosterStore = useRosterStore()
    rosterStore.clearStore()
    router.push(ROUTE_NAMES.LOGIN)
  }
}