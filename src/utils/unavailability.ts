import type { ReasonInsert, UnavailabilityInsert } from '@/types/roster'
import type { Month, Sunday } from '@/types/unavailability'
import { useGlobalToast } from '@/utils/toast'
import { supabase } from '@/utils/supabase'

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const getNextThreeMonths = (): Month[] => {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  const nextThreeMonths: Month[] = []
  for (let i = 0; i < 3; i++) {
    if (month + i <= 12) {
      nextThreeMonths.push({
        year: year,
        month: month + i
      })
    } else {
      nextThreeMonths.push({
        year: year + 1,
        month: (month + i) % 12
      })
    }
  }
  return nextThreeMonths
}

export const getSundaysInNextThreeMonths = (): Sunday[] => {
  const months = getNextThreeMonths()
  const sundays: Sunday[] = []
  months.forEach((month) => {
    const days: number[] = []
    for (
      let i = 1;
      i <= new Date(month.year, month.month - 1, 0).getDate();
      i++
    ) {
      let date = new Date(month.year, month.month - 1, i)
      if (date.getDay() == 0) {
        days.push(i)
      }
    }
    sundays.push({
      year: month.year,
      month: month.month,
      days: days,
      reason: false
    })
  })
  return sundays
}


export const submitUnavailability = async (
  unavailability: UnavailabilityInsert[],
  reasons: ReasonInsert[]
) => {
  const globalToast = useGlobalToast()
  const emptyUnavailability: UnavailabilityInsert[] = unavailability.filter(ua => ua.days.length === 0)
  // console.log(emptyUnavailability)
  const responses = await Promise.all([
    supabase.from('unavailability').upsert(unavailability.filter(ua => ua.days.length > 0)),
    supabase.from('reason').upsert(reasons)
  ])
  if (responses.some(response => {
    response.error !== null
  })) {
    // some other error handling
    globalToast.error('Error submitting :( Please try again')
    return false
  } else {
    globalToast.success('Thanks for submitting!')
    emptyUnavailability.forEach(async eua => {
      await supabase.from('unavailability').delete().eq('year', eua.year).eq('month', eua.month).eq('people_id', eua.people_id)
      await supabase.from('reason').delete().eq('year', eua.year).eq('month', eua.month).eq('people_id', eua.people_id)
    })
    return true
  }
}