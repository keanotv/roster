<script setup lang="ts">
import PublishedRoster from '@/components/roster/PublishedRoster.vue'
import { useRosterStore } from '@/stores/roster'
import { BTabs } from 'bootstrap-vue-next'
import { ref } from 'vue'
import Legend from '@/components/roster/Legend.vue'

const rosterStore = useRosterStore()
const seeAll = ref(false)
</script>

<template>
  <div id="home" class="my-8 mx-4">
    <h1 class="my-2 text-center">Rosters</h1>
    <div class="mb-4 flex place-content-center">
      <span class="mt-auto">Show all roles:</span>
      <div class="ml-2 text-xl"><BFormCheckbox v-model="seeAll" switch /></div>
    </div>
    <div class="flex place-content-start">
      <BTabs>
      <template
        v-for="publishedRoster in rosterStore.rosters.filter(
          (roster) => roster.published && !roster.archived
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
          <PublishedRoster
            :isFilteredByName="!seeAll"
            :roster="JSON.parse(publishedRoster.roster!)"
          />
        </BTab>
      </template>
    </BTabs>
    </div>
    <Legend class="mt-4" />
  </div>
</template>

<style>
@import 'assets/main.css';

#home {
  @media (min-width: 326px) {
    max-width: 326px;
  }

  @media (min-width: 489px) {
    max-width: 489px;
  }

  @media (min-width: 652px) {
    max-width: 652px;
  }

  @media (min-width: 815px) {
    max-width: 815px;
  }

  @media (min-width: 978px) {
    max-width: 978px;
  }
}
</style>
