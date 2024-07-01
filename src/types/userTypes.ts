declare module 'user-types' {
  export type TelegramUser = {
    id: string
    first_name: string
    username: string
    photo_url: string
    auth_date: string
    hash: string
  }

  export interface User {
    id: string
    supabaseUuid: string
    firstName: string
    username: string
    photoUrl: string
    authDate: string
    isLoggedIn: boolean
  }
}
