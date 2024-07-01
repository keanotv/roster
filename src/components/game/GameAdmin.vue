<script setup lang="ts">
import CountdownSetter from '@/components/game/CountdownSetter.vue'
import GameAnswers from '@/components/game/GameAnswers.vue'
import TrainingScheduleAdjuster from '@/components/game/TrainingScheduleAdjuster.vue'
</script>

<template>
  <div class="flex justify-center">
    <p class="mt-8 mb-4 font-bold text-2xl">ADMIN VIEW</p>
  </div>
  <CountdownSetter />
  <TrainingScheduleAdjuster />
  <hr>
  <GameAnswers />
</template>

<style scoped>
.file-nav-grid {
  display: grid;
  grid-template-columns: 3fr 1fr 3fr;
}

hr {
  border-color: var(--color-text);
  margin: 1rem auto;
}

img {
  filter: sepia(100%) saturate(35%) brightness(100%) hue-rotate(5deg);
}
</style>