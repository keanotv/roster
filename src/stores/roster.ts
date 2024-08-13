import type {
  RoleRow,
  PeopleRow,
  UnavailabilityRow,
  RosterRowLocal,
  Role,
  ReasonRow
} from '@/types/roster'
import {
  createNewRosterWithTitle,
  deleteRoster,
  getPeople,
  getReasons,
  getRoles,
  getRosters,
  getUnavailability,
  saveDate,
  saveRoster,
  saveTitle,
  updateArchived,
  updatePublished
} from '@/utils/roster'
import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user'

export const useRosterStore = defineStore({
  id: 'roster',
  persist: true,
  state: () => ({
    lastUpdated: 0,
    services: 3,
    people: [] as PeopleRow[],
    roles: [] as RoleRow[],
    unavailability: [] as UnavailabilityRow[],
    reasons: [] as ReasonRow[],
    isInitializing: false,
    rosters: [] as RosterRowLocal[],
    unavailabilityByDate: [] as Map<string, Set<number>>[]
  }),
  actions: {
    async initializeRosterStore() {
      const userStore = useUserStore()
      if (
        new Date().getTime() - 60_000 > this.lastUpdated &&
        userStore.isLoggedIn
      ) {
        this.lastUpdated = new Date().getTime()
        if (!this.isInitializing) {
          this.isInitializing = true
          await Promise.all([
            getPeople(),
            getRoles(),
            getUnavailability(),
            getRosters(),
            getReasons()
          ])
          this.isInitializing = false
        }
      }
    },
    clearStore() {
      this.people = []
      this.roles = []
      this.unavailability = []
      this.reasons = []
      this.rosters = []
      this.unavailabilityByDate = []
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
      if (!this.isInitializing) await getUnavailability()
    },
    async getPeople() {
      if (!this.isInitializing) await getPeople()
    },
    async getRosters() {
      if (!this.isInitializing) await getRosters()
    },
    async getReasons() {
      if (!this.isInitializing) await getReasons()
    },
    getRosterById(id: number) {
      return this.rosters.find((roster) => roster.id === id)!
    },
    async saveDate(id: number, date: string) {
      await saveDate(id, date)
    },
    async saveTitle(id: number, title: string) {
      await saveTitle(id, title)
    },
    async updatePublished(id: number, published: boolean) {
      await updatePublished(id, published)
    },
    async updateArchived(id: number, published: boolean) {
      await updateArchived(id, published)
    },
    async saveRoster(id: number, unsavedRoster: Role[]) {
      await saveRoster(id, unsavedRoster)
    },
    async deleteRoster(id: number) {
      await deleteRoster(id)
    }
  }
})
