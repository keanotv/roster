<script setup lang="ts">
import { useRosterStore } from '@/stores/roster'
import { RoleTemplate } from '@/types/roster'
import { ref, watchEffect } from 'vue'
import draggable from 'vuedraggable'

const rosterStore = useRosterStore()
const editRole = ref(false)
const deleteRole = ref(false)
const addRole = ref(false)
const selectedRole = ref({} as RoleTemplate)
const newTitle = ref('')
const duplicateTitle = ref(false)

const handleUpdate = async () => {
  const updatedRoles = rosterStore.roles.map(role => {
    if (role.order == selectedRole.value.order) {
      return selectedRole.value
    } else {
      return role
    }
  })
  const success = await rosterStore.updateRoles(updatedRoles)
  if (success) {
    editRole.value = false
    selectedRole.value = {} as RoleTemplate
    newTitle.value = ''
    rosterStore.roles = updatedRoles
  } else {
    editRole.value = true
  }
}

const handleSave = async () => {
  const updatedRoles = [... rosterStore.roles]
  updatedRoles.unshift({
    title: newTitle.value,
    order: 0
  })
  resetUpdatedRolesOrder(updatedRoles)
  const success = await rosterStore.updateRoles(updatedRoles)
  if (success) {
    addRole.value = false
    newTitle.value = ''
    rosterStore.roles = updatedRoles
  } else {
    addRole.value = true
  }
}

const handleDelete = async () => {
  const updatedRoles = rosterStore.roles.filter(role => role.order !== selectedRole.value.order)
  resetUpdatedRolesOrder(updatedRoles)
  const success = await rosterStore.updateRoles(updatedRoles)
  if (success) {
    deleteRole.value = false
    selectedRole.value = {} as RoleTemplate
    rosterStore.roles = updatedRoles
  } else {
    deleteRole.value = true
  }
}

const resetUpdatedRolesOrder = (updatedRoles: RoleTemplate[]) => {
  let order = 1
  updatedRoles.forEach(role => {
    role.order = order
    order++
  })
}

const handleReorder = () => {
  resetOrder()
  rosterStore.updateRoles(rosterStore.roles)
}

const resetOrder = () => {
  let order = 1
  rosterStore.roles.forEach(role => {
    role.order = order
    order++
  })
}

watchEffect(() => {
  duplicateTitle.value = rosterStore.roles.some(
    (role) => role.title.toLowerCase() == newTitle.value.toLowerCase().trim()
  )
})

const titleSearch = ref('')
const drag = ref(false)
const reorderMode = ref(false)
</script>

<template>
  <div id="roles" class="py-8 px-4 w-[100vw]">
    <h1 class="my-3 text-center">Roles {{ reorderMode ? '(Reorder)' : '(Edit)' }}</h1>
    <div class="mb-4 flex place-content-center">
      <span class="mt-auto">Reordering mode:</span>
      <div class="ml-2 text-xl"><BFormCheckbox v-model="reorderMode" switch /></div>
    </div>
    <BTableSimple hover responsive>
      <colgroup>
        <col />
      </colgroup>
      <BThead>
        <BTr>
          <BTh
            ><div class="flex justify-between">
              <div>
                <b>Title</b> &nbsp;&nbsp;&nbsp;<BInput
                  v-if="!reorderMode"
                  placeholder="Search"
                  id="titleSearch"
                  class="inline-block w-28 h-10 mr-1.5"
                  v-model="titleSearch"
                />
              </div>
              <BButton
                v-if="!reorderMode"
                @click.prevent="
                      () => {
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
        <template v-if="!reorderMode" v-for="role in rosterStore.roles.filter((role) =>
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
        <template v-else>
          <draggable
            v-model="rosterStore.roles"
            @start="drag=true" 
            @end="drag=false"
            item-key="order"
            @change="handleReorder"
            handle=".handle"
          >
            <template #item="{element}">
              <div>
                <BTr>
                  <BTd>
                    <div class="flex align-center">
                      <ci:drag-vertical class="w-5 h-5 inline handle"/>
                      <p class="mb-0 ml-2 inline">
                        {{ element.title }}
                      </p>
                    </div>
                  </BTd>
                </BTr>
              </div>
            </template>
          </draggable>
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
            selectedRole = {} as RoleTemplate
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
        <p>New role will be added to the top. Reorder after adding if needed.</p>
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
            selectedRole = {} as RoleTemplate
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
  align-content: center;
}

.form-switch {
  text-align: center;
}

#roles {
  @media (min-width: 600px) {
    width: 600px;
  }
}

.handle {
    cursor: move; /* fallback if grab cursor is unsupported */
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
}

 /* (Optional) Apply a "closed-hand" cursor during drag operation. */
.handle:active {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
}
</style>
