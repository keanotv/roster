<template>
  <LoadingScreen :isLoading="isLoading" />
  <template v-if="!isLoading">
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
import { onMounted, ref } from 'vue'

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
const isLoading = ref(true)
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
  isLoading.value = false
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
