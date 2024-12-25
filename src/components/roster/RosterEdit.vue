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
import { type PeopleRow, SlotImpl } from '@/types/roster'
import {
  createNewRole,
  createNewRosterWithTitleAndRosterData,
  getRosterById,
  refreshUnavailabilityByDateList
} from '@/utils/roster'
import { onMounted, ref, watchEffect } from 'vue'

const props = defineProps<{
  id: number
}>()

const rosterStore = useRosterStore()
if (!rosterStore.unavailability.length || !rosterStore.people.length) {
  await rosterStore.getUnavailability()
  await rosterStore.getPeople()
} else if (!rosterStore.unavailabilityByDate.size) {
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

const handleAddNewRole = (order: number) => {
  roster.value.unsavedRoster?.splice(order, 0, createNewRole())
  resetOrder()
}

const focusNameSearch = () => {
  setTimeout(() => {
    const el = document.getElementById('nameSearch') as HTMLInputElement | null
    if (el) {
      el.focus()
      el.click()
    }
  }, 77)
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
            router.push(
              path(ROUTE_NAMES.ROSTER) +
                path(ROSTER_ROUTE_NAMES.VIEW) +
                path(id.toString())
            )
          }
        })
      }
      break
    case ACTIONS.RESET:
      await getRosterById(roster.value.id).then(() => {
        const storeRoster = rosterStore.rosters.find(
          (storeRoster) => storeRoster.id === roster.value.id
        )
        if (storeRoster != undefined && storeRoster.roster != null) {
          storeRoster.unsavedRoster = JSON.parse(storeRoster.roster)
          roster.value.unsavedRoster = JSON.parse(storeRoster.roster)
        }
      })
      personToRoleOrderMap.value = new Map<number, Set<number>>()
      populatePersonToRoleOrderMap()
      break
    case ACTIONS.DELETE:
      await rosterStore.deleteRoster(roster.value.id).then(() => {
        router.push(path(ROUTE_NAMES.ROSTER) + path(ROSTER_ROUTE_NAMES.VIEW))
      })
      break
    case ACTIONS.DELETE_ROLE:
      roster.value.unsavedRoster = roster.value.unsavedRoster!.filter(
        (role) => role.order != roleActionedOnOrder.value
      )
      roleActionedOnOrder.value = -1
      resetOrder()
      break
    default:
      console.log('Action not found for ' + action.value)
      break
  }
  confirmation.value = false
}

const nameSearch = ref('')
const clearNameSearch = () => {
  nameSearch.value = ''
}

const personToRoleOrderMap = ref(new Map<number, Set<number>>())

const populatePersonToRoleOrderMap = () => {
  rosterStore.people.forEach((person) => {
    personToRoleOrderMap.value.set(person.id, new Set<number>())
  })
  roster.value?.unsavedRoster?.forEach((role) => {
    role.services.forEach((service) => {
      service.slot.forEach((slot) => {
        personToRoleOrderMap.value.get(slot.id)?.add(role.order)
      })
    })
  })
}

onMounted(() => {
  populatePersonToRoleOrderMap()
  document.removeEventListener('click', clearNameSearch)
  document.removeEventListener('keydown', clearCopiedName)
  document.addEventListener('click', clearNameSearch)
  document.addEventListener('keydown', clearCopiedName)
})
const addRoleOrderToPersonMap = (id: number, order: number) => {
  personToRoleOrderMap.value.get(id)?.add(order)
}

const removeRoleOrderFromPersonMap = (id: number, order: number) => {
  personToRoleOrderMap.value.get(id)?.delete(order)
}

const resetOrder = () => {
  let order = 1
  roster.value.unsavedRoster?.forEach((role) => {
    role.order = order
    order++
  })
}

watchEffect(async () => {
  if (roster.value?.id !== props.id) {
    roster.value = rosterStore.getRosterById(props.id)
    personToRoleOrderMap.value = new Map<number, Set<number>>()
    populatePersonToRoleOrderMap()
  }
})

