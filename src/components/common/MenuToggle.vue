<script setup lang="ts">
import {
  ADMIN_ROUTE_NAMES,
  path,
  ROSTER_ROUTE_NAMES,
  ROUTE_NAMES,
  UNAVAILABILITY_ROUTE_NAMES
} from '@/constants/constants'
import { USER_ROLES } from '@/stores/user'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'

const open = ref(false)

const routerLinks = [
  {
    title: 'Rosters',
    path: path(ROUTE_NAMES.HOME),
    hasSubLinks: false,
    admin: false,
    subLinks: []
  },
  {
    title: 'Submit Unavailable Dates',
    path: path(ROUTE_NAMES.UNAVAILABILITY),
    hasSubLinks: false,
    admin: false,
    subLinks: []
  },
  {
    title: 'Rostering',
    path: path(ROUTE_NAMES.HOME),
    hasSubLinks: true,
    admin: true,
    subLinks: [
      {
        title: 'View Unavailability',
        path:
          path(ROUTE_NAMES.UNAVAILABILITY) +
          path(UNAVAILABILITY_ROUTE_NAMES.VIEW)
      },
      {
        title: 'Edit Rosters',
        path: path(ROUTE_NAMES.ROSTER) + path(ROSTER_ROUTE_NAMES.VIEW)
      },
      {
        title: 'Create New Roster',
        path: path(ROUTE_NAMES.ROSTER) + path(ROSTER_ROUTE_NAMES.NEW)
      }
    ]
  },
  {
    title: 'Admin',
    path: path(ROUTE_NAMES.HOME),
    hasSubLinks: true,
    admin: true,
    subLinks: [
      {
        title: 'People',
        path: path(ROUTE_NAMES.ADMIN) + path(ADMIN_ROUTE_NAMES.PEOPLE)
      }
    ]
  },
  {
    title: 'Logout',
    path: path(ROUTE_NAMES.LOGOUT),
    hasSubLinks: false,
    admin: false,
    subLinks: []
  }
]

const userStore = useUserStore()
</script>

<template>
  <div id="menu">
    <template v-if="open">
      <line-md:menu-to-close-transition
        @click="open = false"
        class="w-8 h-8 cursor-pointer"
      />
    </template>
    <template v-else>
      <line-md:close-to-menu-transition
        @click="open = true"
        class="w-8 h-8 cursor-pointer"
      />
    </template>
  </div>
  <BOffcanvas v-model="open" noHeaderClose>
    <br />
    <template v-for="route in routerLinks">
      <template
        v-if="
          !route.admin ||
          (route.admin &&
            userStore.role.some((role) => role === USER_ROLES.ADMIN))
        "
      >
        <template v-if="route.hasSubLinks">
          <BAccordion flush>
            <BAccordionItem>
              <template #title>
                <h1 class="my-3 mx-2 italic">{{ route.title }}</h1>
              </template>
              <template v-for="subRoute in route.subLinks">
                <hr />
                <RouterLink :to="subRoute.path">
                  <div @click="open = false" class="menu-item py-3 px-2">
                    <h1>{{ subRoute.title }}</h1>
                  </div>
                </RouterLink>
              </template>
            </BAccordionItem>
          </BAccordion>
          <hr />
        </template>
        <template v-else>
          <RouterLink :to="route.path">
            <div @click="open = false" class="menu-item py-3 px-2">
              <h1>{{ route.title }}</h1>
            </div>
            <hr />
          </RouterLink>
        </template>
      </template>
    </template>
  </BOffcanvas>
</template>

<style scoped>
#menu {
  position: fixed;
  padding: 0.2rem;
  top: 0.65rem;
  left: 0.65rem;
  z-index: 1050;
  background-color: var(--color-background);
  border: 1px solid;
  border-radius: 0.35rem;
  border-color: currentColor;
}

.menu-item:hover {
  background: #b9b9b952;
}
</style>
