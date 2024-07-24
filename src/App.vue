<template>
  <LoadingScreen :isLoading="isLoading" />
  <template v-if="!isLoading">
    <MenuToggle />
    <div class="flex justify-center">
      <Suspense>
        <RouterView v-slot="{ Component }">
          <KeepAlive>
            <component :is="Component" />
          </KeepAlive>
        </RouterView>
      </Suspense>
    </div>
  </template>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'

import { useSettingsStore } from './stores/settings'
import LoadingScreen from './components/loaders/LoadingScreen.vue'
import MenuToggle from '@/components/common/MenuToggle.vue'
import { useRosterStore } from './stores/roster'

const settingsStore = useSettingsStore()
const isLoading = ref(true)
const rosterStore = useRosterStore()
onMounted(() => {
  rosterStore.initializeRosterStore()
  settingsStore.applyDarkMode()
  function getWidth() {
    settingsStore.screenWidth = window.innerWidth
  }
  window.removeEventListener('resize', getWidth)
  window.addEventListener('resize', getWidth)
  isLoading.value = false
})
</script>

<style scoped>
@import 'assets/main.css';

@font-face {
  font-family: PPMori;
  src: url('@/assets/PPMori-Regular.otf'), url('@/assets/PPMori-SemiBold.otf');
}
</style>
