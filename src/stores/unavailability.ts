import { submitUnavailability } from '@/utils/unavailability'
import { defineStore } from 'pinia'
import { useRosterStore } from './roster'
import { getNextMonth } from '@/utils/unavailability'
import type { Sunday } from '@/types/unavailability'
import type { ReasonInsert, UnavailabilityInsert } from '@/types/roster'
import { getUnavailability } from '@/utils/roster'

export const useUnavailabilityStore = defineStore({
  id: 'unavailability',
  persist: true,
  state: () => ({
    selectedPersonId: 0,
    selectedPersonName: ''
  }),
  actions: {
    selectPerson(id: number, name: string) {
      this.selectedPersonId = id
      this.selectedPersonName = name
      this.initializeNextMonthUnavailability()
    },
    async submitUnavailability(unavailableSundays: Sunday[], reason: string) {
      const unavailabilityRows = [] as UnavailabilityInsert[]
      const reasonRows = [] as ReasonInsert[]
      unavailableSundays.forEach((sunday) => {
        if (reason !== null && reason.length > 0) {
          unavailabilityRows.push({
            days: sunday.days,
            month: sunday.month,
            people_id: this.selectedPersonId,
            year: sunday.year,
            reason: true
          })
          reasonRows.push({
            month: sunday.month,
            people_id: this.selectedPersonId,
            year: sunday.year,
            text: reason
          })
        } else {
          unavailabilityRows.push({
            days: sunday.days,
            month: sunday.month,
            people_id: this.selectedPersonId,
            year: sunday.year,
            reason: sunday.reason
          })
        }
      })
      await submitUnavailability(unavailabilityRows, reasonRows)
      await getUnavailability()
    },
    initializeNextMonthUnavailability() {
      const rosterStore = useRosterStore()
      const month = getNextMonth()
      if ( // unavailability for month + i not found
        rosterStore.unavailability.findIndex(
          (item) =>
            item.people_id === this.selectedPersonId &&
            item.year === month.year &&
            item.month === month.month
        ) === -1
      ) {
        rosterStore.unavailability.push({
          days: [] as number[],
          month: month.month,
          year: month.year,
          people_id: this.selectedPersonId,
          reason: false
        })
      }
    },
    getUnavailableSundays(): Sunday[] {
      const rosterStore = useRosterStore()
      const month = getNextMonth()
      this.initializeNextMonthUnavailability()
      return rosterStore.unavailability.filter(
        (item) =>
          item.people_id === this.selectedPersonId
        && item.month === month.month
        && item.year === month.year
      ).map(item => {
        return {
          year: item.year,
          month: item.month,
          days: item.days,
          reason: item.reason
        }
      }).sort((a, b) => (a.year * 100 + a.month) - (b.year * 100 + b.month))
    }
  }
})
