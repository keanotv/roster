<script setup lang="ts">
import { useRosterStore } from '@/stores/roster.ts'

const rosterStore = useRosterStore()
</script>

<template>
  <div id="configurations" class="py-8 px-4 w-[100vw]">
    <h1 class="my-3 text-center">Configuration</h1>
    <div class="mt-8">
      <hr class="my-4" />
      <div class="flex justify-content-between">
        <span class="font-bold">Close unavailability form after 15th:</span>
        <BFormCheckbox
          v-model="rosterStore.config[0].isAutomaticCutOff"
          switch
          @click="
            rosterStore.updateConfig({
              ...rosterStore.config[0],
              isAutomaticCutOff: !rosterStore.config[0].isAutomaticCutOff
            })
          "
        />
      </div>
      <template v-if="rosterStore.config[0].isAutomaticCutOff">
        <p class="my-1 text-orange-500">
          Servers cannot submit/change unavailable dates after 15th
        </p>
      </template>
      <template v-else>
        <p class="my-1 text-green-500">
          Servers can submit/change unavailable dates after 15th
        </p>
      </template>
      <hr class="my-4" />
    </div>
  </div>
</template>

<style scoped>
#configurations {
  @media (min-width: 600px) {
    width: 600px;
  }
}
</style>
