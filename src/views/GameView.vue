<script setup lang="ts">
import GameRules from '@/components/game/GameRules.vue'
</script>

<template>
  <main>
    <div class="game-rules">
      <GameRules />
    </div>
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');

.game-rules {
  font-family: 'Space Mono';
}

img {
  max-height: 33vh;
  max-width: 80vw;
  height: auto;
  width: auto;
}
</style>