<script setup lang="ts">
import { ref } from 'vue'
import { useRosterStore } from '@/stores/roster'
import router from '@/router'
import { path, ROSTER_ROUTE_NAMES, ROUTE_NAMES } from '@/constants/constants'

const title = ref('')
const date = ref('')
const isLoading = ref(false)

const rosterStore = useRosterStore()

const initializeRoster = async () => {
  isLoading.value = true
  const id = await rosterStore.createNewRosterWithTitle(title.value)
  isLoading.value = false
  if (id > 0) {
    router.push(
      path(ROUTE_NAMES.ROSTER) +
        path(ROSTER_ROUTE_NAMES.VIEW) +
        path(id.toString())
    )
  }
}
</script>

<template>
  <main>
    <div class="m-8">
      <h1>Create New Roster</h1>
      <BForm @submit.prevent="initializeRoster()">
        <BInputGroup class="mt-4 mb-2" prepend="Title">
          <BFormInput v-model.trim="title" :disabled="isLoading" placeholder="e.g. 23 June 2024 draft"/>
        </BInputGroup>
        <BButton type="submit" :disabled="isLoading">Create</BButton>
      </BForm>
    </div>
  </main>
</template>
