<script setup lang="ts">
import { useRosterStore } from '@/stores/roster'
import {
  getSundaysInNextTwoMonths,
  MONTHS
} from '@/utils/unavailability'
import { onMounted, ref } from 'vue'

const rosterStore = useRosterStore()
await Promise.all([
  rosterStore.getUnavailability(),
  rosterStore.getPeople(),
  rosterStore.getReasons()
])

const unavailabilities = ref([] as any[])

onMounted(() => {
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
})

const sundays = getSundaysInNextTwoMonths()
</script>

<template>
  <div id="unavailability" class="p-8 w-[100vw]">
    <h1 class="my-2 text-center">Unavailability</h1>
    <template v-for="sunday in sundays">
      <p class="text-lg font-bold m-1">
        {{ MONTHS[sunday.month - 1] }} {{ sunday.year }}
      </p>
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
            <BTh>Reason</BTh>
          </BTr>
        </BThead>
        <BTbody class="text-sm">
          <template v-for="unavailability in unavailabilities">
            <template
              v-if="
                sunday.year === unavailability.year &&
                sunday.month === unavailability.month
              "
            >
              <BTr>
                <BTd>
                  {{ unavailability.name }}
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
