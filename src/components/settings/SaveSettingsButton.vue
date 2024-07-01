<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
const settingsStore = useSettingsStore()
</script>

<template>
  <div class="flex flex-row-reverse">
    <template v-if="settingsStore.getSettingsStateChanged">
      <button class="settings-changed save-settings-button p-2 rounded-md">
        Save & Apply
      </button>
    </template>
    <template v-else>
      <button class="save-settings-button p-2 rounded-md">Save & Apply</button>
    </template>
  </div>
</template>

<style>
.save-settings-button {
  border-width: 1px;
  border-color: var(--color-border);
  margin: 2rem 0rem;
}

.settings-changed {
  color: white;
  background: linear-gradient(
    90deg,
    var(--wavy-1),
    var(--wavy-2),
    var(--wavy-3),
    var(--wavy-2),
    var(--wavy-1)
  );
  background-size: 300%;
  animation: ani 8s linear infinite;
}

@keyframes ani {
  0% {
    background-position: 0%;
  }

  100% {
    background-position: 400%;
  }
}
</style>
