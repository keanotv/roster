<script setup lang="ts">
import {
  path,
  ROSTER_ROUTE_NAMES,
  ROUTE_NAMES,
  UNAVAILABILITY_ROUTE_NAMES
} from '@/constants/constants'
import { ref } from 'vue'

const open = ref(false)

const routerLinks = [
  {
    title: 'Home',
    path: path(ROUTE_NAMES.HOME),
    hasSubLinks: false,
    subLinks: []
  },
  {
    title: 'Submit Unavailability',
    path: path(ROUTE_NAMES.UNAVAILABILITY),
    hasSubLinks: false,
    subLinks: []
  },
  {
    title: 'Rostering',
    path: path(ROUTE_NAMES.HOME),
    hasSubLinks: true,
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
        title: 'New',
        path: path(ROUTE_NAMES.ROSTER) + path(ROSTER_ROUTE_NAMES.NEW)
      }
    ]
  },
  {
    title: 'Logout',
    path: path(ROUTE_NAMES.LOGOUT),
    hasSubLinks: false,
    subLinks: []
  }
]
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
  <BOffcanvas v-model="open">
    <template v-for="route in routerLinks">
      <template v-if="route.hasSubLinks">
        <BAccordion flush>
          <BAccordionItem>
            <template #title>
              <h1 class="my-3 mx-2 italic">{{ route.title }}</h1>
            </template>
            <template v-for="subRoute in route.subLinks">
              <hr />
              <RouterLink :to="subRoute.path">
                <div @click="open = false" class="menu-item py-2 px-2">
                  <h1>{{ subRoute.title }}</h1>
                </div>
              </RouterLink>
            </template>
          </BAccordionItem>
        </BAccordion>
      </template>
      <template v-else>
        <RouterLink :to="route.path">
          <div @click="open = false" class="menu-item py-3 px-2">
            <h1>{{ route.title }}</h1>
          </div>
        </RouterLink>
      </template>
      <hr />
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
