<script setup lang="ts">
import PublishedRoster from '@/components/roster/PublishedRoster.vue'
import { useRosterStore } from '@/stores/roster'
import { BTabs } from 'bootstrap-vue-next'
import { ref } from 'vue'
import LegendTable from '@/components/roster/LegendTable.vue'

const rosterStore = useRosterStore()
const seeAllRoles = ref(false)
const seeRolesOptions = [
  { text: 'My Role', value: false },
  { text: 'All Roles', value: true }
]

const scrollView = ref(false)
const viewOptions = [
  { text: 'Tabs', value: false },
  { text: 'Scroll', value: true }
]
</script>

<template>
  <div id="home" class="my-8 mx-4">
    <h1 class="my-2 text-center">Rosters</h1>
    <template
      v-if="
        rosterStore.rosters.some(
          (roster) => roster.published && !roster.archived
        )
      "
    >
      <div class="my-3 flex gap-2 place-content-center">
        <BFormRadioGroup
          v-model="seeAllRoles"
          :options="seeRolesOptions"
          button-variant="outline-secondary"
          buttons
          size="sm"
        />
        <BFormRadioGroup
          v-model="scrollView"
          :options="viewOptions"
          button-variant="outline-secondary"
          buttons
          size="sm"
        />
      </div>
    </template>
    <template v-else>
      <div class="my-4 flex place-content-center">
        <p>There are no rosters available now</p>
      </div>
    </template>
    <template v-if="!scrollView">
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
              :isFilteredByName="!seeAllRoles"
              :roster="JSON.parse(publishedRoster.roster!)"
            />
          </BTab>
        </template>
      </BTabs>
    </template>
    <template v-else>
      <template
        v-for="publishedRoster in rosterStore.rosters.filter(
          (roster) => roster.published && !roster.archived
        )"
        :key="publishedRoster.id"
      >
        <p class="ml-1 mb-1 mt-4 text-lg">
          {{
            new Date(publishedRoster.date!).toLocaleDateString('en-SG', {
              dateStyle: 'long'
            })
          }}
        </p>
        <PublishedRoster
          :isFilteredByName="!seeAllRoles"
          :roster="JSON.parse(publishedRoster.roster!)"
        />
      </template>
    </template>
    <LegendTable class="mt-4" />
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
