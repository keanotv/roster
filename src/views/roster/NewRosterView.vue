<script setup lang="ts">
import { ref } from 'vue'
import { useRosterStore } from '@/stores/roster'
import router from '@/router'
import { path, ROSTER_ROUTE_NAMES, ROUTE_NAMES } from '@/constants/constants'

const title = ref('')
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
      <p class="mt-2">New Roster Title:</p>
      <BForm @submit.prevent="initializeRoster()">
        <BFormInput v-model.trim="title" :disabled="isLoading"/>
        <BButton type="submit" :disabled="isLoading">Submit</BButton>
      </BForm>
    </div>
  </main>
</template>
