<script setup lang="ts">
import WelcomeItem from '@/components/WelcomeItem.vue'
import { campDates, LINKS, SCREEN_SIZE } from '@/constants/constants';
import { useSettingsStore } from '@/stores/settings';
import { ref, watchEffect } from 'vue';

const masterclass = ref('Master-classes')
const settingsStore = useSettingsStore()
watchEffect(() => {
  if (settingsStore.screenWidth > SCREEN_SIZE.SMALLER) {
    masterclass.value = 'Masterclasses'
  } else {
    masterclass.value = 'Master-classes'
  }
})

const today = new Date()
</script>

<template>
  <main>
    <div class="m-8 mb-4">
      <WelcomeItem>
        <template #icon>
          <line-md:calendar class="w-10 h-10" />
        </template>
        <template #heading>Camp Program</template>
        Do join the <a :href="LINKS.TELEGRAM" target="_blank" rel="noopener noreferrer">V Camp 2024
          Telegram
          Channel</a> for the
        latest
        updates!
      </WelcomeItem>
    </div>
    <div class="m-4">
      <table>
        <thead>
          <tr>
            <template v-for="campDate, index in campDates" v-bind:key="index">
              <th v-if="campDate.date === today.getDate() && today.getMonth() == 5">
                <line-md:arrow-down class="w-full h-full" />
              </th>
              <th v-else>
                {{ campDate.day }}<br>
                {{ campDate.date }} June<br>
                Day {{ index + 1 }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr id="top">
            <td rowspan="5">Travel to Sunway</td>
          </tr>
          <tr>
            <td class="meal" colspan="4">Breakfast</td>
          </tr>
          <tr>
            <td class="text-xs">Sons & Daughters</td>
            <td colspan="2">Morning Session</td>
            <td rowspan="10">Travel back to SG</td>
          </tr>
          <tr>
            <td class="meal" colspan="3">Lunch</td>
          </tr>
          <tr>
            <td colspan="2" class="afternoon">Afternoon Session</td>
            <td rowspan="2">Cluster Session <br> × <br> OTOT Dinner</td>
          </tr>
          <tr>
            <td class="meal" colspan="3">Dinner</td>
          </tr>
          <tr>
            <td>Opening Night</td>
            <td colspan="2">Night Session</td>
            <td>Finale Night</td>
          </tr>
          <tr>
            <td id="btm" class="meal" colspan="4">Supper</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped>
a {
  z-index: 101;
}

table {
  width: 100%;
  word-wrap: break-word;
  border-collapse: collapse;
  font-size: 0.82rem;
  table-layout: fixed;

  @media (min-width: 600px) {
    font-size: 0.9rem;
  }

  @media (min-width: 900px) {
    font-size: 1rem;
  }
}

thead {
  background-color: #f2410181;
}

th,
td {
  border: 1px solid;
  border-color: var(--color-border-alt);
  padding: 0.7rem 0.2rem;
  text-align: center;
  height: 4rem;
  min-width: 65px;

  @media (min-width: 600px) {
    padding: 0.5rem;
    height: 5rem;
  }
}

.afternoon {
  height: 5rem;
}

.meal {
  height: 1.2rem;

  @media (min-width: 600px) {
    height: 1.7rem;
  }
}

td:last-of-type {
  text-align: center;
}

tbody>tr:nth-of-type(even) {
  background-color: var(--color-text);
  color: var(--color-background);
}

tfoot th {
  text-align: right;
}

tfoot td {
  font-weight: bold;
}
</style>