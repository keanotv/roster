<script setup lang="ts">
import { ACTIONS, PROMPT_MAP, SERVICE_NO_MAP } from '@/constants/constants'
import { useRosterStore } from '@/stores/roster'
import { SlotImpl } from '@/types/roster'
import { refreshUnavailabilityByDateList } from '@/utils/roster'
import { ref, watchEffect } from 'vue'
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

watchEffect(async () => {
  roster.value = rosterStore.getRosterById(props.id)
})

const confirmation = ref(false)
const action = ref(ACTIONS.SAVE)
const prompt = ref('')

const rosterAction = () => {
  switch (action.value) {
    case ACTIONS.SAVE:
      // to implement
      // rosterStore.saveRoster()
      break
    case ACTIONS.SYNC:
      // to implement
      break
    case ACTIONS.DELETE:
      // to implement
      break
    default:
      console.log(action.value)
      break
  }
  confirmation.value = false
}
</script>

<template>
  <div>
    <template v-if="roster !== undefined && roster.roster !== null">
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
          </BInputGroup>
        </div>
        <div class="place-items-center flex">
          <span class="ml-3 mr-2 font-bold text-sm">LIVE</span>
          <BFormCheckbox
            class="mb-1"
            v-model="roster.published"
            switch
            @click="rosterStore.updatePublished(roster.id, !roster.published)"
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
        <BModal hide-footer hide-header class="place-content-center" v-model="confirmation">
          <p class="text-justify">{{ prompt }}</p>
          <div class="mt-4 flex justify-between">
            <BButton @click.prevent="rosterAction" variant="primary" class="capitalize">{{ action }}</BButton>
            <BButton @click.prevent="confirmation = false">Cancel</BButton>
          </div>
        </BModal>
      </div>
      <BContainer style="--bs-gutter-x: 0">
        <BRow
          cols="1"
          cols-sm="2"
          cols-lg="3"
          cols-xxl="4"
          style="--bs-gutter-x: 0"
        >
          <template v-for="role in roster.unsavedRoster" :key="role.title">
            <BCol
              style="
                border: 1px solid currentColor;
                margin-right: -1px;
                margin-bottom: -1px;
              "
              class="p-2 rounded-md"
            >
              <p class="font-bold text-lg text-center">{{ role.title }}</p>
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
                                :text="slot.name"
                                :class="{
                                  'text-red-600':
                                    rosterStore.unavailabilityByDate[0]
                                      .get(roster.date || '')
                                      ?.has(slot.id)
                                }"
                              >
                                <template v-for="person in rosterStore.people">
                                  <BDropdownItem
                                    :variant="
                                      rosterStore.unavailabilityByDate[0]
                                        .get(roster.date || '')
                                        ?.has(person.id)
                                        ? 'danger'
                                        : 'dark'
                                    "
                                    @click.prevent="
                                      () => {
                                        slot.name = person.name
                                        slot.id = person.id
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
              </BContainer>
            </BCol>
          </template>
        </BRow>
      </BContainer>
    </template>
    <template v-else>
      <div>Roster does not exist!</div>
    </template>
  </div>
</template>

<style>
/* output {
  display: none;
} */
</style>
