import type { Database } from '@/types/supabase.ts'
import { createClient } from '@supabase/supabase-js'
import type { TelegramUser } from 'user-types'

let userIdGeneratedPassword = ''

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLIC_ANON_KEY
)

export const signUp = async (userId: string) => {
  return await supabase.auth.signUp({
    email: userId + '@a.a',
    password: userIdGeneratedPassword
  })
}

function getTelegramDataCheckString(telegramUser: TelegramUser): string {
  const data = new URLSearchParams(telegramUser)
  data.delete('hash')
  const values = Array.from(data.entries())
  values.sort(([aKey], [bKey]) => aKey.localeCompare(bKey))
  return values.map(([key, value]) => `${key}=${value}`).join('\n')
}

export const signInOrUp = async (telegramUser: TelegramUser) => {
  const { data: gpData, error: gpError } = await supabase.functions.invoke(
    'check-telegram-and-generate-password',
    {
      body: {
        dataCheckString: getTelegramDataCheckString(telegramUser),
        hash: telegramUser.hash,
        telegramId: telegramUser.id
      }
    }
  )
  if (gpData?.success) {
    if (gpData?.password && gpData.password.length) {
      userIdGeneratedPassword = gpData.password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: telegramUser.id + '@a.a',
        password: userIdGeneratedPassword
      })
      if (error && error.name === 'AuthApiError') {
        return await signUp(telegramUser.id)
      } else {
        return { data, error }
      }
    }
  }
  return { data: gpData, error: gpError }
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const getSession = async () => {
  return await supabase.auth.getSession()
}

export const sendError = async (error: any) => {
  const errorString = `Error: ${error?.toString()} / ${JSON.stringify(
    error,
    null,
    2
  )}`
  return await supabase.functions.invoke('send-error-details', {
    body: {
      error: errorString,
      timestamp: String(new Date())
    }
  })
}

export type SettingsRow = Database['public']['Tables']['settings']['Row']
export type SettingsUpdate = Database['public']['Tables']['settings']['Update']
export type SubmissionInsert =
  Database['public']['Tables']['submissions']['Insert']
export type SubmissionRow = Database['public']['Tables']['submissions']['Row']
export type MasterclassRow = Database['public']['Tables']['masterclass']['Row']
export type CountdownRow = Database['public']['Tables']['countdown']['Row']
export type CountdownUpdate = Database['public']['Tables']['countdown']['Update']
export type AnswerRow = Database['public']['Tables']['answers']['Row']
export type AnswerInsert = Database['public']['Tables']['answers']['Insert']