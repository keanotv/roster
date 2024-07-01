<script lang="ts">
import { SETTING_NAMES, useSettingsStore } from '@/stores/settings'
import { ref } from 'vue'

export default {
  props: {
    setting: String
  },
  setup(props) {
    const settingsStore = useSettingsStore()
    const settingName = props.setting as keyof typeof SETTING_NAMES
    let settingValue = ref(settingsStore.getSettingFromName(settingName))
    function toggle() {
      settingValue.value = !settingValue.value
      settingsStore.setSettingValueWithName(settingValue.value, settingName)
    }
    return {
      settingsStore,
      settingName,
      settingValue,
      toggle
    }
  }
}
</script>

<template>
  <div class="settings-toggle">
    <template v-if="!settingValue">
      <line-md:switch-off-filled-to-switch-filled-transition
        @click="toggle"
        class="icon switch-off w-11 h-11"
      />
    </template>
    <template v-else>
      <line-md:switch-filled-to-switch-off-filled-transition
        @click="toggle"
        class="icon switch-on w-11 h-11"
      />
    </template>
    <template
      v-if="
        settingsStore.getSettingFromName(settingName) !==
        settingsStore.getOriginalSettingFromName(settingName)
      "
    >
      <line-md:downloading-loop class="icon changed-icon" />
    </template>
  </div>
</template>

<style>
.settings-toggle {
  bottom: 11px;
  opacity: 0.8;
}

.icon {
  display: inline-block;
}

.switch-on {
  color: var(--color-green);
}

.switch-off {
  color: var(--color-orange);
}

.changed-icon {
  margin-bottom: 1px;
  margin-left: 4px;
}
</style>
