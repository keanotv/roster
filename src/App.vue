<template>
  <LoadingScreen :isLoading="rosterStore.isInitializing" />
  <template v-if="!rosterStore.isInitializing">
    <template
      v-if="userStore.isLoggedIn && unavailabilityStore.selectedPersonName"
    >
      <MenuToggle />
    </template>
    <main>
      <div class="grid place-content-center">
        <Suspense>
          <RouterView v-slot="{ Component }">
            <KeepAlive>
              <component :is="Component" />
            </KeepAlive>
          </RouterView>
        </Suspense>
      </div>
    </main>
  </template>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'

import { useSettingsStore } from './stores/settings'
import LoadingScreen from './components/loaders/LoadingScreen.vue'
import MenuToggle from '@/components/common/MenuToggle.vue'
import { useRosterStore } from './stores/roster'
import { useUserStore } from './stores/user'
import { useUnavailabilityStore } from './stores/unavailability'

const settingsStore = useSettingsStore()
const rosterStore = useRosterStore()
const userStore = useUserStore()
const unavailabilityStore = useUnavailabilityStore()
settingsStore.applyDarkMode()
onMounted(async () => {
  await rosterStore.initializeRosterStore()
  function getWidth() {
    settingsStore.screenWidth = window.innerWidth
  }
  window.removeEventListener('resize', getWidth)
  window.addEventListener('resize', getWidth)
  window.onfocus = async () => {
    if (userStore.isLoggedIn) {
      await userStore.refreshToken()
    }
  }
})
</script>

<style scoped>
@import 'assets/main.css';

@font-face {
  font-family: Satoshi;
  src: url('@/assets/Satoshi-Variable.ttf'),
    url('@/assets/Satoshi-VariableItalic.ttf');
}
</style>
