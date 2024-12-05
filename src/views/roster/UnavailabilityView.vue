<script setup lang="ts">
import { useRosterStore } from '@/stores/roster'
import {
  getSundaysInNextMonth,
  getSundaysInNextTwoMonths,
  getSundaysInTheMonthOf,
  MONTHS
} from '@/utils/unavailability'
import { onMounted, ref, watchEffect } from 'vue'
import type { PeopleRow } from '@/types/roster.ts'
import type { Month, Sunday } from '@/types/unavailability.ts'
import { useUnavailabilityStore } from '@/stores/unavailability.ts'

const rosterStore = useRosterStore()
await Promise.all([
  rosterStore.getUnavailability(),
  rosterStore.getPeople(),
  rosterStore.getReasons()
])

const editPerson = ref(false)
const selectedPerson = ref({} as PeopleRow)
const unavailabilities = ref([] as any[])
const nameSearch = ref('')
const show = ref([false, false])

const refreshUnavailabilities = () => {
  unavailabilities.value = rosterStore.unavailability.map((unavailability) => {
    const person = rosterStore.people.find(
      (person) => person.id === unavailability.people_id
    )
    const reason = rosterStore.reasons.find(
      (reason) =>
        reason.people_id === unavailability.people_id &&
        reason.year === unavailability.year &&
        reason.month === unavailability.month
    )?.text
    if (person !== undefined) {
      return {
        name: person.name,
        people_id: person.id,
        year: unavailability.year,
        month: unavailability.month,
        days: unavailability.days,
        reason
      }
    }
  })
  unavailabilities.value = unavailabilities.value.sort(function (a, b) {
    return a?.name < b?.name ? -1 : a?.name > b?.name ? 1 : 0
  })
}

onMounted(() => {
  refreshUnavailabilities()
})

const sundays = ref([getSundaysInNextMonth()])
const selectedMonth = ref({} as Month)
const sundaysInNextTwoMonths = getSundaysInNextTwoMonths()
const unavailableSundays = ref([] as Sunday[])
const updatedUnavailableSundays = ref([] as Sunday[])
const originalReason = ref('')
const updatedReason = ref('')
const unavailabilityStore = useUnavailabilityStore()
const updateUnavailableSundays = () => {
  if (selectedPerson.value != undefined) {
    sundays.value = [
      getSundaysInTheMonthOf(
        selectedMonth.value.month,
        selectedMonth.value.year
      )
    ]
    unavailableSundays.value =
      unavailabilityStore.getUnavailableSundaysForIdInTheMonthOf(
        selectedPerson.value.id,
        selectedMonth.value
      )
    if (unavailableSundays.value.length) {
      updatedUnavailableSundays.value = [
        {
          year: selectedMonth.value.year,
          month: selectedMonth.value.month,
          days: [...unavailableSundays.value[0].days]
        }
      ]
    } else {
      unavailableSundays.value.push({
        year: selectedMonth.value.year,
        month: selectedMonth.value.month,
        days: []
      })
      updatedUnavailableSundays.value.push({
        year: selectedMonth.value.year,
        month: selectedMonth.value.month,
        days: []
      })
    }
    originalReason.value =
      rosterStore.reasons.find(
        (reason) =>
          reason.people_id === selectedPerson.value.id &&
          reason.year === selectedMonth.value.year &&
          reason.month === selectedMonth.value.month
      )?.text ?? ''
    updatedReason.value = originalReason.value
  }
}

const handleUpdate = async () => {
  updatedUnavailableSundays.value[0].days.sort((a, b) => a - b)
  const success = await unavailabilityStore.submitUnavailability(
    updatedUnavailableSundays.value[0],
    updatedReason.value,
    selectedPerson.value.id
  )
  if (success) {
    await rosterStore.getReasons()
    refreshUnavailabilities()
    editPerson.value = false
    selectedPerson.value = {} as PeopleRow
  } else {
    editPerson.value = true
  }
}

watchEffect(() => {
  if (editPerson.value) {
    updateUnavailableSundays()
  }
})

const blurInput = (index: number) => {
  setTimeout(() => {
    document.getElementById('nameSearch')?.blur()
    show.value[index] = false
  }, 100)
}

const focusInput = () => {
  setTimeout(() => {
    const el = document.getElementById('nameSearch') as HTMLInputElement | null
    if (el) {
      el.focus()
      el.click()
    }
  }, 77)
}
</script>

