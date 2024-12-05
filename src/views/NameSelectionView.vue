<script setup lang="ts">
import { useRosterStore } from '@/stores/roster'
import { useUnavailabilityStore } from '@/stores/unavailability'
import { ref } from 'vue'

const rosterStore = useRosterStore()
await rosterStore.getPeople()
const unavailabilityStore = useUnavailabilityStore()
const show = ref(false)
const nameSearch = ref(unavailabilityStore.selectedPersonName)

const focusInput = () => {
  setTimeout(() => {
    const el = document.getElementById('nameSearch') as HTMLInputElement | null
    if (el) {
      el.focus()
      el.click()
    }
  }, 77)
  show.value = true
}

const blurInput = () => {
  setTimeout(() => {
    document.getElementById('nameSearch')?.blur()
    show.value = false
  }, 100)
}
</script>

<template>
  <div id="name-selection" class="p-8 w-[100vw]">
    <h1 class="my-2 text-center">What is your name?</h1>
    <p class="mt-8 text-justify">
      Select your name using the drop-down list below (click on your name in the
      drop-down)
    </p>
    <div class="mt-3 w-40" @click="focusInput">
      <BDropdown
        :variant="
          !unavailabilityStore.selectedPersonId
            ? 'outline-danger'
            : 'outline-success'
        "
        lazy
        no-animation
        no-flip
        v-model="show"
        :text="unavailabilityStore.selectedPersonName"
        unmount-lazy
        toggle-class="text-lg"
      >
        <template #button-content>Name</template>
        <BDropdownHeader>
          <BInput
            placeholder="Name"
            id="nameSearch"
            v-model="nameSearch"
            @click.prevent="(e: MouseEvent) => e.stopPropagation()"
          />
        </BDropdownHeader>
        <template
          v-for="person in rosterStore.people.filter(
            (p) =>
              p.active &&
              p.server &&
              p.name
                .toLowerCase()
                .split(' ')
                .some((subname) =>
                  nameSearch
                    .toLowerCase()
                    .split(' ')
                    .some((subnamesearch) => subname.startsWith(subnamesearch))
                )
          )"
          :key="person.id"
        >
          <BDropdownItem
            @click.prevent="
              () => {
                blurInput()
                nameSearch = person.name
                unavailabilityStore.selectPerson(person.id, person.name)
              }
            "
            >{{ person.name }}
          </BDropdownItem>
        </template>
      </BDropdown>
    </div>
  </div>
</template>

<style scoped>
#name-selection {
  @media (min-width: 400px) {
    width: 400px;
  }
}
</style>
