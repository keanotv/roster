<script setup lang="ts">
import { useRosterStore } from '@/stores/roster'
import { PeopleRow } from '@/types/roster'
import { ref, watchEffect } from 'vue'

const rosterStore = useRosterStore()

const editPerson = ref(false)
const deletePerson = ref(false)

const selectedPerson = ref({} as PeopleRow)

watchEffect(() => {
  console.log(selectedPerson.value)
})
</script>

<template>
  <div id="people" class="py-8 px-4 w-[100vw]">
    <h1 class="my-2 text-center">People</h1>
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
                <p class="my-auto pt-0.5">{{ person.name }}</p>
                <div>
                  <BButton
                    @click.prevent="
                      () => {
                        selectedPerson = person
                        editPerson = true
                      }
                    "
                    class="py-1 px-1 mx-2"
                    variant="primary"
                    ><line-md:edit-twotone-full class="h-5 w-5"
                  /></BButton>
                  <BButton
                    @click.prevent="
                      () => {
                        selectedPerson = person
                        deletePerson = true
                      }
                    "
                    class="py-1 px-1 mx-1"
                    variant="danger"
                    ><line-md:account-delete class="h-5 w-5"
                  /></BButton>
                </div>
              </div>
            </BTd>
          </BTr>
        </template>
        <BModal centered hide-footer hide-header v-model="editPerson">
          <p>Currently editing: <b>{{ selectedPerson.name }}</b></p>
          <hr class="my-2" />
          <div class="flex my-2">
            <p class="my-auto">Rename:</p>
            <BInput class="ml-2"/>
          </div>
          <div class="flex my-2">
            <p class="mr-2">Active:</p>
            <BFormCheckbox switch v-model="selectedPerson.active"/>
          </div>
          <span class="text-sm">This person is {{ selectedPerson.server ? '' : ' not ' }} active. Their name will {{ selectedPerson.server ? '' : ' not ' }} show up in all the drop-down lists.</span>
          <div class="flex my-2">
            <p class="mr-2">Server:</p>
            <BFormCheckbox switch v-model="selectedPerson.server"/>
          </div>
          <span class="text-sm">This person is {{ selectedPerson.server ? '' : ' not ' }} a server. Their name will {{ selectedPerson.server ? '' : ' not ' }} show up in the drop-down list when submitting unavailable dates.</span>
          <div class="mt-4 flex justify-between">
            <BButton
              @click.prevent="() => {
                editPerson = false
                selectedPerson = {} as PeopleRow
              }
              "
              variant="primary"
              class="capitalize"
              >Save</BButton
            >
            <BButton
              @click.prevent="() => {
              editPerson = false
              selectedPerson = {} as PeopleRow
            }"
              >Cancel</BButton
            >
          </div>
        </BModal>
        <BModal centered hide-footer hide-header v-model="deletePerson">
          <p class="text-justify">
            Are you sure you want to delete this person? You will not be able to
            undo this action. Alternatively, you may choose to set this person
            to inactive (using the edit button) to temporarily disable this
            person from showing up in drop-down lists.
          </p>
          <div class="mt-4 flex justify-between">
            <BButton
              @click.prevent="() => {
                deletePerson = false
                selectedPerson = {} as PeopleRow
              }"
              variant="primary"
              class="capitalize"
              >Delete</BButton
            >
            <BButton
              @click.prevent="() => {
                deletePerson = false
                selectedPerson = {} as PeopleRow
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
