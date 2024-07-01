import { createApp } from 'vue'
import { provideAppToast } from './utils/toast'
import 'vue-toastification/dist/index.css'
import 'assets/toast.css'

import App from './App.vue'
import router from './router'
import pinia from '@/plugins/pinia'

const app = createApp(App)

// vue-toastification
import { POSITION, type PluginOptions } from 'vue-toastification'
const options: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  transition: 'Vue-Toastification__fade',
  maxToasts: 3,
  pauseOnHover: false,
  pauseOnFocusLoss: false,
  timeout: 5000
}
app.use(provideAppToast, options)

app.use(pinia)
app.use(router)

app.mount('#app')
