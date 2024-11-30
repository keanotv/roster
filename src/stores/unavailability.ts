import { getNextMonth, submitUnavailability } from '@/utils/unavailability'
import { defineStore } from 'pinia'
import { useRosterStore } from './roster'
import type { Month, Sunday } from '@/types/unavailability'
import type { ReasonInsert, UnavailabilityInsert } from '@/types/roster'
import { getUnavailability } from '@/utils/roster'
import router from '@/router'
import { ROUTE_NAMES } from '@/constants/constants'

export const useUnavailabilityStore = defineStore({
  id: 'unavailability',
  persist: true,
  state: () => ({
    selectedPersonId: 0,
    selectedPersonName: ''
  }),
  actions: {
    async selectPerson(id: number, name: string) {
      this.selectedPersonId = id
      this.selectedPersonName = name
      this.initializeNextMonthUnavailability()
      await router.push(ROUTE_NAMES.HOME)
    },
    clearPerson() {
      this.selectedPersonId = 0
      this.selectedPersonName = ''
    },
    async submitUnavailability(sunday: Sunday, reason: string) {
      const unavailabilityRow: UnavailabilityInsert = {
        days: sunday.days,
        month: sunday.month,
        people_id: this.selectedPersonId,
        year: sunday.year,
        reason: !!reason.length
      }
      const reasonRow: ReasonInsert = {
        month: sunday.month,
        people_id: this.selectedPersonId,
        year: sunday.year,
        text: reason
      }
      const success = await submitUnavailability(unavailabilityRow, reasonRow)
      if (success) {
        return await getUnavailability()
      } else {
        return false
      }
    },
    initializeNextMonthUnavailability() {
      const rosterStore = useRosterStore()
      const month = getNextMonth()
      if (
        // unavailability for month + i not found
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
      return rosterStore.unavailability
        .filter(
          (item) =>
            item.people_id === this.selectedPersonId &&
            item.month === month.month &&
            item.year === month.year
        )
        .map((item) => {
          return {
            year: item.year,
            month: item.month,
            days: item.days,
            reason: item.reason
          }
        })
        .sort((a, b) => a.year * 100 + a.month - (b.year * 100 + b.month))
    },
    getUnavailableSundaysForIdInTheMonthOf(id: number, month: Month): Sunday[] {
      const rosterStore = useRosterStore()
      this.initializeNextMonthUnavailability()
      return rosterStore.unavailability
        .filter(
          (item) =>
            item.people_id === id &&
            item.month === month.month &&
            item.year === month.year
        )
        .map((item) => {
          return {
            year: item.year,
            month: item.month,
            days: item.days,
            reason: item.reason
          }
        })
        .sort((a, b) => a.year * 100 + a.month - (b.year * 100 + b.month))
    }
  }
})
