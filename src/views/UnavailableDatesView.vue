<script setup lang="ts">
import { useRosterStore } from '@/stores/roster'
import { useUnavailabilityStore } from '@/stores/unavailability'
import type { Sunday } from '@/types/unavailability'
import { MONTHS, getSundaysInNextMonth } from '@/utils/unavailability'
import { ref } from 'vue'

const rosterStore = useRosterStore()

const show = ref(false)

const unavailableSundays = ref([] as Sunday[])
await Promise.all([rosterStore.getUnavailability(), rosterStore.getPeople()])
const unavailabilityStore = useUnavailabilityStore()
const updateUnavailableSundays = () => {
  unavailableSundays.value = unavailabilityStore.getUnavailableSundays()
}
updateUnavailableSundays()
const sundays = [getSundaysInNextMonth()]

const reason = ref('')

const isSubmitting = ref(false)
const confirmation = ref(false)

const submitUnavailability = async () => {
  isSubmitting.value = true
  await unavailabilityStore.submitUnavailability(
    unavailableSundays.value,
    reason.value
  )
  isSubmitting.value = false
  confirmation.value = false
}

const nameSearch = ref(unavailabilityStore.selectedPersonName)

const focusInput = () => {
  document.getElementById('nameSearch')?.focus()
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
  <div id="unavailable-dates" class="p-8 w-[100vw]">
    <h1 class="my-2 text-center">Unavailable Dates</h1>
    <div class="my-3 w-40" @click="focusInput">
      <BDropdown
        v-model="show"
        :text="unavailabilityStore.selectedPersonName"
        :variant="
          !unavailabilityStore.selectedPersonId ? 'outline-danger' : 'success'
        "
        toggle-class="text-lg"
      >
        <template
          v-for="person in rosterStore.people.filter(
            (person) =>
              person.active &&
              person.name
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
                reason = ''
                unavailabilityStore.selectPerson(person.id, person.name)
                updateUnavailableSundays()
              }
            "
            >{{ person.name }}</BDropdownItem
          >
        </template>
        <template #button-content>
          <BInput
            placeholder="Name"
            id="nameSearch"
            class="inline-block w-28 h-10 mr-1.5"
            v-model="nameSearch"
          />
        </template>
      </BDropdown>
    </div>
    <template v-if="unavailabilityStore.selectedPersonId === 0">
      Please select your name using the drop-down list above.
    </template>
    <template v-else>
      <template v-for="(sunday, index) in sundays" :key="index">
        <p class="text-lg font-bold mb-1">
          {{ MONTHS[sunday.month - 1] }} {{ sunday.year }}
        </p>
        <BFormCheckboxGroup
          :id="index.toString()"
          v-model="unavailableSundays[index].days"
          :options="sunday.days"
          button-variant="outline-dark"
          size="lg"
          buttons
        >
        </BFormCheckboxGroup>
        <p class="mt-2 text-sm">Reason:</p>
        <BFormInput
          v-model="reason"
          :disabled="!unavailableSundays[index].days.length"
          :placeholder="
            !unavailableSundays[index].days.length
              ? 'Not required'
              : unavailableSundays[index].reason
              ? 'Not required as already submitted'
              : 'Not submitted yet'
          "
        />
        <template v-if="unavailableSundays[index].reason && reason.length"
          ><span class="text-xs text-orange-500"
            >*overwriting previously submitted reason</span
          ></template
        >
        <template
          v-else-if="
            !unavailableSundays[index].reason &&
            unavailableSundays[index].days.length &&
            !reason.length
          "
        >
          <span class="text-xs text-orange-500">*please enter reason</span>
        </template>
        <br />
      </template>
      <BButton
        @click.prevent="confirmation = true"
        :disabled="isSubmitting"
        class="mt-2"
        :pressed="false"
        variant="success"
        >Submit</BButton
      >
      <BModal centered hide-footer hide-header v-model="confirmation">
        <p>
          Hello <b>{{ unavailabilityStore.selectedPersonName }}</b
          >!
        </p>
        <hr class="my-2" />
        <p class="text-justify">
          Unavailable dates in {{ MONTHS[sundays[0].month - 1] }}:
          {{
            unavailableSundays[0].days.length
              ? unavailableSundays[0].days.sort((a, b) => a - b).join(', ')
              : 'None'
          }}
        </p>
        <p>
          Reason:
          {{
            !unavailableSundays[0].days.length
              ? 'N/A'
              : reason.length
              ? reason
              : unavailableSundays[0].reason
              ? '(already submitted)'
              : '(reason not provided)'
          }}
        </p>
        <hr class="my-2" />
        <p>Thank you for serving 😊</p>
        <div class="mt-4 flex justify-between">
          <BButton
            @click.prevent="submitUnavailability"
            variant="primary"
            class="capitalize"
            >Submit</BButton
          >
          <BButton @click.prevent="confirmation = false">Cancel</BButton>
        </div>
      </BModal>
    </template>
  </div>
</template>

<style scoped>
#unavailable-dates {
  @media (min-width: 900px) {
    width: 800px;
  }
}
</style>
