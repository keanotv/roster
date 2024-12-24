export const DEFAULT_TITLE = 'BCM Roster'

export const enum SCREEN_SIZE {
  SMALLER = 420,
  SMALL = 480,
  SMALL_MEDIUM = 600,
  MEDIUM = 900,
  MEDIUM_LARGE = 1024,
  LARGE = 1280
}

export const enum ROUTE_NAMES {
  HOME = 'home',
  LOGIN = 'login',
  NAME = 'name',
  LOGOUT = 'logout',
  ROSTER = 'roster',
  UNAVAILABILITY = 'unavailability',
  ADMIN = 'admin',
  DARK = 'dark',
  UNKNOWN = 'unknown'
}

export const enum ACTIONS {
  SAVE = 'save',
  COPY = 'copy',
  RESET = 'reset',
  DELETE = 'delete',
  DELETE_ROLE = 'delete role'
}

export const enum ADMIN_ROUTE_NAMES {
  PEOPLE = 'people',
  ROLES = 'roles',
  CONFIGURATION = 'configuration'
}

export const enum ROSTER_ROUTE_NAMES {
  NEW = 'new',
  VIEW = 'view',
  HISTORY = 'history'
}

export const enum UNAVAILABILITY_ROUTE_NAMES {
  VIEW = 'view'
}

export const SERVICE_NO_MAP = new Map<number,string>([
  [0, 'Error'],
  [1, '1st'],
  [2, '2nd'],
  [3, '3rd'],
  [4, '4th']
])

export const PROMPT_MAP = new Map<ACTIONS, string>([
  [
    ACTIONS.SAVE,
    "By clicking 'save', you will overwrite what has been saved in the database. Please remember to sync this roster if you plan to edit it on another device, unless you wish to use the version held on that device."
  ],
  [
    ACTIONS.COPY,
    "By clicking 'copy', you will create a copy of this roster in your current view."
  ],
  [
    ACTIONS.RESET,
    "By clicking 'reset', you will reset this roster to the version in the database."
  ],
  [
    ACTIONS.DELETE,
    "By clicking 'delete', you will delete this roster from the database and it will not be retrievable."
  ],
  [
    ACTIONS.DELETE_ROLE,
    "By clicking 'delete role', you will delete this role from the roster: "
  ]
])

export const path = (name: string) => {
  return '/' + name
}

export const hyphenate = (strings: string[]) => {
  return strings.join('-')
}

export const campDates = [
  {
    day: 'Tue',
    date: 11,
  },
  {
    day: 'Wed',
    date: 12,
  },
  {
    day: 'Thu',
    date: 13,
  },
  {
    day: 'Fri',
    date: 14,
  },
  {
    day: 'Sat',
    date: 15,
  },
]

export const enum LINKS {
  TELEGRAM = 'https://t.me/VarsityCamp2024',
  SERVING_FORM = 'https://vrsty.info/teams'
}