<script setup lang="ts">
import {
  ACTIONS,
  path,
  PROMPT_MAP,
  ROSTER_ROUTE_NAMES,
  ROUTE_NAMES,
  SERVICE_NO_MAP
} from '@/constants/constants'
import router from '@/router'
import { useRosterStore } from '@/stores/roster'
import { SlotImpl } from '@/types/roster'
import { createNewRole, createNewRosterWithTitleAndRosterData, getRosterById, refreshUnavailabilityByDateList } from '@/utils/roster'
import { onMounted, ref, watchEffect } from 'vue'
const props = defineProps<{
  id: number
}>()

const rosterStore = useRosterStore()
if (!rosterStore.unavailability.length || !rosterStore.people.length) {
  await rosterStore.getUnavailability()
  await rosterStore.getPeople()
} else if (
  !rosterStore.unavailabilityByDate.length ||
  !!rosterStore.unavailabilityByDate[0]
) {
  refreshUnavailabilityByDateList()
}
const roster = ref(rosterStore.getRosterById(props.id))
const previousDate = ref('')
if (roster.value !== undefined) {
  previousDate.value = roster.value.date || ''
}

const confirmation = ref(false)
const action = ref(ACTIONS.SAVE)
const prompt = ref('')
const roleActionedOnOrder = ref(-1)

const handleAddNewRole = () => {
  roster.value.unsavedRoster?.push(createNewRole(roster.value.unsavedRoster!.length + 1))
}

const rosterAction = async () => {
  switch (action.value) {
    case ACTIONS.SAVE:
      if (roster.value.unsavedRoster != null) {
        await rosterStore.saveRoster(
          roster.value.id,
          roster.value.unsavedRoster
        )
      }
      break
    case ACTIONS.COPY:
    if (roster.value.unsavedRoster != null) {
        await createNewRosterWithTitleAndRosterData(
          roster.value.title,
          JSON.stringify(roster.value.unsavedRoster)
        ).then((id) => {
          if (id !== null) {
            router.push(path(ROUTE_NAMES.ROSTER) + path(ROSTER_ROUTE_NAMES.VIEW) + path(id.toString()))
          }
        })
      }
      break
    case ACTIONS.SYNC:
      await getRosterById(roster.value.id).then(() => {
        if (roster.value.roster !== null) {
          roster.value.unsavedRoster = JSON.parse(roster.value.roster)
        }
      })
      break
    case ACTIONS.DELETE:
      await rosterStore.deleteRoster(roster.value.id).then(() => {
        router.push(path(ROUTE_NAMES.ROSTER) + path(ROSTER_ROUTE_NAMES.VIEW))
      })
      break
    case ACTIONS.DELETE_ROLE:
      roster.value.unsavedRoster = roster.value.unsavedRoster!.filter(role => role.order != roleActionedOnOrder.value)
      roleActionedOnOrder.value = -1
      resetOrder()
      break
    default:
      console.log('Action not found for ' + action.value)
      break
  }
  confirmation.value = false
}

const personToRoleOrderMap = ref(new Map<number, Set<number>>())
onMounted(() => {
  rosterStore.people.forEach(person => {
    personToRoleOrderMap.value.set(person.id, new Set<number>())
  })
  roster.value.unsavedRoster?.forEach(role => {
    role.services.forEach(service => {
      service.slot.forEach(slot => {
        personToRoleOrderMap.value.get(slot.id)?.add(role.order)
      })
    })
  })
})
const addRoleOrderToPersonMap = (id: number, order: number) => {
  personToRoleOrderMap.value.get(id)?.add(order)
}

const removeRoleOrderFromPersonMap = (id: number, order: number) => {
  personToRoleOrderMap.value.get(id)?.delete(order)
}

const resetOrder = () => {
  let order = 1
  roster.value.unsavedRoster?.forEach(role => {
    role.order = order
    order++
  })
}

watchEffect(async () => {
  if (roster.value.id !== props.id) {
    roster.value = rosterStore.getRosterById(props.id)
    personToRoleOrderMap.value = new Map<number, Set<number>>()
      rosterStore.people.forEach(person => {
    personToRoleOrderMap.value.set(person.id, new Set<number>())
  })
  roster.value.unsavedRoster?.forEach(role => {
    role.services.forEach(service => {
      service.slot.forEach(slot => {
        personToRoleOrderMap.value.get(slot.id)?.add(role.order)
      })
    })
  })
  }
})
</script>

