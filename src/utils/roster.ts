import { useRosterStore } from '@/stores/roster'
import {
  type Role,
  RoleImpl,
  type RosterRow,
  ServiceImpl,
  type Slot
} from '@/types/roster'
import { supabase } from '@/utils/supabase'
import { useGlobalToast } from './toast'
import { getSundaysInNextThreeMonths } from './unavailability'

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
        globalToast.success('Create new roster success!')
        return roster
      } else {
        return null
      }
    })
    return roster
  }
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
    const ids = data.map(row => row.id)
    rosterStore.rosters = rosterStore.rosters.filter(roster => ids.includes(roster.id))
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
  }
}

export const getRosterById = async (id: number) => {
  console.log('Fetching roster by id')
  const globalToast = useGlobalToast()
  const { data, error } = await supabase.from('roster').select('*').eq('id', id)
  if (error) {
    // some error handling
  } else {
    const rosterStore = useRosterStore()
    if (data.length === 0) {
      rosterStore.rosters = rosterStore.rosters.filter(roster => roster.id !== id)
      globalToast.warning('Roster not found in database')
    }
    data.forEach(rosterRow => {
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
  }
}

export const getUnavailability = async () => {
  console.log('Fetching unavailabilities for 3 months')
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
  const sundays = getSundaysInNextThreeMonths()
  rosterStore.unavailabilityByDate = [new Map<string, Set<number>>([])]
  sundays.forEach((month) => {
    month.days.forEach(dayOfMonth => {
      const date = [
        month.year,
        month.month.toString().length === 1 ? '0' + month.month : month.month,
        dayOfMonth.toString().length === 1 ? '0' + dayOfMonth : dayOfMonth
      ].join('-')
      rosterStore.unavailabilityByDate[0].set(date, new Set<number>)
    })
  })
  rosterStore.unavailability.forEach(ua => {
    ua.days.forEach(dayOfMonth => {
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
  console.log('Changing publish flag')
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