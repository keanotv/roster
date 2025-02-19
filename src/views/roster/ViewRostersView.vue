<script setup lang="ts">
import { path, ROSTER_ROUTE_NAMES, ROUTE_NAMES } from '@/constants/constants'
import { useRosterStore } from '@/stores/roster'

const rosterStore = useRosterStore()
const viewPath = path(ROUTE_NAMES.ROSTER) + path(ROSTER_ROUTE_NAMES.VIEW)
</script>

<template>
  <div id="view-rosters" class="my-8 mx-4">
    <h1 class="my-3 text-center">Rosters</h1>
    <BTableSimple hover responsive class="min-w-[320px]">
      <colgroup>
        <col />
        <col />
        <col />
      </colgroup>
      <BThead>
        <BTr>
          <BTh>Title</BTh>
          <BTh class="date-table-header">Date</BTh>
          <BTh class="live-table-header">Live</BTh>
        </BTr>
      </BThead>
      <BTbody class="text-sm">
        <template
          v-for="roster in rosterStore.rosters.filter(
            (roster) => !roster.archived
          )"
        >
          <BTr>
            <BTd class="title underline underline-offset-2">
              <RouterLink :to="viewPath + path(roster.id.toString())">
                <div>
                  {{ roster.title }}
                </div>
              </RouterLink>
            </BTd>
            <BTd>{{ roster.date || '-' }}</BTd>
            <BTd>{{ roster.published ? 'Yes' : 'No' }}</BTd>
          </BTr>
        </template>
      </BTbody>
    </BTableSimple>
    <h1 class="mt-6 mb-3 text-center">Archived</h1>
    <BTableSimple hover responsive class="min-w-[320px]">
      <colgroup>
        <col />
        <col />
        <col />
      </colgroup>
      <BThead>
        <BTr>
          <BTh>Title</BTh>
          <BTh class="date-table-header">Date</BTh>
          <BTh class="live-table-header">Live</BTh>
        </BTr>
      </BThead>
      <BTbody class="text-sm">
        <template
          v-for="roster in rosterStore.rosters.filter((r) => r.archived)"
          :key="roster.id"
        >
          <BTr>
            <BTd class="title underline underline-offset-2">
              <RouterLink :to="viewPath + path(roster.id.toString())">
                {{ roster.title }}
              </RouterLink>
            </BTd>
            <BTd>{{ roster.date || '-' }}</BTd>
            <BTd>{{ roster.published ? 'Yes' : 'No' }}</BTd>
          </BTr>
        </template>
      </BTbody>
    </BTableSimple>
  </div>
</template>

<style scoped>
th {
  font-weight: bold;
}

#view-rosters {
  @media (min-width: 600px) {
    width: 540px;
  }
}

.date-table-header {
  width: 100px;
  @media (min-width: 600px) {
    width: 120px;
  }
}

.live-table-header {
  width: 48px;
  @media (min-width: 600px) {
    width: 80px;
  }
}
</style>
