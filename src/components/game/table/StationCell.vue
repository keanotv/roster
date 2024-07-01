<script setup lang="ts">
defineProps<{
  letter: string
}>()
</script>

<template>
  <td rowspan="3" :class="{
    sage: letter === 'E' || letter === 'F',
    brown: letter === 'A' || letter === 'B',
    teal: letter === 'C' || letter === 'D',
  }">
    <p>Station {{ letter }}</p>
    <p>Ballroom</p>
  </td>
</template>

<style scoped>
.sage {
  background-color: var(--color-sage-transparent);
}

.brown {
  background-color: var(--color-brown-transparent-table);
}

.teal {
  background-color: var(--color-teal-transparent);
}

td>p {
  font-weight: bold;
}
</style>