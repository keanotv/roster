<script setup lang="ts">
defineProps<{
  title: string
  stream: string
  speakers: string
  description: string
  location: string
  index: number
}>()
</script>

<template>
  <div class="masterclass my-4 p-2 rounded-lg">
    <h1 class="m-1"><b>{{ title }}</b></h1>
    <hr>
    <p class="m-1 text-sm">Speaker(s): {{ speakers }}</p>
    <p class="m-1 text-sm">Location: <i>{{ location }}</i></p>
    <hr>
    <div class="text-sm text-justify">
      <div class="m-1">
        <div v-html="description"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
textarea {
  resize: none;
}

hr {
  border-color: var(--color-border);
  opacity: 0.3;
}

.masterclass {
  border: solid 1px;
  border-color: var(--color-border);
}
</style>