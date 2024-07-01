<script setup lang="ts">
defineProps<{
  height: number
  up: boolean
}>()
</script>

<template>
  <template v-if="up">
    <div :style="`height: ${height}px;`" class="shadow-up"></div>
  </template>
  <template v-else>
    <div :style="`height: ${height}px;`" class="shadow-down"></div>
  </template>
</template>

<style scoped>
.shadow-down {
  width: 100%;
  margin-bottom: 1rem;
  background: linear-gradient(to bottom,
      black 0%,
      rgb(0 0 0 / 0.25) 1%,
      rgb(0 0 0 / 0) 100%);
}

.shadow-up {
  width: 100%;
  margin-top: 1rem;
  background: linear-gradient(to top,
      black 0%,
      rgb(0 0 0 / 0.25) 1%,
      rgb(0 0 0 / 0) 100%);
}
</style>