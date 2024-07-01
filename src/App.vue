<template>
  <LoadingScreen :isLoading="isLoading" />
  <template v-if="settingsStore.screenWidth >= SCREEN_SIZE.MEDIUM_LARGE">
    <div></div>
  </template>
  <RouterView v-slot="{ Component }">
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
  <template v-if="settingsStore.screenWidth >= SCREEN_SIZE.MEDIUM_LARGE">
    <div></div>
  </template>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'

import { useSettingsStore } from './stores/settings'
import { SCREEN_SIZE } from './constants/constants'
import LoadingScreen from './components/loaders/LoadingScreen.vue';

const settingsStore = useSettingsStore()
const isLoading = ref(true)
onMounted(() => {
  settingsStore.applyDarkMode()
  function getWidth() {
    settingsStore.screenWidth = window.innerWidth
  }
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