<template>
  <div id="unavailability" class="p-8 w-[100vw]">
    <h1 class="my-2 text-center">Unavailability</h1>
    <template v-for="(sunday, index) in sundaysInNextTwoMonths" :key="index">
      <div class="flex gap-2">
        <p class="text-lg font-bold m-1">
          {{ MONTHS[sunday.month - 1] }} {{ sunday.year }}
        </p>
        <div class="mb-1" @click="focusInput">
          <BDropdown
            v-model="show[index]"
            :text="unavailabilityStore.selectedPersonName"
            :variant="
              !unavailabilityStore.selectedPersonId
                ? 'outline-danger'
                : 'outline-success'
            "
            lazy
            no-animation
            no-flip
            unmount-lazy
          >
            <template #button-content>Name</template>
            <BDropdownHeader>
              <BInput
                id="nameSearch"
                v-model="nameSearch"
                placeholder="Name"
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
                        .some((subnamesearch) =>
                          subname.startsWith(subnamesearch)
                        )
                    )
              )"
              :key="person.id"
            >
              <BDropdownItem
                @click.prevent="
                  () => {
                    blurInput(index)
                    editPerson = true
                    selectedMonth = { month: sunday.month, year: sunday.year }
                    selectedPerson = rosterStore.people.find(
                      (p) => p.id === person.id
                    )!
                    nameSearch = ''
                  }
                "
                >{{ person.name }}
              </BDropdownItem>
            </template>
          </BDropdown>
        </div>
      </div>
      <BTableSimple hover small responsive>
        <colgroup>
          <col />
          <col />
          <col />
        </colgroup>
        <BThead>
          <BTr>
            <BTh class="w-20">Name</BTh>
            <BTh class="w-24">Date(s)</BTh>
            <BTh class="min-w-[120px]">Reason</BTh>
          </BTr>
        </BThead>
        <BTbody class="text-sm">
          <template
            v-for="(unavailability, index) in unavailabilities"
            :key="index"
          >
            <template
              v-if="
                sunday.year === unavailability.year &&
                sunday.month === unavailability.month
              "
            >
              <BTr>
                <BTd>
                  <a
                    class="title underline underline-offset-2"
                    @click.prevent="
                      () => {
                        selectedPerson = rosterStore.people.find(
                          (p) => p.id === unavailability.people_id
                        )!
                        selectedMonth = {
                          year: sunday.year,
                          month: sunday.month
                        }
                        editPerson = true
                      }
                    "
                    >{{ unavailability.name }}</a
                  >
                </BTd>
                <BTd>
                  {{ unavailability.days.join(', ') }}
                </BTd>
                <BTd>
                  <div class="reason-box">
                    {{ unavailability.reason ?? '-' }}
                  </div>
                </BTd>
              </BTr>
            </template>
          </template>
        </BTbody>
      </BTableSimple>
    </template>
  </div>
  <template v-if="editPerson && selectedPerson !== undefined">
    <BModal
      v-model="editPerson"
      centered
      no-close-on-backdrop
      no-footer
      no-header
    >
      <p>
        Currently editing for: <b>{{ selectedPerson.name }}</b>
      </p>
      <div class="my-3">
        <template v-for="(sunday, index) in sundays" :key="index">
          <p class="font-bold">
            {{ MONTHS[sunday.month - 1] }} {{ sunday.year }}
          </p>
          <BListGroup class="my-1">
            <BListGroupItem variant="secondary">
              <p><u>Original</u></p>
              <BFormCheckboxGroup
                v-model="unavailableSundays[index].days"
                :options="sunday.days"
                button-variant="outline-dark"
                buttons
                class="my-1"
                disabled
              >
              </BFormCheckboxGroup>
              <p class="mt-1">Reason: {{ originalReason }}</p>
            </BListGroupItem>
            <BListGroupItem>
              <p><u>Updated</u></p>
              <BFormCheckboxGroup
                v-model="updatedUnavailableSundays[index].days"
                :options="sunday.days"
                button-variant="outline-dark"
                buttons
                class="my-1"
              >
              </BFormCheckboxGroup>
              <div class="my-1">
                <p>Reason:</p>
                <BInput v-model="updatedReason"></BInput>
              </div>
            </BListGroupItem>
          </BListGroup>
        </template>
      </div>
      <div class="mt-2 flex justify-between">
        <BButton variant="outline-primary" @click.prevent="handleUpdate"
          >Save
        </BButton>
        <BButton
          variant="outline-secondary"
          @click.prevent="
            () => {
              editPerson = false
              selectedPerson = {} as PeopleRow
            }
          "
          >Cancel
        </BButton>
      </div>
    </BModal>
  </template>
</template>

<style scoped>
th {
  font-weight: bold;
}

.reason-box {
  overflow-x: scroll;

  @media (max-width: 600px) {
    max-width: 40vw;
  }
}

#unavailability {
  @media (min-width: 900px) {
    width: 900px;
  }
}
</style>
