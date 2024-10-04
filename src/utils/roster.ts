import { useRosterStore } from '@/stores/roster'
import {
  type PeopleInsert,
  type PeopleRow,
  type Role,
  RoleImpl,
  type RoleInsert,
  type RoleRow,
  type RosterRow,
  ServiceImpl,
  type Slot
} from '@/types/roster'
import { supabase } from '@/utils/supabase'
import { useGlobalToast } from './toast'
import { getSundaysInNextTwoMonths } from './unavailability'
import { USER_ROLES, useUserStore } from '@/stores/user'

export const createNewRosterWithTitle = async (
  title: string
): Promise<RosterRow | null> => {
  const globalToast = useGlobalToast()
  if (title == null || !title.length) {
    globalToast.error('Please enter a title!')
    return null
  } else {
    let roster = await initializeNewRoster(title).then((roster) => {
      if (roster !== null && roster.id != 0) {
        globalToast.success('Created new roster!')
        return roster
      } else {
        return null
      }
    })
    return roster
  }
}

export const createNewRosterWithTitleAndRosterData = async (
  title: string,
  roster: string
): Promise<number | null> => {
  const globalToast = useGlobalToast()
  const { data, error } = await supabase
    .from('roster')
    .insert({
      title: title.concat(' Copy'),
      roster: roster
    })
    .select('id')
  if (error) {
    // some error handling
    return null
  } else {
    globalToast.success('Duplicated roster!')
    return data[0].id
  }
}

export const createNewRole = (): Role => {
  const rosterStore = useRosterStore()
  const services = [] as ServiceImpl[]
  for (let i = 0; i < rosterStore.services; i++) {
    const service = new ServiceImpl(i + 1, [
      {
        order: 0,
        segments: '',
        name: '',
        id: 0
      }
    ] as Slot[])
    services.push(service)
  }
  return new RoleImpl(0, services, '')
}

export const initializeNewRoster = async (
  title: string
): Promise<RosterRow | null> => {
  console.log('Saving new roster to db')
  const rosterStore = useRosterStore()
  const roles = [] as RoleImpl[]
  rosterStore.roles.forEach((defaultRole) => {
    const services = [] as ServiceImpl[]
    for (let i = 0; i < rosterStore.services; i++) {
      const service = new ServiceImpl(i + 1, [
        {
          order: 0,
          segments: '',
          name: '',
          id: 0
        }
      ] as Slot[])
      services.push(service)
    }
    const role = new RoleImpl(defaultRole.order, services, defaultRole.title)
    roles.push(role)
  })
  const { data, error } = await supabase
    .from('roster')
    .insert({
      title: title,
      roster: JSON.stringify(roles)
    })
    .select('*')
  if (error) {
    // some error handling
    return null
  } else {
    return data[0]
  }
}

export const getPeople = async () => {
  console.log('Fetching all people')
  const { data, error } = await supabase.from('people').select('*')
  if (error) {
    // some error handling
  } else {
    const rosterStore = useRosterStore()
    rosterStore.people = data
      ? data.sort(function (a, b) {
          return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
        })
      : []
  }
}

export const getRoles = async () => {
  console.log('Fetching all roles')
  const { data, error } = await supabase.from('role').select('*')
  if (error) {
    // some error handling
  } else {
    const rosterStore = useRosterStore()
    rosterStore.roles = data.sort((a, b) => a.order - b.order) ?? []
  }
}

