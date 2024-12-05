import {
  type ConfigRow,
  ConfigRowImpl,
  type PeopleInsert,
  type PeopleRow,
  type ReasonRow,
  type Role,
  type RoleTemplate,
  type RosterRowLocal,
  type UnavailabilityRow
} from '@/types/roster'
import {
  createNewRosterWithTitle,
  deleteRoster,
  getConfig,
  getPeople,
  getReasons,
  getRoles,
  getRosters,
  getUnavailability,
  saveDate,
  savePerson,
  saveRoster,
  saveTitle,
  updateArchived,
  updateConfig,
  updatePerson,
  updatePublished,
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
    config: new ConfigRowImpl(1, true),
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
        (new Date().getTime() - 60_000 > this.lastUpdated ||
          this.someDataIsEmpty()) &&
        userStore.isLoggedIn
      ) {
        this.lastUpdated = Date.now()
        if (!this.isInitializing) {
          this.isInitializing = true
          try {
            await Promise.all([
              getPeople(),
              getRoles(),
              getConfig(),
              getUnavailability(),
              getRosters(),
              getReasons()
            ])
          } catch (e) {
            // some error handling
          } finally {
            this.isInitializing = false
          }
        }
      }
    },
    clearStore() {
      this.people = []
      this.roles = []
      this.config = new ConfigRowImpl(1, true)
      this.unavailability = []
      this.reasons = []
      this.rosters = []
      this.unavailabilityByDate = new Map([])
      this.history = []
    },
    someDataIsEmpty() {
      return (
        !this.people.length ||
        !this.unavailability.length ||
        !this.rosters.length
      )
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
    async getReasons() {
      if (!this.isInitializing) await getReasons()
    },
    getRosterById(id: number) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
    async updateConfig(config: ConfigRow): Promise<boolean> {
      return await updateConfig(config)
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
