<script setup lang="ts">
import PublishedRoster from '@/components/roster/PublishedRoster.vue'
import { useRosterStore } from '@/stores/roster'
import { BTabs } from 'bootstrap-vue-next'

const rosterStore = useRosterStore()
</script>

<template>
  <div class="my-8 mx-4">
    <h1 class="my-2 text-center">Rosters</h1>
    <BTabs>
      <template
        v-for="publishedRoster in rosterStore.rosters.filter(
          (roster) => roster.published
        )"
        :key="publishedRoster.id"
      >
        <BTab lazy>
          <template #title>
            {{
              new Date(publishedRoster.date!).toLocaleDateString('en-SG', {
                dateStyle: 'medium'
              })
            }}
          </template>
          <PublishedRoster :roster="JSON.parse(publishedRoster.roster!)" />
        </BTab>
      </template>
    </BTabs>
  </div>
</template>

<style>
@import 'assets/main.css';
</style>
