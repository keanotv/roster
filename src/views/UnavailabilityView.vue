<script setup lang="ts">
import { useRosterStore } from '@/stores/roster'
import { useUnavailabilityStore } from '@/stores/unavailability'
import type { Sunday } from '@/types/unavailability'
import { MONTHS, getSundaysInNextThreeMonths } from '@/utils/unavailability'
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
const sundays = ref(getSundaysInNextThreeMonths())

const reasons = ref(['', '', ''])

const isSubmitting = ref(false)
const submitUnavailability = async () => {
  isSubmitting.value = true
  await unavailabilityStore.submitUnavailability(
    unavailableSundays.value,
    reasons.value
  )
  isSubmitting.value = false
}
</script>

<template>
  <main>
    <div class="m-8">
      <div>
        <h1>Unavailable Dates</h1>
      </div>
      <div class="my-3">
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
              (person) => person.active
            )"
            :key="person.id"
          >
            <BDropdownItem
              @click.prevent="
                () => {
                  unavailabilityStore.selectPerson(person.id, person.name)
                  updateUnavailableSundays()
                }
              "
              >{{ person.name }}</BDropdownItem
            >
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
            v-model="reasons[index]"
            :disabled="!unavailableSundays[index].days.length"
            :placeholder="
              !unavailableSundays[index].days.length
                ? 'Not required'
                : unavailableSundays[index].reason
                ? 'Not required as already submitted'
                : 'Not submitted yet'
            "
          />
          <template
            v-if="unavailableSundays[index].reason && reasons[index].length"
            ><span class="text-xs text-orange-500"
              >*overwriting previously submitted reason</span
            ></template
          >
          <template
            v-else-if="
              !unavailableSundays[index].reason &&
              unavailableSundays[index].days.length &&
              !reasons[index].length
            "
          >
            <span class="text-xs text-orange-500">*please enter reason</span>
          </template>
          <br />
        </template>
        <p class="text-justify">
          Thank you for serving, <b>{{ unavailabilityStore.selectedPersonName }}</b> 😊 <br />
          Please double check before submitting!
        </p>
        <BButton
          @click.prevent="submitUnavailability"
          :disabled="isSubmitting"
          class="mt-2"
          :pressed="false"
          variant="success"
          >Submit</BButton
        >
      </template>
    </div>
  </main>
</template>
