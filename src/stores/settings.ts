import { toggleDark } from '@/composables/useDark'
import { saveSettings } from '@/utils/settings'
import type { SettingsRow, SettingsUpdate } from '@/utils/supabase'
import { defineStore } from 'pinia'

export const enum SETTING_NAMES {
  botNotifications = 'botNotifications',
  lightModeDefault = 'lightModeDefault'
}

export const useSettingsStore = defineStore({
  id: 'settings',
  persist: true,
  state: () => ({
    settings: {
      botNotifications: false,
      lightModeDefault: true,
      updatedAt: ''
    },
    originalSettings: {
      botNotifications: false,
      lightModeDefault: true,
      updatedAt: ''
    },
    screenWidth: window.innerWidth,
    currentDarkMode: false
  }),
  getters: {
    getSettingsStateChanged: (state) =>
      JSON.stringify(state.settings) !== JSON.stringify(state.originalSettings)
  },
  actions: {
    loadSettingsToStore(data: SettingsRow) {
      // set current
      this.settings.botNotifications = data.bot_notifications!
      this.settings.lightModeDefault = data.light_mode_default!
      this.settings.updatedAt = data.updated_at!
      // set original for comparison
      this.originalSettings.botNotifications = data.bot_notifications!
      this.originalSettings.lightModeDefault = data.light_mode_default!
      this.originalSettings.updatedAt = data.updated_at!
    },
    getSettingFromName(settingName: keyof typeof SETTING_NAMES) {
      return this.settings[settingName]
    },
    getOriginalSettingFromName(settingName: keyof typeof SETTING_NAMES) {
      return this.originalSettings[settingName]
    },
    setSettingValueWithName(
      value: boolean,
      settingName: keyof typeof SETTING_NAMES
    ) {
      this.settings[settingName] = value
    },
    saveChanges() {
      if (!this.getSettingsStateChanged) {
        // do nothing
        return
      } else {
        const timestamp = new Date().toISOString().toLocaleString()
        const updatedSettings: SettingsUpdate = {
          bot_notifications: this.settings.botNotifications,
          light_mode_default: this.settings.lightModeDefault,
          updated_at: timestamp
        }
        this.applySettings()
        saveSettings(updatedSettings).then((success) => {
          if (success) {
            // set updated timestamp to now
            this.settings.updatedAt = timestamp
            this.originalSettings.botNotifications =
              this.settings.botNotifications
            this.originalSettings.lightModeDefault =
              this.settings.lightModeDefault
            this.originalSettings.updatedAt = this.settings.updatedAt
          }
        })
      }
    },
    applySettings() {
      toggleDark(!this.settings.lightModeDefault)
      this.currentDarkMode = this.settings.lightModeDefault
    },
    toggleDarkMode() {
      this.currentDarkMode = !this.currentDarkMode
      toggleDark(this.currentDarkMode)
    },
    applyDarkMode() {
      toggleDark(this.currentDarkMode)
    }
  }
})
