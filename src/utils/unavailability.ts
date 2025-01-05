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

export const getNextMonth = (): Month => {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  let nextMonth: Month
  if (month + 1 <= 12) {
    nextMonth = {
      year: year,
      month: month + 1
    }
  } else {
    nextMonth = {
      year: year + 1,
      month: (month + 1) % 12
    }
  }
  return nextMonth
}

export const getNextTwoMonths = (): Month[] => {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  const nextTwoMonths: Month[] = []
  for (let i = 0; i < 2; i++) {
    if (month + i <= 12) {
      nextTwoMonths.push({
        year: year,
        month: month + i
      })
    } else {
      nextTwoMonths.push({
        year: year + 1,
        month: (month + i) % 12
      })
    }
  }
  return nextTwoMonths
}

export const getSundaysInNextTwoMonths = (): Sunday[] => {
  const months = getNextTwoMonths()
  const sundays: Sunday[] = []
  months.forEach((month) => {
    const days: number[] = []
    for (let i = 1; i <= new Date(month.year, month.month, 0).getDate(); i++) {
      const date = new Date(month.year, month.month - 1, i)
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

export const getSundaysInNextMonth = (): Sunday => {
  const month = getNextMonth()
  const days: number[] = []
  for (let i = 1; i <= new Date(month.year, month.month, 0).getDate(); i++) {
    const date = new Date(month.year, month.month - 1, i)
    if (date.getDay() == 0) {
      days.push(i)
    }
  }
  return {
    year: month.year,
    month: month.month,
    days: days,
    reason: false
  }
}

export const getSundaysInTheMonthOf = (month: number, year: number): Sunday => {
  const days: number[] = []
  for (let i = 1; i < new Date(year, month - 1, 0).getDate(); i++) {
    const date = new Date(year, month - 1, i)
    if (date.getDay() == 0) {
      days.push(i)
    }
  }
  return {
    year,
    month,
    days
  }
}

export const submitUnavailability = async (
  unavailability: UnavailabilityInsert,
  reason: ReasonInsert
) => {
  const globalToast = useGlobalToast()
  let response
  if (unavailability.days.length === 0) {
    response = await Promise.all([
      await supabase
        .from('unavailability')
        .delete()
        .eq('year', unavailability.year)
        .eq('month', unavailability.month)
        .eq('people_id', unavailability.people_id),
      await supabase
        .from('reason')
        .delete()
        .eq('year', unavailability.year)
        .eq('month', unavailability.month)
        .eq('people_id', unavailability.people_id)
    ])
  } else {
    response = await Promise.all([
      await supabase
        .from('unavailability')
        .upsert(unavailability)
        .eq('year', unavailability.year)
        .eq('month', unavailability.month)
        .eq('people_id', unavailability.people_id),
      await supabase
        .from('reason')
        .upsert(reason)
        .eq('year', unavailability.year)
        .eq('month', unavailability.month)
        .eq('people_id', unavailability.people_id)
    ])
  }

  if (
    response.some((response) => {
      response.error !== null
    })
  ) {
    // some other error handling
    globalToast.error('Error submitting :( Please try again')
    return false
  } else {
    globalToast.success('Submitted successfully!')
    return true
  }
}
