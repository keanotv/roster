export const DEFAULT_TITLE = 'V Camp 2024'

export const enum PASSWORDS {
  YOUTH = 'eternity',
  ADMIN = 'admin',
  GAME = 'game'
}

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
  SETTINGS = 'settings',
  LOGOUT = 'logout',
  GAME = 'game',
  GAME_ADMIN = 'gameadmin',
  PROGRAM = 'program',
  PACKING = 'packing',
  MASTERCLASS = 'masterclass',
  DARK = 'dark',
  UNKNOWN = 'unknown'
}

export const path = (name: string) => {
  return '/' + name
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