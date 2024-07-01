<script setup lang="ts">
defineProps<{
  isLoading: boolean
}>()
</script>

<template>
  <div class="flex justify-center place-items-center" :class="{ loader: true, fadeout: !isLoading }">
    <line-md:sunny-outline-twotone class="mb-20 h-[15%] w-[15%]"/>
  </div>
</template>

<style scoped>
.loader {
  z-index: 1000;
  background-color: var(--color-background);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  overflow: hidden;
  position: fixed;
}

.fadeout {
  animation: fadeout 0.5s forwards;
  animation-delay: 0.5s;
}

@keyframes fadeout {
  to {
    opacity: 0;
    visibility: hidden;
  }
}
</style>