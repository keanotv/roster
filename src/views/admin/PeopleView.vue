<script setup lang="ts">
import { useRosterStore } from '@/stores/roster'
import { PeopleInsert, PeopleRow } from '@/types/roster'
import { ref, watchEffect } from 'vue'

const rosterStore = useRosterStore()
const editPerson = ref(false)
const addPerson = ref(false)
const selectedPerson = ref({} as PeopleRow)
const newPerson = ref({} as PeopleInsert)
const newName = ref('')
const duplicateName = ref(false)

const handleUpdate = async () => {
  const success = await rosterStore.updatePerson(
    selectedPerson.value,
    newName.value.trim()
  )
  if (success) {
    editPerson.value = false
    selectedPerson.value = {} as PeopleRow
    newName.value = ''
  } else {
    editPerson.value = true
  }
}

const handleSave = async () => {
  const success = await rosterStore.savePerson(
    newPerson.value,
    newName.value.trim()
  )
  if (success) {
    addPerson.value = false
    newPerson.value = {} as PeopleRow
    newName.value = ''
  } else {
    addPerson.value = true
  }
}

watchEffect(() => {
  duplicateName.value = rosterStore.people.some(
    (person) => person.name.toLowerCase() == newName.value.toLowerCase().trim()
  )
})

const nameSearch = ref('')
</script>

<template>
  <div id="people" class="py-8 px-4 w-[100vw]">
    <h1 class="my-3 text-center">People</h1>
    <BTableSimple hover responsive>
      <colgroup>
        <col />
      </colgroup>
      <BThead>
        <BTr>
          <BTh><div class="flex justify-between">
            <div><b>Name</b> &nbsp;&nbsp;&nbsp;<BInput
            placeholder="Search"
            id="nameSearch"
            class="inline-block w-28 h-10 mr-1.5"
            v-model="nameSearch"
          /></div> <BButton @click.prevent="
                      () => {
                        newPerson = {
                          active: true,
                          server: true
                        } as PeopleRow
                        addPerson = true
                      }
                    " variant="success" class="px-1.5 ml-2 mr-1"><line-md:account-add class="my-auto w-6 h-6"/></BButton>
          </div></BTh>
        </BTr>
      </BThead>
      <BTbody>
        <template v-for="person in rosterStore.people.filter(
            (person) =>
              person.name
                .toLowerCase()
                .split(' ')
                .some((subname) =>
                  nameSearch
                    .toLowerCase()
                    .split(' ')
                    .some((subnamesearch) => subname.startsWith(subnamesearch))
                )
          )">
          <BTr>
            <BTd>
              <div class="flex justify-between">
                <p class="my-auto pt-0.5">
                  {{ person.name }}
                  <template v-if="!person.active">
                    <i class="text-sm text-gray-500">(inactive) </i>
                  </template>
                  <template v-if="!person.server">
                    <i class="text-sm text-gray-500">(non-server)</i>
                  </template>
                </p>
                <div>
                  <BButton
                    @click.prevent="
                      () => {
                        selectedPerson = person
                        editPerson = true
                      }
                    "
                    class="py-1 px-1 mx-1"
                    variant="primary"
                    ><line-md:edit-twotone-full class="h-5 w-5"
                  /></BButton>
                </div>
              </div>
            </BTd>
          </BTr>
        </template>
      </BTbody>
      <BModal
        centered
        hide-footer
        hide-header
        v-model="editPerson"
        no-close-on-backdrop
      >
        <p>
          Currently editing: <b>{{ selectedPerson.name }}</b>
        </p>
        <hr class="my-2" />
        <div class="flex my-3">
          <p class="my-auto">Rename:</p>
          <BInput
            class="ml-2"
            v-model="newName"
            :state="newName.length == 0 ? null : !duplicateName"
          />
        </div>
        <div class="flex mt-3">
          <p class="mr-2 pt-0.5">Active:</p>
          <BFormCheckbox switch v-model="selectedPerson.active" />
        </div>
        <span class="text-sm"
          >This person is {{ selectedPerson.active ? '' : 'in' }}active. Their
          name will {{ selectedPerson.active ? '' : ' not ' }} appear in
          drop-down lists.</span
        >
        <div class="flex mt-3">
          <p class="mr-2 pt-0.5">Server:</p>
          <BFormCheckbox switch v-model="selectedPerson.server" />
        </div>
        <span class="text-sm"
          >This person is {{ selectedPerson.server ? '' : ' not ' }} a server.
          Their name will {{ selectedPerson.server ? '' : ' not ' }} appear in
          the drop-down list when submitting unavailable dates.</span
        >
        <div class="mt-4 flex justify-between">
          <BButton
            @click.prevent="handleUpdate"
            variant="primary"
            class="capitalize"
            :disabled="duplicateName"
            >Save</BButton
          >
          <BButton
            @click.prevent="() => {
            editPerson = false
            selectedPerson = {} as PeopleRow
            newName = ''
          }"
            >Cancel</BButton
          >
        </div>
      </BModal>
      <BModal
        centered
        hide-footer
        hide-header
        v-model="addPerson"
        no-close-on-backdrop
      >
        <p>
          Add new member
        </p>
        <hr class="my-2" />
        <div class="flex my-3">
          <p class="my-auto">Name:</p>
          <BInput
            class="ml-2"
            v-model="newName"
            :state="newName.length == 0 ? null : !duplicateName"
          />
        </div>
        <div class="flex mt-3">
          <p class="mr-2 pt-0.5">Active:</p>
          <BFormCheckbox switch v-model="newPerson.active" />
        </div>
        <span class="text-sm"
          >This person is {{ newPerson.active ? '' : 'in' }}active. Their
          name will {{ newPerson.active ? '' : ' not ' }} appear in
          drop-down lists.</span
        >
        <div class="flex mt-3">
          <p class="mr-2 pt-0.5">Server:</p>
          <BFormCheckbox switch v-model="newPerson.server" />
        </div>
        <span class="text-sm"
          >This person is {{ newPerson.server ? '' : ' not ' }} a server.
          Their name will {{ newPerson.server ? '' : ' not ' }} appear in
          the drop-down list when submitting unavailable dates.</span
        >
        <div class="mt-4 flex justify-between">
          <BButton
            @click.prevent="handleSave"
            variant="primary"
            class="capitalize"
            :disabled="duplicateName"
            >Save</BButton
          >
          <BButton
            @click.prevent="() => {
            addPerson = false
            newPerson = {} as PeopleRow
            newName = ''
          }"
            >Cancel</BButton
          >
        </div>
      </BModal>
    </BTableSimple>
  </div>
</template>

<style scoped>
th {
  font-weight: bold;
}

.form-switch {
  text-align: center;
}

#people {
  @media (min-width: 600px) {
    width: 600px;
  }
}
</style>
