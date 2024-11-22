<script setup lang="ts">
import { useRosterStore } from '@/stores/roster'
import { useUnavailabilityStore } from '@/stores/unavailability'
import { USER_ROLES, useUserStore } from '@/stores/user'
import type { Sunday } from '@/types/unavailability'
import { MONTHS, getSundaysInNextMonth } from '@/utils/unavailability'
import { ref, watchEffect } from 'vue'

const rosterStore = useRosterStore()
const userStore = useUserStore()
const unavailableSundays = ref([] as Sunday[])
await rosterStore.getUnavailability()
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
    unavailableSundays.value[0],
    reason.value
  )
  isSubmitting.value = false
  confirmation.value = false
}

const today = new Date()
const isWithinCutOffDate = today.getDate() > 0 && today.getDate() < 16

const disabled = ref(false)
watchEffect(() => {
  disabled.value = !isWithinCutOffDate && !userStore.role.some(role => role === USER_ROLES.ADMIN)
  updateUnavailableSundays()
})
</script>

<template>
  <div id="unavailable-dates" class="p-8 w-[100vw]">
    <h1 class="my-2 text-center">Unavailable Dates</h1>
    <div class="my-4">
      <p>
        Hello, <b>{{ unavailabilityStore.selectedPersonName }}</b
        >!
      </p>
      <p class="my-2">
        Let us know which Sundays you are not available to serve in the month of
        {{ MONTHS[sundays[0].month - 1] }} by
        <u
          >15th
          {{
            MONTHS[sundays[0].month - 2] !== undefined
              ? MONTHS[sundays[0].month - 2]
              : MONTHS[11]
          }}!</u
        >
      </p>
      <p>Thank you for serving! 😊</p>
    </div>
    <template v-for="(sunday, index) in sundays" :key="index">
      <p class="text-lg font-bold mb-1">
        {{ MONTHS[sunday.month - 1] }} {{ sunday.year }}
      </p>
      <BFormCheckboxGroup
        :id="index.toString()"
        v-model="unavailableSundays[index].days"
        :options="sunday.days"
        :disabled="disabled"
        button-variant="outline-dark"
        size="lg"
        buttons
      >
      </BFormCheckboxGroup>
      <template v-if="!disabled">
        <p class="mt-2 text-sm">Reason:</p>
        <BFormInput
          v-model="reason"
          :disabled="
            !unavailableSundays[index].days.length || disabled
          "
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
        <BButton
          @click.prevent="confirmation = true"
          :disabled="isSubmitting || disabled"
          class="mt-2"
          :pressed="false"
          variant="outline-success"
          >Submit</BButton
        >
      </template>
      <template v-else>
        <p class="text-xs my-3 text-orange-500">Past cut-off date for submission! Please let Chanel or Flynn know if you would like to change unavailable dates.</p>
      </template>
    </template>
    <BModal centered no-footer no-header v-model="confirmation">
      <p>
        Thank you for serving, {{ unavailabilityStore.selectedPersonName }}!
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
      <div class="mt-4 flex justify-between">
        <BButton
          @click.prevent="submitUnavailability"
          variant="outline-primary"
          class="capitalize"
          >Submit</BButton
        >
        <BButton @click.prevent="confirmation = false" variant="outline-secondary">Cancel</BButton>
      </div>
    </BModal>
  </div>
</template>

<style scoped>
#unavailable-dates {
  @media (min-width: 900px) {
    width: 900px;
  }
}
</style>
