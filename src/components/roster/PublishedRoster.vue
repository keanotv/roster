<script setup lang="ts">
import { SERVICE_NO_MAP } from '@/constants/constants'
import { useRosterStore } from '@/stores/roster'
import { useUnavailabilityStore } from '@/stores/unavailability'
import type { Role } from '@/types/roster'
import { ref, watchEffect } from 'vue'

const props = defineProps<{
  isFilteredByName: boolean
  roster: Role[]
}>()

const rosterStore = useRosterStore()
const unavailabilityStore = useUnavailabilityStore()
const personToRoleOrderMap = ref(new Map<number, Set<number>>())
const filteredRoster = ref([] as Role[])

watchEffect(() => {
  rosterStore.people.forEach((person) => {
    personToRoleOrderMap.value.set(person.id, new Set<number>())
  })
  props.roster.forEach((role) => {
    role.services.forEach((service) => {
      service.slot.forEach((slot) => {
        personToRoleOrderMap.value.get(slot.id)?.add(role.order)
      })
    })
  })
  filteredRoster.value = props.roster.filter((role) =>
    role.services.some((service) =>
      service.slot.some(
        (slot) =>
          slot.name.toLowerCase().trim() ==
          unavailabilityStore.selectedPersonName.toLowerCase().trim()
      )
    )
  )
})
</script>

<template>
  <div class="min-w-[326px]">
    <BContainer>
      <BRow>
        <template v-if="isFilteredByName && filteredRoster.length == 0">
          <BCol>
            <BCard>
              <p class="text-center">You are not scheduled on this Sunday!</p>
            </BCard>
          </BCol>
        </template>
        <template
          v-for="role in isFilteredByName ? filteredRoster : roster"
          :key="role.title"
        >
          <BCol class="min-w-[163px] max-w-[163px]">
            <BCard
              style="margin-right: -1px; margin-bottom: -1px"
              class="p-0 h-100"
            >
              <BCardBody class="p-0">
                <BCardTitle class="text-center">
                  <p class="font-bold text-lg">{{ role.title }}</p>
                </BCardTitle>
                <div class="service-grid text-sm">
                  <template v-for="service in role.services" :key="service.no">
                    <p class="font-bold pt-0.5">
                      {{ SERVICE_NO_MAP.get(service.no) }}
                    </p>
                    <div>
                      <BListGroup class="inline">
                        <template v-for="slot in service.slot" :key="slot.no">
                          <BListGroupItem
                            class="py-0.5 px-1.5"
                            :variant="
                              slot.name == unavailabilityStore.selectedPersonName
                              ? personToRoleOrderMap.get(slot.id) !== undefined && personToRoleOrderMap.get(slot.id)!.size > 1
                              ? 'danger'
                              : 'primary'
                              : 'outline-secondary'
                            "
                          >
                            <p>
                              {{
                                slot.segments && slot.name
                                  ? slot.segments + ': ' + slot.name
                                  : slot.segments && !slot.name
                                  ? slot.segments
                                  : slot.name
                                  ? slot.name
                                  : '-'
                              }}
                              <!-- {{ slot.name ? slot.name : '-' }} -->
                            </p>
                          </BListGroupItem>
                        </template>
                      </BListGroup>
                    </div>
                  </template>
                </div>
              </BCardBody>
            </BCard>
          </BCol>
        </template>
      </BRow>
    </BContainer>
  </div>
</template>

<style>
.service-grid {
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 0.25rem;
}
</style>
