<script setup lang="ts">
import { useRosterStore } from '@/stores/roster'
import { RoleInsert, RoleRow } from '@/types/roster'
import { ref, watchEffect } from 'vue'

const rosterStore = useRosterStore()
const editRole = ref(false)
const deleteRole = ref(false)
const addRole = ref(false)
const selectedRole = ref({} as RoleRow)
const newRole = ref({} as RoleInsert)
const newTitle = ref('')
const duplicateTitle = ref(false)

const handleUpdate = async () => {
  const success = await rosterStore.updateRole(
    selectedRole.value,
    newTitle.value.trim()
  )
  if (success) {
    editRole.value = false
    selectedRole.value = {} as RoleRow
    newTitle.value = ''
  } else {
    editRole.value = true
  }
}

const handleSave = async () => {
  const success = await rosterStore.saveRole(
    newRole.value,
    newTitle.value.trim()
  )
  if (success) {
    addRole.value = false
    newRole.value = {} as RoleRow
    newTitle.value = ''
  } else {
    addRole.value = true
  }
}

const handleDelete = async () => {
  const success = await rosterStore.deleteRole(selectedRole.value.id)
  if (success) {
    deleteRole.value = false
    selectedRole.value = {} as RoleRow
  } else {
    deleteRole.value = true
  }
}

watchEffect(() => {
  duplicateTitle.value = rosterStore.roles.some(
    (role) => role.title.toLowerCase() == newTitle.value.toLowerCase().trim()
  )
})

const titleSearch = ref('')
</script>

<template>
  <div id="roles" class="py-8 px-4 w-[100vw]">
    <h1 class="my-3 text-center">Roles</h1>
    <BTableSimple hover responsive>
      <colgroup>
        <col />
      </colgroup>
      <BThead>
        <BTr>
          <BTh
            ><div class="flex justify-between">
              <div class="my-auto">
                <b>Title</b> &nbsp;&nbsp;&nbsp;<BInput
                  placeholder="Search"
                  id="titleSearch"
                  class="inline-block w-28 h-10 mr-1.5"
                  v-model="titleSearch"
                />
              </div>
              <BButton
                @click.prevent="
                      () => {
                        newRole = {} as RoleRow
                        addRole = true
                      }
                    "
                variant="success"
                class="px-1.5 ml-2 mr-1"
                ><ci:add-row class="my-auto w-6 h-6"
              /></BButton></div
          ></BTh>
        </BTr>
      </BThead>
      <BTbody>
        <template v-for="role in rosterStore.roles.filter((role) =>
            role.title
              .toLowerCase()
              .split(' ')
              .some((subname) =>
                titleSearch
                  .toLowerCase()
                  .split(' ')
                  .some((subnamesearch) => subname.startsWith(subnamesearch))
              )
          )">
          <BTr>
            <BTd>
              <div class="flex justify-between">
                <p class="my-auto pt-0.5">
                  {{ role.title }}
                </p>
                <div>
                  <BButton
                    @click.prevent="
                      () => {
                        selectedRole = role
                        editRole = true
                      }
                    "
                    class="py-1 px-1 mx-1"
                    variant="primary"
                    ><line-md:edit-twotone-full class="h-5 w-5"
                  /></BButton>
                  <BButton
                    @click.prevent="
                      () => {
                        selectedRole = role
                        deleteRole = true
                      }
                    "
                    class="py-1 px-1 mx-1"
                    variant="danger"
                    ><material-symbols:delete-outline class="h-5 w-5"
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
        v-model="editRole"
        no-close-on-backdrop
      >
        <p>
          Currently editing: <b>{{ selectedRole.title }}</b>
        </p>
        <hr class="my-2" />
        <div class="flex my-3">
          <p class="my-auto">Rename:</p>
          <BInput
            class="ml-2"
            v-model="newTitle"
            :state="newTitle.length == 0 ? null : !duplicateTitle"
          />
        </div>
        <div class="mt-4 flex justify-between">
          <BButton
            @click.prevent="handleUpdate"
            variant="primary"
            class="capitalize"
            :disabled="duplicateTitle"
            >Save</BButton
          >
          <BButton
            @click.prevent="() => {
            editRole = false
            selectedRole = {} as RoleRow
            newTitle = ''
          }"
            >Cancel</BButton
          >
        </div>
      </BModal>
      <BModal
        centered
        hide-footer
        hide-header
        v-model="addRole"
        no-close-on-backdrop
      >
        <p><b>Add new role</b></p>
        <hr class="my-2" />
        <div class="flex my-3">
          <p class="my-auto">Title:</p>
          <BInput
            class="ml-2"
            v-model="newTitle"
            :state="newTitle.length == 0 ? null : !duplicateTitle"
          />
        </div>
        <div class="mt-4 flex justify-between">
          <BButton
            @click.prevent="handleSave"
            variant="primary"
            class="capitalize"
            :disabled="duplicateTitle"
            >Save</BButton
          >
          <BButton
            @click.prevent="() => {
            addRole = false
            newRole = {} as RoleRow
            newTitle = ''
          }"
            >Cancel</BButton
          >
        </div>
      </BModal>
      <BModal
        centered
        hide-footer
        hide-header
        v-model="deleteRole"
        no-close-on-backdrop
      >
        <p>Delete role: <b>{{ selectedRole.title }}</b></p>
        <hr class="my-2" />
        <div class="flex my-3">
          <p class="my-auto">Are you sure you want to delete this role?</p>
        </div>
        <div class="mt-4 flex justify-between">
          <BButton
            @click.prevent="handleDelete"
            variant="primary"
            class="capitalize"
            :disabled="duplicateTitle"
            >Delete</BButton
          >
          <BButton
            @click.prevent="() => {
            deleteRole = false
            selectedRole = {} as RoleRow
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

#roles {
  @media (min-width: 600px) {
    width: 600px;
  }
}
</style>
