import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

const install = (app: App) => {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedState)
  app.use(pinia)
}

export default install
