import { toggleDark } from '@/composables/useDark'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore({
  id: 'settings',
  persist: true,
  state: () => ({
    screenWidth: window.innerWidth,
    currentDarkMode: false
  }),
  actions: {
    toggleDarkMode() {
      this.currentDarkMode = !this.currentDarkMode
      toggleDark(this.currentDarkMode)
    },
    applyDarkMode() {
      toggleDark(this.currentDarkMode)
    }
  }
})