export const getRosters = async () => {
  console.log('Fetching all rosters')
  const rosterStore = useRosterStore()
  const { data, error } = await supabase.from('roster').select('*')
  if (error) {
    // some error handling
  } else {
    const ids = data.map((row) => row.id)
    rosterStore.rosters = rosterStore.rosters.filter((roster) =>
      ids.includes(roster.id)
    )
    data.forEach((rosterRow) => {
      const index = rosterStore.rosters.findIndex(
        (roster) => roster.id === rosterRow.id
      )
      if (index !== -1) {
        rosterStore.rosters[index] = {
          ...rosterRow,
          unsavedRoster: rosterStore.rosters[index].unsavedRoster
        }
      } else {
        rosterStore.rosters.push({
          ...rosterRow,
          unsavedRoster: JSON.parse(rosterRow.roster!) as Role[]
        })
      }
    })
    rosterStore.rosters.sort(
      (a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()
    )
  }
}

export const getReasons = async () => {
  const userStore = useUserStore()
  if (userStore.role.some((role) => role === USER_ROLES.ADMIN)) {
    console.log('Fetching reasons for admin')
    const rosterStore = useRosterStore()
    const { data, error } = await supabase.from('reason').select('*')
    if (error) {
      // some error handling
    } else {
      rosterStore.reasons = data
    }
  }
}

export const getRosterById = async (id: number) => {
  console.log('Fetching roster by id')
  const { data, error } = await supabase
    .from('roster')
    .select('*')
    .eq('id', id)
    .limit(1)
  if (error) {
    // some error handling
  } else {
    const rosterStore = useRosterStore()
    if (data.length === 0) {
      rosterStore.rosters = rosterStore.rosters.filter(
        (roster) => roster.id !== id
      )
      const globalToast = useGlobalToast()
      globalToast.warning('Roster not found in database')
    } else {
      const index = rosterStore.rosters.findIndex(
        (roster) => roster.id === data[0].id
      )
      if (index !== -1) {
        rosterStore.rosters[index] = {
          ...data[0],
          unsavedRoster: rosterStore.rosters[index].unsavedRoster
        }
      } else {
        rosterStore.rosters.push({
          ...data[0],
          unsavedRoster: JSON.parse(data[0].roster!) as Role[]
        })
      }
    }
  }
}

export const getUnavailability = async () => {
  console.log('Fetching unavailabilities for this and next month')
  const now = new Date()
  const { data, error } = await supabase
    .from('unavailability')
    .select()
    .eq('year', now.getFullYear())
    .gte('month', now.getMonth() + 1)
  if (error) {
    // some error handling
  } else {
    const rosterStore = useRosterStore()
    rosterStore.unavailability = data
  }
  refreshUnavailabilityByDateList()
}

export const refreshUnavailabilityByDateList = () => {
  console.log('Refreshing unavailability by date list')
  const rosterStore = useRosterStore()
  const months = getSundaysInNextTwoMonths()
  rosterStore.unavailabilityByDate = [new Map<string, Set<number>>([])]
  months.forEach((month) => {
    month.days.forEach((dayOfMonth) => {
      const date = [
        month.year,
        month.month.toString().length === 1 ? '0' + month.month : month.month,
        dayOfMonth.toString().length === 1 ? '0' + dayOfMonth : dayOfMonth
      ].join('-')
      rosterStore.unavailabilityByDate[0].set(date, new Set<number>())
    })
  })
  rosterStore.unavailability.forEach((ua) => {
    ua.days.forEach((dayOfMonth) => {
      const date = [
        ua.year,
        ua.month.toString().length === 1 ? '0' + ua.month : ua.month,
        dayOfMonth.toString().length === 1 ? '0' + dayOfMonth : dayOfMonth
      ].join('-')
      rosterStore.unavailabilityByDate[0].get(date)?.add(ua.people_id)
    })
  })
}

export const saveDate = async (id: number, date: string) => {
  console.log('Saving new date')
  const { error } = await supabase
    .from('roster')
    .update({
      date: date
    })
    .eq('id', id)
  const globalToast = useGlobalToast()
  if (error) {
    // some error handling
  } else {
    if (!date.length) {
      globalToast.success('Saved empty date')
    } else {
      globalToast.success('Saved updated date')
    }
  }
}

export const saveTitle = async (id: number, title: string) => {
  console.log('Saving new title')
  const globalToast = useGlobalToast()
  if (title === null || !title.length) {
    globalToast.error('Title cannot be empty!')
  } else {
    const { error } = await supabase
      .from('roster')
      .update({
        title: title
      })
      .eq('id', id)
    if (error) {
      // some error handling
    } else {
      globalToast.success('Saved updated title')
    }
  }
}

export const updatePublished = async (id: number, published: boolean) => {
  console.log('Changing live flag')
  const { error } = await supabase
    .from('roster')
    .update({
      published: published
    })
    .eq('id', id)
  const globalToast = useGlobalToast()
  if (error) {
    // some error handling
  } else {
    if (published) {
      globalToast.success('Roster is live!')
    } else {
      globalToast.success('Roster is not live')
    }
  }
}

export const updateArchived = async (id: number, archived: boolean) => {
  console.log('Changing live flag')
  const { error } = await supabase
    .from('roster')
    .update({
      archived: archived
    })
    .eq('id', id)
  const globalToast = useGlobalToast()
  if (error) {
    // some error handling
  } else {
    if (archived) {
      globalToast.success('Roster is archived!')
    } else {
      globalToast.success('Roster is unarchived')
    }
  }
}

export const saveRoster = async (id: number, unsavedRoster: Role[]) => {
  console.log('Saving roster')
  const { error } = await supabase
    .from('roster')
    .update({
      roster: JSON.stringify(unsavedRoster)
    })
    .eq('id', id)
  const globalToast = useGlobalToast()
  if (error) {
    // some error handling
  } else {
    globalToast.success('Saved updated roster!')
    const rosterStore = useRosterStore()
    const roster = rosterStore.rosters.find((roster) => roster.id === id)
    if (roster != undefined) {
      roster.roster = JSON.stringify(unsavedRoster)
    }
  }
}

export const deleteRoster = async (id: number) => {
  console.log('Deleting roster')
  const { error } = await supabase.from('roster').delete().eq('id', id)
  const globalToast = useGlobalToast()
  if (error) {
    // some error handling
  } else {
    globalToast.success('Deleted roster!')
    const rosterStore = useRosterStore()
    rosterStore.rosters = rosterStore.rosters.filter(
      (roster) => roster.id !== id
    )
  }
}

export const updatePerson = async (
  person: PeopleRow,
  newName: string
): Promise<boolean> => {
  console.log('Updating person')
  const { error } = await supabase
    .from('people')
    .update({
      ...person,
      name: newName.length ? newName : person.name
    })
    .eq('id', person.id)
  const globalToast = useGlobalToast()
  if (error) {
    // some error handling
    globalToast.error('Error updating person :(')
    return false
  } else {
    globalToast.success('Update successful!')
    const rosterStore = useRosterStore()

    rosterStore.people = rosterStore.people.filter(
      (people) => people.id !== person.id
    )
    rosterStore.people.push(person)
    rosterStore.people.sort(function (a, b) {
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
    })
    return true
  }
}

export const savePerson = async (
  person: PeopleInsert,
  newName: string
): Promise<boolean> => {
  console.log('Saving person')
  const { error } = await supabase.from('people').insert({
    ...person,
    name: newName
  })
  const globalToast = useGlobalToast()
  if (error) {
    // some error handling
    globalToast.error('Error adding new member :(')
    return false
  } else {
    globalToast.success('Added new member!')
    const rosterStore = useRosterStore()
    rosterStore.getPeople()
    return true
  }
}

export const updateRole = async (
  role: RoleRow,
  newTitle: string
): Promise<boolean> => {
  console.log('Updating role')
  const { error } = await supabase
    .from('role')
    .update({
      ...role,
      title: newTitle.length ? newTitle : role.title
    })
    .eq('id', role.id)
  const globalToast = useGlobalToast()
  if (error) {
    // some error handling
    globalToast.error('Error updating role :(')
    return false
  } else {
    globalToast.success('Update successful!')
    const rosterStore = useRosterStore()

    rosterStore.roles = rosterStore.roles.filter(
      (role) => role.id !== role.id
    )
    rosterStore.roles.push(role)
    rosterStore.roles.sort(function (a, b) {
      return a.title < b.title ? -1 : a.title > b.title ? 1 : 0
    })
    return true
  }
}

export const saveRole = async (
  role: RoleInsert,
  newTitle: string
): Promise<boolean> => {
  console.log('Saving role')
  const { error } = await supabase.from('role').insert({
    ...role,
    title: newTitle
  })
  const globalToast = useGlobalToast()
  if (error) {
    // some error handling
    globalToast.error('Error adding new role :(')
    return false
  } else {
    globalToast.success('Added new role!')
    const rosterStore = useRosterStore()
    rosterStore.getRoles()
    return true
  }
}