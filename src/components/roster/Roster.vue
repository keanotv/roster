<script setup lang="ts">
import { useRosterStore } from '@/stores/roster'
import { ref } from 'vue';
const props = defineProps<{
  id: number
}>()

const rosterStore = useRosterStore()
const roster = await rosterStore.getRosterById(props.id)
const previousDate = ref(roster.date)
</script>

<template>
  <div>
    <template v-if="roster !== undefined && roster.roster !== null">
      <BInputGroup prepend="Title">
        <BInput v-model="roster.title" @change="(e) => {
          rosterStore.saveTitle(roster.id, e.target.value)
        }"/>
      <!-- <h1 contenteditable class="max-w-[40vw] overflow-x-scroll">{{ roster.title }}</h1> -->
      </BInputGroup>
      <div class=" my-2 flex">
        <div><BInputGroup prepend="Date">
        <BFormInput @blur="(e) => {
          if (previousDate != e.target.value) {
            rosterStore.saveDate(roster.id, e.target.value || '')
            previousDate = e.target.value
          }
        }" v-model="roster.date" type="date"/>
        </BInputGroup></div>
        <div class="place-items-center flex">
          <span class="ml-3 mr-2 font-bold text-sm">LIVE</span>
          <BFormCheckbox class="mb-1" v-model="roster.published" switch @click="rosterStore.updatePublished(roster.id, !roster.published)" />
        </div>
      </div>
      <BContainer style="--bs-gutter-x: 0;">
        <BRow cols="1" cols-md="2" cols-lg="4" cols-xl="5" style="--bs-gutter-x: 0;">
          <template v-for="role in roster.unsavedRoster" :key="role.title">
            <BCol style="border: 1px solid currentColor; margin-right:-1px; margin-bottom:-1px; " class="p-2 rounded-md">
              <b>{{ role.title }}</b>
              <BContainer style="--bs-gutter-x: 0;">
                <template v-for="service in role.services">
                  {{ service.no }}
                  <BRow cols="1" style="--bs-gutter-x: 0;">
                    <template v-for="slot in service.slot">
                      <BCol>
                        <BDropdown
                        :text="slot.name"
                        :class="{'text-red-600' : rosterStore.unavailabilityByDate[0].get(roster.date || '')?.has(slot.id)}"
                        >
                          <template v-for="person in rosterStore.people">
                            <BDropdownItem
                            :variant="rosterStore.unavailabilityByDate[0].get(roster.date || '')?.has(person.id) ? 'danger' : 'dark'"
                            @click.prevent="() => {
                              slot.name = person.name
                              slot.id = person.id
                            }"
                            >{{ person.name }}
                            </BDropdownItem>
                          </template>
                        </BDropdown>
                      </BCol>
                    </template>
                  </BRow>
                </template>
              </BContainer>
            </BCol>
          </template>
        </BRow>
      </BContainer>
    </template>
  </div>
</template>