<template>
  <div>
    <template v-if="roster !== undefined && roster.roster !== null">
      <BContainer style="--bs-gutter-x: 0" class="mb-3">
        <BInputGroup prepend="Title">
          <BInput
            v-model="roster.title"
            @change="
              (e) => {
                rosterStore.saveTitle(roster.id, e.target.value)
              }
            "
          />
        </BInputGroup>
        <div class="my-2 flex">
          <div>
            <BInputGroup prepend="Date">
              <BFormInput
                @blur="
                  (e) => {
                    if (previousDate != e.target.value) {
                      rosterStore.saveDate(roster.id, e.target.value || '')
                      previousDate = e.target.value
                    }
                  }
                "
                v-model="roster.date"
                type="date"
              />
              <template #append>
                <BInputGroupText>
                  <div @click="() => {
                    if (previousDate != '') {
                      roster.date = ''
                      rosterStore.saveDate(roster.id, roster.date)
                      previousDate = ''
                    }
                  }">
                    <mdi:clear-outline />
                  </div>
                </BInputGroupText>
              </template>
            </BInputGroup>
          </div>
        </div>
        <div class="my-3 flex justify-between">
            <div class="flex place-items-center">
              <span class="ml-1 mr-2 font-bold text-sm">LIVE</span>
              <BFormCheckbox
                class="mb-1"
                v-model="roster.published"
                :disabled="roster.date === null"
                switch
                @click="rosterStore.updatePublished(roster.id, !roster.published)"
              />
            </div>
            <div class="flex place-items-center">
              <span class="ml-3 mr-2 font-bold text-sm">ARCHIVE</span>
              <BFormCheckbox
                class="mb-1"
                v-model="roster.archived"
                switch
                @click="rosterStore.updateArchived(roster.id, !roster.archived)"
              />
            </div>
        </div>
        <div class="my-2">
          <BButtonToolbar class="justify-between">
            <div>
              <BButtonGroup>
                <BButton
                  class="capitalize"
                  @click.prevent="
                  () => {
                    action = ACTIONS.SAVE
                    prompt = PROMPT_MAP.get(action)!
                    confirmation = true
                  }
                "
                  variant="success"
                  >{{ ACTIONS.SAVE }}</BButton
                >
              </BButtonGroup>
              <BButtonGroup class="mx-2">
                <BButton
                  class="capitalize"
                  @click.prevent="
                  () => {
                    action = ACTIONS.COPY
                    prompt = PROMPT_MAP.get(action)!
                    confirmation = true
                  }
                "
                  variant="primary"
                  >{{ ACTIONS.COPY }}</BButton
                >
              </BButtonGroup>
            </div>
            <div>
              <BButtonGroup class="mx-2">
                <BButton
                  class="capitalize"
                  @click.prevent="
                  () => {
                    action = ACTIONS.SYNC
                    prompt = PROMPT_MAP.get(action)!
                    confirmation = true
                  }
                "
                  variant="warning"
                  >{{ ACTIONS.SYNC }}</BButton
                >
              </BButtonGroup>
              <BButtonGroup>
                <BButton
                  class="capitalize"
                  @click.prevent="
                  () => {
                    action = ACTIONS.DELETE
                    prompt = PROMPT_MAP.get(action)!
                    confirmation = true
                  }
                "
                  variant="danger"
                  >{{ ACTIONS.DELETE }}</BButton
                >
              </BButtonGroup>
            </div>
          </BButtonToolbar>
        </div>
      </BContainer>
      <BContainer class="my-4" style="--bs-gutter-x: 0">
        <BRow
          cols="1"
          cols-sm="2"
          cols-md="3"
          cols-xl="4"
          cols-xxl="5"
          style="--bs-gutter-x: 0"
        >
          <template v-for="role, index in roster.unsavedRoster" :key="index">
            <BCol
              style="
                border: 1px solid currentColor;
                margin-right: -1px;
                margin-bottom: -1px;
              "
              class="p-2"
            >
            <div class="mb-3 flex justify-between">
              <template v-if="index != 0">
                <BButton @click.prevent="
                  () => {
                    const temp = roster.unsavedRoster![index]
                    roster.unsavedRoster![index] = roster.unsavedRoster![index - 1]
                    roster.unsavedRoster![index - 1] = temp
                    resetOrder()
                  }" class="border-none px-0.5 mr-0.5"><line-md:chevron-left class="my-auto w-6 h-6" /></BButton>
              </template>
              <BInput class="font-bold text-md text-center w-100 mx-0.5 px-0" v-model="role.title" />
              <BButton @click.prevent="
                  () => {
                    action = ACTIONS.DELETE_ROLE
                    prompt = PROMPT_MAP.get(action)!.concat(role.title)
                    roleActionedOnOrder = role.order
                    confirmation = true
                  }" variant="danger" class="px-1 mx-0.5"><material-symbols:delete-outline class="my-auto w-5 h-5" /></BButton>
                <template v-if="index != (roster.unsavedRoster!.length! - 1)">
                <BButton @click.prevent="
                  () => {
                    const temp = roster.unsavedRoster![index]
                    roster.unsavedRoster![index] = roster.unsavedRoster![index + 1]
                    roster.unsavedRoster![index + 1] = temp
                    resetOrder()
                  }" class="border-none px-0.5 ml-0.5"><line-md:chevron-right class="my-auto w-6 h-6" /></BButton>
              </template>
            </div>
              <BContainer style="--bs-gutter-x: 0">
                <template v-for="service in role.services">
                  <div>
                    <BRow cols="1" style="--bs-gutter-x: 0">
                      <div class="flex justify-between">
                        <p class="font-bold my-auto">
                          {{ SERVICE_NO_MAP.get(service.no) }} Service
                        </p>
                        <div class="flex my-auto">
                          <BButton
                            @click.prevent="
                              () => {
                                if (service.slot.length > 1) service.slot.pop()
                              }
                            "
                            style="
                              padding-top: 0.15rem;
                              padding-bottom: 0.15rem;
                            "
                            class="px-1.5 mx-1.5"
                            ><line-md:minus class="w-4"
                          /></BButton>
                          <BButton
                            @click.prevent="
                              () => {
                                if (service.slot.length < 5) {
                                  service.slot.push(
                                    new SlotImpl(service.slot.length + 1)
                                  )
                                }
                              }
                            "
                            style="
                              padding-top: 0.15rem;
                              padding-bottom: 0.15rem;
                            "
                            class="px-1.5"
                            ><line-md:plus class="w-4"
                          /></BButton>
                        </div>
                      </div>
                      <div class="my-1">
                        <template v-for="slot in service.slot">
                          <div class="flex my-1">
                            <BInput
                              v-model="slot.segments"
                              class="w-14 mr-2 px-1 text-center"
                            />
                            <BCol>
                              <BDropdown
                                lazy
                                no-flip
                                :text="slot.name"
                                :variant="
                                      rosterStore.unavailabilityByDate[0]
                                        .get(roster.date || '')
                                        ?.has(slot.id)
                                        ? 'danger'
                                        : personToRoleOrderMap.get(slot.id) !== undefined && personToRoleOrderMap.get(slot.id)!.size > 1
                                        ? 'warning'
                                        : 'dark'
                                    "
                              >
                                <BDropdownItem
                                  variant="secondary"
                                  @click.prevent="() => {
                                    removeRoleOrderFromPersonMap(slot.id, role.order)
                                    slot.name = ''
                                    slot.id = 0
                                  }"
                                >{{`<empty>`}}</BDropdownItem>
                                <template
                                  v-for="person in rosterStore.people.filter(
                                    (person) => person.active
                                  )"
                                >
                                  <BDropdownItem
                                    :variant="
                                      rosterStore.unavailabilityByDate[0]
                                        .get(roster.date || '')
                                        ?.has(person.id)
                                        ? 'danger'
                                        : personToRoleOrderMap.get(person.id)!.size > 0
                                        ? 'warning'
                                        : 'dark'
                                    "
                                    @click.prevent="
                                      () => {
                                        if (slot.id !== 0) {
                                          removeRoleOrderFromPersonMap(slot.id, role.order)
                                        }
                                        slot.name = person.name
                                        slot.id = person.id
                                        addRoleOrderToPersonMap(person.id, role.order)
                                      }
                                    "
                                    >{{ person.name }}
                                  </BDropdownItem>
                                </template>
                              </BDropdown>
                            </BCol>
                          </div>
                        </template>
                      </div>
                    </BRow>
                  </div>
                </template>
                <div class="w-100 flex justify-end">
                  <BButton
                    v-if="index == (roster.unsavedRoster!.length! - 1)"
                    @click.prevent="handleAddNewRole"
                    variant="primary"
                    >Add Role</BButton
                  >
                </div>
              </BContainer>
            </BCol>
          </template>
        </BRow>
      <span class="text-xs">Created at: {{ new Date(Date.parse(roster.created_at)).toLocaleString('en-SG', {
            dateStyle: 'medium',
            timeStyle: 'short'
          }) }}</span>
      </BContainer>
    </template>
    <template v-else>
      <div>Roster does not exist!</div>
    </template>
    <BModal centered hide-footer hide-header v-model="confirmation">
      <p class="text-justify">{{ prompt }}</p>
      <div class="mt-4 flex justify-between">
        <BButton
          @click.prevent="rosterAction"
          variant="primary"
          class="capitalize"
          >{{ action }}</BButton
        >
        <BButton @click.prevent="confirmation = false">Cancel</BButton>
      </div>
    </BModal>
  </div>
</template>