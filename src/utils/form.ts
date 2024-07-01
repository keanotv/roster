import { supabase, sendError, type AnswerInsert } from './supabase'
import { useGlobalToast } from './toast'

export const submitAnswer = async (answer: AnswerInsert) => {
  const globalToast = useGlobalToast()
  const { error } = await supabase.from('answers').insert(answer)
  let success = false
  if (error) {
    sendError(error)
    globalToast.error('Error :( Please try again later')
  } else {
    success = true
    globalToast.success('Thanks for your submission!')
  }
  return success
}