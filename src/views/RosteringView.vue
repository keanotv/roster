<script setup lang="ts">
import MenuTile from '@/components/home/MenuTile.vue';
import { ROUTE_NAMES, ROSTER_ROUTE_NAMES, path } from '@/constants/constants';
import type { MenuMetaData } from '@/types/types';

const tileData: MenuMetaData[] = [
  {
    title: 'CREATE NEW',
    route: path(ROUTE_NAMES.ROSTER) + path(ROSTER_ROUTE_NAMES.NEW)
  },
  {
    title: 'VIEW ROSTERS',
    route: path(ROUTE_NAMES.ROSTER) + path(ROSTER_ROUTE_NAMES.VIEW)
  },
  {
    title: 'ARCHIVED',
    route: path(ROUTE_NAMES.ROSTER) + path(ROSTER_ROUTE_NAMES.ARCHIVED)
  }
]
const shift = Math.floor(Math.random() * 4)
</script>
<template>
  <main>
    <template v-for="(data, index) in tileData" :key="data.title">
      <MenuTile :data="data" :index="index + shift" />
    </template>
  </main>
</template>