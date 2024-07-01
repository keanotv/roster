import { supabase, type SubmissionRow, sendError } from './supabase'
import { useGlobalToast } from './toast'

export const fetchSubmissions = async () => {
  const globalToast = useGlobalToast()
  const { data, error } = await supabase.from('submissions').select()
  if (error) {
    sendError(error)
    globalToast.error('Error fetching submissions')
  } else {
    const response: SubmissionRow[] = data
    return response
  }
  return []
}
