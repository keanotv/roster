<script setup lang="ts">
import { useRosterStore } from '@/stores/roster'
import type { PeopleInsert, PeopleRow } from '@/types/roster'
import { ref, watchEffect } from 'vue'

const rosterStore = useRosterStore()
const editPerson = ref(false)
const deletePerson = ref(false)
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

const handleDelete = async () => {
  const success = await rosterStore.deletePerson(selectedPerson.value)
  if (success) {
    deletePerson.value = false
    selectedPerson.value = {} as PeopleRow
  } else {
    deletePerson.value = true
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
    <template v-if="rosterStore.people?.length">
      <p class="text-center my-2">
        Active:
        {{ rosterStore.people.filter((person) => person.active).length }},
        inactive:
        {{ rosterStore.people.filter((person) => !person.active).length }}
      </p>
      <BTableSimple hover responsive>
        <colgroup>
          <col />
        </colgroup>
        <BThead>
          <BTr>
            <BTh>
              <div class="flex justify-between">
                <div class="my-auto">
                  <b>Name</b> &nbsp;<BInput
                    id="nameSearch"
                    v-model="nameSearch"
                    class="inline-block w-28 h-10 mr-1.5"
                    placeholder="Search"
                  />
                </div>
                <BButton
                  class="px-1.5 ml-2 mr-1"
                  variant="outline-success"
                  @click.prevent="
                    () => {
                      newPerson = {
                        active: true,
                        server: true
                      } as PeopleRow
                      addPerson = true
                    }
                  "
                >
                  <line-md:account-add class="my-auto w-6 h-6" />
                </BButton>
              </div>
            </BTh>
          </BTr>
        </BThead>
        <BTbody>
          <template
            v-for="person in rosterStore.people.filter(
              (p) =>
                !p.deleted &&
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
                      class="py-1 px-1 mx-1"
                      variant="outline-primary"
                      @click.prevent="
                        () => {
                          selectedPerson = person
                          editPerson = true
                        }
                      "
                    >
                      <line-md:edit-twotone-full class="h-5 w-5" />
                    </BButton>
                    <BButton
                      class="py-1 px-1 mx-1"
                      variant="outline-danger"
                      @click.prevent="
                        () => {
                          selectedPerson = person
                          deletePerson = true
                        }
                      "
                    >
                      <material-symbols:delete-outline class="h-5 w-5" />
                    </BButton>
                  </div>
                </div>
              </BTd>
            </BTr>
          </template>
        </BTbody>
        <BModal
          v-model="editPerson"
          centered
          no-close-on-backdrop
          no-footer
          no-header
        >
          <p>
            Currently editing: <b>{{ selectedPerson.name }}</b>
          </p>
          <hr class="my-2" />
          <div class="flex my-3">
            <p class="my-auto">Rename:</p>
            <BInput
              v-model="newName"
              :state="newName.length == 0 ? null : !duplicateName"
              class="ml-2"
            />
          </div>
          <div class="flex mt-3">
            <p class="mr-2 pt-0.5">Active:</p>
            <BFormCheckbox v-model="selectedPerson.active" switch />
          </div>
          <span class="text-sm"
            >This person is {{ selectedPerson.active ? '' : 'in' }}active. Their
            name will {{ selectedPerson.active ? '' : ' not ' }} appear in
            drop-down lists.</span
          >
          <div class="flex mt-3">
            <p class="mr-2 pt-0.5">Server:</p>
            <BFormCheckbox v-model="selectedPerson.server" switch />
          </div>
          <span class="text-sm"
            >This person is {{ selectedPerson.server ? '' : ' not ' }} a server.
            Their name will {{ selectedPerson.server ? '' : ' not ' }} appear in
            the drop-down list when submitting unavailable dates.</span
          >
          <div class="mt-4 flex justify-between">
            <BButton
              :disabled="duplicateName || !newName.length"
              class="capitalize"
              variant="outline-primary"
              @click.prevent="handleUpdate"
              >Save
            </BButton>
            <BButton
              variant="outline-secondary"
              @click.prevent="
                () => {
                  editPerson = false
                  selectedPerson = {} as PeopleRow
                  newName = ''
                }
              "
              >Cancel
            </BButton>
          </div>
        </BModal>
        <BModal
          v-model="addPerson"
          centered
          no-close-on-backdrop
          no-footer
          no-header
        >
          <p>Add new member</p>
          <hr class="my-2" />
          <div class="flex my-3">
            <p class="my-auto">Name:</p>
            <BInput
              v-model="newName"
              :state="newName.length == 0 ? null : !duplicateName"
              class="ml-2"
            />
          </div>
          <div class="flex mt-3">
            <p class="mr-2 pt-0.5">Active:</p>
            <BFormCheckbox v-model="newPerson.active" switch />
          </div>
          <span class="text-sm"
            >This person is {{ newPerson.active ? '' : 'in' }}active. Their name
            will {{ newPerson.active ? '' : ' not ' }} appear in drop-down
            lists.</span
          >
          <div class="flex mt-3">
            <p class="mr-2 pt-0.5">Server:</p>
            <BFormCheckbox v-model="newPerson.server" switch />
          </div>
          <span class="text-sm"
            >This person is {{ newPerson.server ? '' : ' not ' }} a server.
            Their name will {{ newPerson.server ? '' : ' not ' }} appear in the
            drop-down list when submitting unavailable dates.</span
          >
          <div class="mt-4 flex justify-between">
            <BButton
              :disabled="duplicateName"
              class="capitalize"
              variant="outline-primary"
              @click.prevent="handleSave"
              >Save
            </BButton>
            <BButton
              variant="outline-secondary"
              @click.prevent="
                () => {
                  addPerson = false
                  newPerson = {} as PeopleRow
                  newName = ''
                }
              "
              >Cancel
            </BButton>
          </div>
        </BModal>
        <BModal
          v-model="deletePerson"
          centered
          no-close-on-backdrop
          no-footer
          no-header
        >
          <p>
            Delete person: <b>{{ selectedPerson.name }}</b>
          </p>
          <hr class="my-2" />
          <div class="flex my-3">
            <p class="my-auto">Are you sure you want to delete this person?</p>
          </div>
          <div class="mt-4 flex justify-between">
            <BButton
              class="capitalize"
              variant="outline-primary"
              @click.prevent="handleDelete"
              >Delete
            </BButton>
            <BButton
              variant="outline-secondary"
              @click.prevent="
                () => {
                  deletePerson = false
                  selectedPerson = {} as PeopleRow
                }
              "
              >Cancel
            </BButton>
          </div>
        </BModal>
      </BTableSimple>
    </template>
  </div>
</template>

<style scoped>
th {
  font-weight: bold;
}

#people {
  @media (min-width: 600px) {
    width: 600px;
  }
}
</style>
