<script setup lang="ts">
import History from '@/components/roster/History.vue'
import { useRosterStore } from '@/stores/roster'

const rosterStore = useRosterStore()

const refreshData = () => {
  rosterStore.crunchHistoryData()
  location.reload()
}
</script>

<template>
  <div id="history" class="my-8 mx-2">
    <h1 class="my-2 text-center">Roster History</h1>
    <div class="my-4 mx-4">
      <p>
        This visualization is generated based on rosters which match the
        following criteria:
      </p>
      <div class="my-2">
        <p><b>Historical, actual</b></p>
        <p><mdi:dot class="w-7 h-7 inline" />Roster date > 6 weeks ago</p>
        <p><mdi:dot class="w-7 h-7 inline" />Roster is published</p>
      </div>
      <div class="my-2">
        <p><b>Planned, tentative</b></p>
        <p><mdi:dot class="w-7 h-7 inline" />Roster date is in the future</p>
        <p><mdi:dot class="w-7 h-7 inline" />Need not be published</p>
      </div>
      <BButton
        @click.prevent="refreshData"
        class="mt-2"
        variant="success"
        >Load/Refresh Data</BButton
      >
    </div>
    <History />
  </div>
</template>

<style>
#history {
  @media (min-width: 480px) {
    width: 480px;
  }
}
</style>
