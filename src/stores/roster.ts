import type {
  PeopleRow,
  UnavailabilityRow,
  RosterRowLocal,
  Role,
  ReasonRow,
  PeopleInsert,
  RoleTemplate
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
  updatePerson,
  saveRoster,
  saveTitle,
  updateArchived,
  updatePublished,
  savePerson,
  updateRoles
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
    roles: [] as RoleTemplate[],
    unavailability: [] as UnavailabilityRow[],
    reasons: [] as ReasonRow[],
    isInitializing: false,
    rosters: [] as RosterRowLocal[],
    unavailabilityByDate: new Map([]) as Map<string, Set<number>>,
    history: [] as Array<Array<string>>
  }),
  share: {
    omit: ['unavailabilityByDate', 'history']
  },
  actions: {
    async initializeRosterStore() {
      const userStore = useUserStore()
      if (
        (new Date().getTime() - 60_000 > this.lastUpdated || this.someDataIsEmpty())
        && userStore.isLoggedIn
      ) {
        this.lastUpdated = Date.now()
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
      this.unavailabilityByDate = new Map([])
      this.history = []
    },
    someDataIsEmpty() {
      return !this.people.length || !this.unavailability.length || !this.rosters.length;
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
    async getRoles() {
      if (!this.isInitializing) await getRoles()
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
    },
    async updatePerson(person: PeopleRow, newName: string): Promise<boolean> {
      return await updatePerson(person, newName)
    },
    async savePerson(person: PeopleInsert, newName: string): Promise<boolean> {
      return await savePerson(person, newName)
    },
    async updateRoles(roles: RoleTemplate[]): Promise<boolean> {
      return await updateRoles(roles)
    },
    crunchHistoryData() {
      const result = [] as Array<Array<string>>
      const dateToIdMap = new Map<string, Set<number>>()
      const now = new Date().getTime()
      const twelveWeeksAgo = new Date().getTime() - 7257600000
      this.rosters.forEach((rosterObj) => {
        if (
          rosterObj.date != null &&
          rosterObj.roster != null &&
          ((rosterObj.published &&
            new Date(rosterObj.date).getTime() > twelveWeeksAgo) ||
            new Date(rosterObj.date).getTime() > now)
        ) {
          const key = rosterObj.date + ' — ' + rosterObj.title
          dateToIdMap.set(key, new Set<number>())
          const idList = this.people.map((person) => person.id)
          const roster = JSON.parse(rosterObj.roster) as Role[]
          roster.forEach((role) => {
            role.services.forEach((slot) => {
              slot.slot.forEach((slot) => {
                if (idList.some((id) => id == slot.id)) {
                  dateToIdMap.get(key)?.add(slot.id)
                }
              })
            })
          })
        }
      })
      const idList = this.people.map((person) => person.id).reverse()
      dateToIdMap.forEach((idSet, key) => {
        idList.forEach((id) => {
          if (idSet.has(id)) {
            result.push([key, id.toString(), '1'])
          } else {
            result.push([key, id.toString(), '0'])
          }
        })
      })
      this.history = result
    }
  }
})
