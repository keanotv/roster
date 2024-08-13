<script setup lang="ts">
import { useRosterStore } from '@/stores/roster'
import { PeopleRow } from '@/types/roster'
import { ref, watchEffect } from 'vue'

const rosterStore = useRosterStore()
const editPerson = ref(false)
const selectedPerson = ref({} as PeopleRow)
const newName = ref('')
const duplicateName = ref(false)

const handleSave = async () => {
  const success = await rosterStore.savePerson(
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

watchEffect(() => {
  duplicateName.value = rosterStore.people.some(
    (person) => person.name.toLowerCase() == newName.value.toLowerCase().trim()
  )
})
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
          <BTh>Name</BTh>
        </BTr>
      </BThead>
      <BTbody>
        <template v-for="person in rosterStore.people">
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
              @click.prevent="handleSave"
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
      </BTbody>
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
