import type { Database } from '@/types/supabase'

type Tables = Database['public']['Tables']

// Static-ish tables
type PeopleTable = Tables['people']
export type PeopleRow = PeopleTable['Row']
export type PeopleInsert = PeopleTable['Insert']

type RolesTable = Tables['roles']
export type RolesRow = RolesTable['Row']

// Fluid tables
type RosterTable = Tables['roster']
export type RosterRow = RosterTable['Row']
export type RosterInsert = RosterTable['Insert']
export interface RosterRowLocal extends RosterRow {
  unsavedRoster: Role[] | null
}

type UnavailabilityTable = Tables['unavailability']
export type UnavailabilityRow = UnavailabilityTable['Row']
export type UnavailabilityInsert = UnavailabilityTable['Insert']

type ReasonTable = Tables['reason']
export type ReasonRow = ReasonTable['Row']
export type ReasonInsert = ReasonTable['Insert']

export type RoleTemplate = {
  order: number
  title: string
}

export type Role = {
  order: number
  title: string
  services: Service[]
}

export type Service = {
  no: number
  slot: Slot[]
}

export type Slot = {
  order: number
  segments: string
  name: string
  id: number
}

export class RoleImpl implements Role {
  order: number
  services: ServiceImpl[]
  title: string
  constructor(order: number, services: ServiceImpl[], title: string) {
    this.order = order
    this.services = services
    this.title = title
  }
}

export class ServiceImpl implements Service {
  no: number
  slot: SlotImpl[]
  constructor(no: number, slot: SlotImpl[]) {
    this.no = no
    this.slot = slot
  }
}

export class SlotImpl implements Slot {
  order: number
  segments: string
  name: string
  id: number
  constructor(order?: number) {
    this.order = order || 0
    this.segments = ''
    this.name = ''
    this.id = 0
  }
}