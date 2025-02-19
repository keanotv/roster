import type { Database } from '@/types/supabase.ts'
import { createClient } from '@supabase/supabase-js'
import { useGlobalToast } from './toast'
import router from '@/router'
import { ROUTE_NAMES } from '@/constants/constants'
import { USER_ROLES, useUserStore } from '@/stores/user'
import { useRosterStore } from '@/stores/roster'
import { useUnavailabilityStore } from '@/stores/unavailability'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLIC_ANON_KEY
)

export const refreshToken = async () => {
  const { data, error } = await supabase.auth.getSession()
  const globalToast = useGlobalToast()
  if (error) {
    // some error handling
    globalToast.info('You have been logged out due to inactivity')
    await logout()
  } else {
    if (!data) {
      globalToast.info('You have been logged out due to inactivity')
      await logout()
    } else {
      const { data, error } = await supabase.auth.refreshSession()
      if (!data || error) {
        globalToast.info('You have been logged out due to inactivity')
        await logout()
      }
    }
  }
}

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
    body: { password }
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
        const userStore = useUserStore()
        userStore.isLoggedIn = true
        userStore.role.push(USER_ROLES.SERVER)
        if (loginData.role === USER_ROLES.ADMIN) {
          userStore.role.push(USER_ROLES.ADMIN)
          globalToast.success(loginData.message)
        }
        const rosterStore = useRosterStore()
        rosterStore.lastUpdated = 0
        await rosterStore.initializeRosterStore()
        await router.push(ROUTE_NAMES.NAME)
      }
    } else if (loginData.error) {
      globalToast.error(loginData.error.message)
    }
  }
}

export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  const userStore = useUserStore()
  const rosterStore = useRosterStore()
  const unavailabilityStore = useUnavailabilityStore()
  if (error) {
    // some error handling
  }
  userStore.isLoggedIn = false
  userStore.role = []
  rosterStore.clearStore()
  unavailabilityStore.clearPerson()
  await router.push(ROUTE_NAMES.LOGIN)
}
