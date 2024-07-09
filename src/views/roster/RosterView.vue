<script setup lang="ts">
import Roster from '@/components/roster/Roster.vue';

defineProps<{
  id: string
}>()
</script>

<template>
  <main>
    <div class="m-4">
      <Roster :id="Number.parseInt(id)" />
    </div>
  </main>
</template>
