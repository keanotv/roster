<script setup lang="ts">
import Roster from '@/components/roster/Roster.vue';

defineProps<{
  id: string
}>()
</script>

<template>
  <div class="my-8 mx-4">
    <h1 class="my-2 text-center">Roster (Edit)</h1>
    <Roster :id="Number.parseInt(id)" />
  </div>
</template>
