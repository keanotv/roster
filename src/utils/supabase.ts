import type { Database } from '@/types/supabase.ts'
import { createClient } from '@supabase/supabase-js'
import { useGlobalToast } from './toast'

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