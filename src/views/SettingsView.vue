<script setup lang="ts">
import SettingsToggle from '@/components/settings/SettingsToggle.vue'
import LogoutButton from '@/components/settings/LogoutButton.vue'
import SaveSettingsButton from '@/components/settings/SaveSettingsButton.vue'
import TooltipItem from '@/components/common/TooltipItem.vue'
import { useUserStore } from '@/stores/user'
import { SETTING_NAMES, useSettingsStore } from '@/stores/settings'
import { useTimeAgo } from '@vueuse/core'

const userStore = useUserStore()

const settingsStore = useSettingsStore()
</script>

<template>
  <main>
    <div class="settings m-8">
      <div class="centered-container header">
        <line-md:account class="icon w-8 h-8" />Settings
      </div>
      <div class="flex py-4">
        <div class="mr-6">
          <div class="row">
            <line-md:telegram class="icon" />Telegram Handle
          </div>
          <div class="row">
            <line-md:bell-twotone class="icon" />Bot Notifications
            <TooltipItem>
              <template #text>Send daily updates of new submissions to your telegram account
                (beta)
              </template>
            </TooltipItem>
          </div>
          <div class="row">
            <line-md:sunny-outline-twotone class="icon" />Light Mode Default
          </div>
        </div>
        <div>
          <div class="row">
            <span>@{{ userStore.user.username }}</span>
          </div>
          <div class="row">
            <SettingsToggle :setting="SETTING_NAMES.botNotifications" />
          </div>
          <div class="row">
            <SettingsToggle :setting="SETTING_NAMES.lightModeDefault" />
          </div>
        </div>
      </div>
      <template v-if="!settingsStore.getSettingsStateChanged">
        <span class="prompt">Last updated:
          {{ useTimeAgo(settingsStore.settings.updatedAt).value }}</span>
      </template>
      <template v-else>
        <span class="prompt">Click 'Save & Apply' to save changes</span>
      </template>
    </div>
    <div class="flex">
      <div class="w-1/2 mx-8">
        <LogoutButton />
      </div>
      <div class="w-1/2 mx-8">
        <SaveSettingsButton @click="settingsStore.saveChanges()" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.row {
  /* top, left right, bottom */
  margin: 1.5rem 0.25rem 1.5rem;
  height: 2rem;
}

span {
  color: var(--vt-c-text-highlight);
}

.centered-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.header {
  font-size: 1.2rem;
  font-weight: 500;
}

.icon {
  margin-right: 0.75rem;
  display: inline-block;
}

.row>.icon {
  bottom: 2px;
}
</style>
