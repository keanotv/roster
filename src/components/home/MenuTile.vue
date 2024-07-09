<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings';
import { USER_ROLES, useUserStore } from '@/stores/user';
import { ROUTE_NAMES, SCREEN_SIZE } from '@/constants/constants';
import type { MenuMetaData } from '@/types/types'

defineProps<{
  data: MenuMetaData
  index: number
}>()

const userStore = useUserStore()
const settingsStore = useSettingsStore()
</script>

<template>
  <template v-if="!data.redirect || data.wip">
    <component
      :is="(data.wip && userStore.user.role.some(role => role !== USER_ROLES.ADMIN) || data.route === ROUTE_NAMES.DARK) ? 'span' : 'router-link'"
      :to="data.route">
      <div :class="{
        blank: true,
        disabled: data.wip || data.title === ' ',
        default: index % 4 === 1 && data.title.length,
        primary: index % 4 === 2 && data.title.length,
        secondary: index % 4 === 3 && data.title.length,
        tertiary: index % 4 === 0 && data.title.length,
      }" @click="() => {
        if (data.route === ROUTE_NAMES.DARK) settingsStore.toggleDarkMode()
      }">
        <div class="tile">
          <h1 class="title">{{ data.title }}</h1>
          <p>{{ data.wip ? ' (coming soon)' : '' }}</p>
        </div>
        <span class="icon" v-html="data.icon"></span>
      </div>
    </component>
  </template>
  <template v-else>
    <a :href="data.route" target="_blank" rel="noopener noreferrer">
      <div :class="{
        blank: true,
        default: index % 4 === 1 && data.title.length,
        primary: index % 4 === 2 && data.title.length,
        secondary: index % 4 === 3 && data.title.length,
        tertiary: index % 4 === 0 && data.title.length,
      }">
        <div class="tile">
          <h1 class="title">{{ data.title }}</h1>
          <p>{{ data.wip ? ' (coming soon)' : '' }}</p>
          <template v-if="data.image !== undefined && settingsStore.screenWidth > SCREEN_SIZE.SMALL_MEDIUM">
            <div class="img-container flex h-[65%] justify-center place-items-center">
              <img :src="data.image" class="h-32">
            </div>
          </template>
        </div>
        <span class="icon" v-html="data.icon"></span>
      </div>
    </a>
  </template>
</template>

<style scoped>
.img-container {
  z-index: 100;
  opacity: 0%;
  transition: opacity 1s;
}

.img-container:hover {
  @media (min-height: 600px) {
    opacity: 100%;
  }
}

.blank {
  color: var(--color-text);
}

.default {
  color: var(--color-teal);
  background-color: var(--color-sage-transparent);
}

.primary {
  color: var(--color-orange);
  background-color: var(--color-brown-transparent);
}

.secondary {
  color: var(--color-sage);
  background-color: var(--color-orange-transparent);
}

.tertiary {
  color: var(--color-brown);
  background-color: var(--color-teal-transparent);
}

.disabled {
  color: var(--color-text);
  background-color: rgba(29, 35, 61, 0.5);
}

.tile {
  height: 33.33vh;
  min-height: 150px;
  padding: 0.5rem;
}

.title {
  font-size: 2rem;
  font-weight: bold;
}

span.icon {
  position: absolute;
  bottom: 1rem;
  right: 0.5rem;
}
</style>
