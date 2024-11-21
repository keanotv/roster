import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import { PiniaSharedState } from 'pinia-shared-state'

const install = (app: App) => {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedState)
  pinia.use(PiniaSharedState({
    enable: true,
    initialize: true
  }))
  app.use(pinia)
}

export default install
