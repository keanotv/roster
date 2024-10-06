<script setup lang="ts">
import History from '@/components/roster/History.vue';
</script>

<template>
  <div id="history" class="my-8 mx-2">
    <h1 class="my-2 text-center">Roster History</h1>
    <div class="my-4 mx-4">
      <p>This visualization is generated using based on rosters which match the following criteria:</p>
      <div class="my-2">
        <p><b>Historical (past), actual (published)</b></p>
        <p><mdi:dot class="w-7 h-7 inline"/>Roster date > 6 weeks ago</p>
        <p><mdi:dot class="w-7 h-7 inline"/>Roster is published</p>
      </div>
      <div class="my-2">
        <p><b>Planned (future), tentative</b></p>
        <p><mdi:dot class="w-7 h-7 inline"/>Roster date is in the future</p>
        <p><mdi:dot class="w-7 h-7 inline"/>Need not be published</p>
      </div>
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