// copy-paste name feature
type Person = {
  id: number
  name: string
}
const copiedPerson = ref({} as Person)
const clearCopiedName = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    //if esc key was not pressed in combination with ctrl or alt or shift
    const isNotCombinedKey = !(e.ctrlKey || e.altKey || e.shiftKey)
    if (isNotCombinedKey) {
      copiedPerson.value = {} as Person
    }
  }
}
</script>

<template>
  <div>
    <template v-if="roster !== undefined && roster.roster !== null">
      <BContainer style="--bs-gutter-x: 0" class="mb-3">
        <BInputGroup prepend="Title">
          <BInput
            v-model="roster.title"
            @change.prevent="
              async (e: any) => {
                await rosterStore.saveTitle(roster.id, e.target.value)
              }
            "
          />
        </BInputGroup>
        <div class="my-2 flex">
          <div>
            <BInputGroup prepend="Date">
              <BFormInput
                @blur="
                  async (e: any) => {
                    if (previousDate != e.target.value) {
                      await rosterStore.saveDate(
                        roster.id,
                        e.target.value || ''
                      )
                      previousDate = e.target.value
                    }
                  }
                "
                v-model="roster.date"
                type="date"
              />
              <template #append>
                <BInputGroupText>
                  <div
                    @click.prevent="
                      async () => {
                        if (previousDate != '') {
                          roster.date = ''
                          await rosterStore.saveDate(roster.id, roster.date)
                          previousDate = ''
                        }
                      }
                    "
                  >
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
                  variant="outline-success"
                  >{{ ACTIONS.SAVE }}
                </BButton>
              </BButtonGroup>
            </div>
            <div>
              <BButtonGroup>
                <BButton
                  class="capitalize"
                  variant="outline-primary"
                  @click.prevent="
                    () => {
                      action = ACTIONS.COPY
                      prompt = PROMPT_MAP.get(action)!
                      confirmation = true
                    }
                  "
                  >{{ ACTIONS.COPY }}
                </BButton>
              </BButtonGroup>
              <BButtonGroup class="mx-2">
                <BButton
                  class="capitalize"
                  @click.prevent="
                    () => {
                      action = ACTIONS.RESET
                      prompt = PROMPT_MAP.get(action)!
                      confirmation = true
                    }
                  "
                  variant="outline-warning"
                  >{{ ACTIONS.RESET }}
                </BButton>
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
                  variant="outline-danger"
                  >{{ ACTIONS.DELETE }}
                </BButton>
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
          <template v-for="(role, index) in roster.unsavedRoster" :key="index">
            <BCol
              style="
                border: 1px solid currentColor;
                margin-right: -1px;
                margin-bottom: -1px;
              "
              class="p-2 flex flex-col justify-between"
            >
              <div>
                <div class="mb-3 flex justify-between">
                  <template v-if="index != 0">
                    <BButton
                      @click.prevent="
                        () => {
                          const temp = roster.unsavedRoster![index]
                          roster.unsavedRoster![index] =
                            roster.unsavedRoster![index - 1]
                          roster.unsavedRoster![index - 1] = temp
                          resetOrder()
                        }
                      "
                      variant="outline-dark"
                      class="border-none px-0.5 mr-0.5 h-8"
                    >
                      <line-md:chevron-left class="my-auto w-5 h-5" />
                    </BButton>
                  </template>
                  <BInput
                    class="font-bold text-center w-100 mx-0.5 px-0 h-8"
                    v-model="role.title"
                    :state="role.title.length ? null : false"
                  />
                  <BButton
                    @click.prevent="
                      () => {
                        action = ACTIONS.DELETE_ROLE
                        prompt = PROMPT_MAP.get(action)!.concat(
                          role.title.length ? role.title : '(empty)'
                        )
                        roleActionedOnOrder = role.order
                        confirmation = true
                      }
                    "
                    variant="outline-danger"
                    class="px-1 mx-0.5 h-8"
                  >
                    <material-symbols:delete-outline class="my-auto w-5 h-5" />
                  </BButton>
                  <template v-if="index != roster.unsavedRoster!.length! - 1">
                    <BButton
                      @click.prevent="
                        () => {
                          const temp = roster.unsavedRoster![index]
                          roster.unsavedRoster![index] =
                            roster.unsavedRoster![index + 1]
                          roster.unsavedRoster![index + 1] = temp
                          resetOrder()
                        }
                      "
                      variant="outline-dark"
                      class="border-none px-0.5 ml-0.5 h-8"
                    >
                      <line-md:chevron-right class="my-auto w-5 h-5" />
                    </BButton>
                  </template>
                </div>
                <BContainer style="--bs-gutter-x: 0">
                  <template v-for="service in role.services" :key="service.no">
                    <div>
                      <BRow cols="1" style="--bs-gutter-x: 0">
                        <div class="flex justify-between">
                          <p>{{ SERVICE_NO_MAP.get(service.no) }} Service</p>
                          <div class="flex my-auto">
                            <BButton
                              @click.prevent="
                                () => {
                                  if (service.slot.length > 1)
                                    service.slot.pop()
                                }
                              "
                              style="
                                padding-top: 0.15rem;
                                padding-bottom: 0.15rem;
                              "
                              class="px-1.5 mx-1.5"
                              variant="outline-dark"
                            >
                              <line-md:minus class="w-4" />
                            </BButton>
                            <BButton
                              @click.prevent="
                                () => {
                                  if (service.slot.length < 7) {
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
                              variant="outline-dark"
                            >
                              <line-md:plus class="w-4" />
                            </BButton>
                          </div>
                        </div>
                        <div class="my-1">
                          <template v-for="slot in service.slot" :key="slot.no">
                            <div class="flex mb-1">
                              <BInput
                                v-model="slot.segments"
                                class="w-14 mr-2 px-1 text-center h-8"
                              />
                              <div class="flex gap-1.5">
                                <BCol @click.prevent="focusNameSearch">
                                  <!-- name dropdown -->
                                  <BDropdown
                                    :text="slot.name"
                                    :variant="
                                      rosterStore.unavailabilityByDate
                                        .get(roster.date || '')
                                        ?.has(slot.id)
                                        ? 'outline-danger'
                                        : personToRoleOrderMap.get(slot.id) !==
                                              undefined &&
                                            personToRoleOrderMap.get(slot.id)!
                                              .size > 1
                                          ? 'outline-warning'
                                          : 'outline-dark'
                                    "
                                    lazy
                                    no-animation
                                    no-flip
                                    unmount-lazy
                                  >
                                    <BDropdownHeader>
                                      <BInput
                                        id="nameSearch"
                                        v-model="nameSearch"
                                        placeholder="Name"
                                        @click.prevent="
                                          (e: MouseEvent) => e.stopPropagation()
                                        "
                                      />
                                    </BDropdownHeader>
                                    <BDropdownItem
                                      v-if="!nameSearch.length"
                                      variant="secondary"
                                      @click.prevent="
                                        () => {
                                          removeRoleOrderFromPersonMap(
                                            slot.id,
                                            role.order
                                          )
                                          slot.name = ''
                                          slot.id = 0
                                        }
                                      "
                                      >{{ `--empty--` }}
                                    </BDropdownItem>
                                    <template
                                      v-for="person in rosterStore.people.filter(
                                        (p: PeopleRow) =>
                                          p.active &&
                                          p.name
                                            .toLowerCase()
                                            .split(' ')
                                            .some((subname) =>
                                              nameSearch
                                                .toLowerCase()
                                                .split(' ')
                                                .some((subnamesearch) =>
                                                  subname.startsWith(
                                                    subnamesearch
                                                  )
                                                )
                                            )
                                      )"
                                      :key="person.id"
                                    >
                                      <BDropdownItem
                                        :variant="
                                          rosterStore.unavailabilityByDate
                                            .get(roster.date || '')
                                            ?.has(person.id)
                                            ? 'danger'
                                            : personToRoleOrderMap.get(
                                                  person.id
                                                )!.size > 0
                                              ? 'warning'
                                              : 'dark'
                                        "
                                        @click.prevent="
                                          () => {
                                            if (slot.id !== 0) {
                                              removeRoleOrderFromPersonMap(
                                                slot.id,
                                                role.order
                                              )
                                            }
                                            slot.name = person.name
                                            slot.id = person.id
                                            addRoleOrderToPersonMap(
                                              person.id,
                                              role.order
                                            )
                                            clearNameSearch()
                                          }
                                        "
                                        >{{ person.name }}
                                      </BDropdownItem>
                                    </template>
                                  </BDropdown>
                                </BCol>
                                <BButton
                                  v-if="
                                    slot.name &&
                                    !(copiedPerson.id && copiedPerson.name)
                                  "
                                  class="px-1 h-8"
                                  variant="outline-primary"
                                  @click="
                                    () => {
                                      copiedPerson.id = slot.id
                                      copiedPerson.name = slot.name
                                    }
                                  "
                                >
                                  <material-symbols:content-copy-outline
                                    class="my-auto w-5 h-5"
                                  />
                                </BButton>
                                <BButton
                                  v-if="copiedPerson.id && copiedPerson.name"
                                  class="px-1 h-8"
                                  variant="outline-success"
                                  @click="
                                    () => {
                                      if (slot.id !== 0) {
                                        removeRoleOrderFromPersonMap(
                                          slot.id,
                                          role.order
                                        )
                                      }
                                      slot.id = copiedPerson.id
                                      slot.name = copiedPerson.name
                                      addRoleOrderToPersonMap(
                                        copiedPerson.id,
                                        role.order
                                      )
                                      copiedPerson = {} as Person
                                    }
                                  "
                                >
                                  <material-symbols:content-paste-go-rounded
                                    class="my-auto w-5 h-5"
                                  />
                                </BButton>
                              </div>
                            </div>
                          </template>
                        </div>
                      </BRow>
                    </div>
                  </template>
                </BContainer>
              </div>
              <div class="w-100 flex justify-between">
                <BButton
                  @click.prevent="() => handleAddNewRole(role.order - 1)"
                  class="border-none pl-1 pr-1.5"
                  variant="outline-dark"
                >
                  <line-md:chevron-left class="my-auto pb-0.5 w-5 h-5 inline" />
                  <line-md:plus-circle class="my-auto pb-0.5 w-5 h-5 inline" />
                </BButton>
                <BButton
                  @click.prevent="() => handleAddNewRole(role.order)"
                  class="border-none pl-1.5 pr-1"
                  variant="outline-dark"
                >
                  <line-md:plus-circle class="my-auto pb-0.5 w-5 h-5 inline" />
                  <line-md:chevron-right
                    class="my-auto pb-0.5 w-5 h-5 inline"
                  />
                </BButton>
              </div>
            </BCol>
          </template>
        </BRow>
        <span class="text-xs"
          >Created at:
          {{
            new Date(Date.parse(roster.created_at)).toLocaleString('en-SG', {
              dateStyle: 'medium',
              timeStyle: 'short'
            })
          }}</span
        >
      </BContainer>
    </template>
    <template v-else>
      <div>Roster does not exist!</div>
    </template>
    <BModal centered no-footer no-header v-model="confirmation">
      <p class="text-justify">{{ prompt }}</p>
      <div class="mt-4 flex justify-between">
        <BButton
          @click.prevent="rosterAction"
          variant="outline-primary"
          class="capitalize"
          >{{ action }}
        </BButton>
        <BButton
          @click.prevent="confirmation = false"
          variant="outline-secondary"
          >Cancel
        </BButton>
      </div>
    </BModal>
  </div>
</template>
