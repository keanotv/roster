import { sendError, supabase, type SettingsUpdate } from './supabase'
import { useUserStore } from '@/stores/user'
import { useSettingsStore } from '@/stores/settings'
import { useGlobalToast } from './toast'

export const initializeUserSettings = async () => {
  const userStore = useUserStore()
  const settingsStore = useSettingsStore()
  const userId = userStore.user.supabaseUuid
  if (userId) {
    const timestamp = new Date().toISOString().toLocaleString()
    const { error } = await supabase.from('settings').insert({
      bot_notifications: false,
      light_mode_default: true,
      user_id: userId,
      updated_at: timestamp
    })
    if (error) {
      sendError(error)
    } else {
      // rest are initialized as false
      settingsStore.settings.updatedAt = timestamp
      settingsStore.originalSettings.updatedAt = timestamp
    }
  }
}

export const getUserSettings = async () => {
  const { data, error } = await supabase.from('settings').select()
  const settingsStore = useSettingsStore()
  if (error) {
    sendError(error)
  } else if (data.length) {
    settingsStore.loadSettingsToStore(data[0])
    settingsStore.applySettings()
  } else {
    // settings initialized on user sign up in supabase
    // should not come here
    setTimeout(() => initializeUserSettings(), 500)
    sendError(
      'User setting was initialized. Check if something went wrong in supabase.'
    )
  }
}

export const saveSettings = async (updatedSettings: SettingsUpdate) => {
  const globalToast = useGlobalToast()
  const userStore = useUserStore()
  const { error } = await supabase
    .from('settings')
    .update(updatedSettings)
    .eq('user_id', userStore.user.supabaseUuid)
  let success = false
  if (error) {
    sendError(error)
    globalToast.error('Error saving settings :(')
  } else {
    success = true
    globalToast.success('Settings have been updated')
  }
  return success
}
