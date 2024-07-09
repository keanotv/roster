import type {
  RoleRow,
  PeopleRow,
  UnavailabilityRow,
  RosterRowLocal
} from '@/types/roster'
import {
  createNewRosterWithTitle,
  getPeople,
  getRoles,
  getRosterById,
  getRosters,
  getUnavailability,
  saveDate,
  saveTitle,
  updatePublished
} from '@/utils/roster'
import { defineStore } from 'pinia'

export const useRosterStore = defineStore({
  id: 'roster',
  persist: true,
  state: () => ({
    services: 3,
    people: [] as PeopleRow[],
    roles: [] as RoleRow[],
    unavailability: [] as UnavailabilityRow[],
    isInitializing: false,
    rosters: [] as RosterRowLocal[],
    unavailabilityByDate: [] as Map<string, Set<number>>[]
  }),
  actions: {
    async initializeRosterStore() {
      if (!this.isInitializing) {
        this.isInitializing = true
        await Promise.all([
          getPeople(),
          getRoles(),
          getUnavailability(),
          getRosters()
        ])
        this.isInitializing = false
      }
    },
    async createNewRosterWithTitle(title: string) {
      const roster = await createNewRosterWithTitle(title)
      if (roster !== null) {
        return roster.id
      } else {
        return 0
      }
    },
    async getUnavailability() {
      await getUnavailability()
    },
    async getPeople() {
      await getPeople()
    },
    async getRosters() {
      await getRosters()
    },
    async getRosterById(id: number) {
      const roster = this.rosters.find(roster => roster.id === id)
      if (roster == undefined) {
        await getRosterById(id)
        return this.rosters.find(roster => roster.id === id)!
      } else {
        return roster
      }
    },
    async saveDate(id: number, date: string) {
      await saveDate(id, date)
    },
    async saveTitle(id: number, title: string) {
      await saveTitle(id, title)
    },
    async updatePublished(id: number, published: boolean) {
      await updatePublished(id, published)
    }
  }
})
