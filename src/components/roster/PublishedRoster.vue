<script setup lang="ts">
import { SERVICE_NO_MAP } from '@/constants/constants'
import { useRosterStore } from '@/stores/roster';
import { Role } from '@/types/roster'
import { onMounted, ref } from 'vue';

const props = defineProps<{
  roster: Role[]
}>()

const rosterStore = useRosterStore()
const personToRoleOrderMap = ref(new Map<number, Set<number>>())
rosterStore.people.forEach(person => {
  personToRoleOrderMap.value.set(person.id, new Set<number>())
})
props.roster.forEach(role => {
  role.services.forEach(service => {
    service.slot.forEach(slot => {
      personToRoleOrderMap.value.get(slot.id)?.add(role.order)
    })
  })
})
</script>

<template>
  <div>
    <BContainer>
      <BRow>
        <template v-for="role in roster" :key="role.title">
          <BCol class="min-w-[150px]">
            <BCard class="p-0 h-100">
              <BCardBody class="p-0">
                <BCardTitle class="text-center">
                  <p class="font-bold text-lg">{{ role.title }}</p>
                </BCardTitle>
                <div class="service-grid text-sm">
                  <template v-for="service in role.services">
                    <p class="font-bold">{{ SERVICE_NO_MAP.get(service.no) }}</p>
                    <div>
                      <BListGroup class="inline">
                        <template v-for="slot in service.slot">
                          <BListGroupItem class="py-0.5 px-1.5"
                            :variant="personToRoleOrderMap.get(slot.id) !== undefined && personToRoleOrderMap.get(slot.id)!.size > 1 ? 'warning' : 'primary'"
                          >
                            <p>
                              {{ slot.segments ? slot.segments + ': ' : '' }}
                              {{ slot.name ? slot.name : '-' }}
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
