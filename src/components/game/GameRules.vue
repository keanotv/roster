<script setup lang="ts">
import CountdownTimer from '@/components/game/CountdownTimer.vue'
import SubmitGameAnswer from '@/components/game/SubmitGameAnswer.vue'
import PoliceLine from '@/components/game/PoliceLine.vue'
import DirectionalShadow from '../common/DirectionalShadow.vue';
import GameMap1 from '@/components/game/GameMap1.vue';
import GameMap2 from '@/components/game/GameMap2.vue';
import TrainingSchedule from '@/components/game/TrainingSchedule.vue'
import { caseFiles } from '@/utils/game'
import CaseFile from './CaseFile.vue';
import { ref } from 'vue';

const index = ref(1)
const numFiles = caseFiles.size
const caseFilesArray = Array.from(caseFiles.values())

const next = () => {
  index.value += 1
}

const previous = () => {
  index.value -= 1
}
</script>

<template>
  <div class="m-8 grid place-items-center">
    <img class="w-[155px] my-4"
      src="https://mcymgcjwhmctuzcoecvx.supabase.co/storage/v1/object/public/images/badge.png" />
    <div class="text-justify max-w-[480px]">
      <p>Today, 14 May 2024, at the Golden Donut Ceremony, the Golden Donut was found missing! Your job,
        <i>trainees</i>, is to
        find out (1) who took the donut and (2) where is it now!
      </p>
      <br>
      <p>There were only a few people in the Academy last night with their details set out below. </p>
      <br>
      <p class="font-bold underline">Interviews</p>
      <p>The police will be interviewing each suspect this afternoon. Please complete your training stations
        to earn interview passes for access to these interviews.</p>
      <br>
      <p class="font-bold underline">Crime Scenes (Experience Rooms)</p>
      <p>You should also investigate the kitchen, the holding cells, police office
        and medical office during the scheduled timings. These are potential crime scenes where you might be able to
        find important clues. </p>
      <br>
      <p class="font-bold underline">Timings</p>
      <p>Please refer to the training schedule for the timings you should report to the trainings and
        experience rooms.</p>
      <br>
      <p class="font-bold underline">Locations</p>
      <p>the locations of the stations, crime scenes and interview rooms can be found in the map provided.</p>
      <br>
      <p>Report to the ballroom with your findings before the timer runs out. Donut be late! It's time to get cracking
        trainees, let's get this hole-y bread. 🍩
      </p>
    </div>
  </div>
  <PoliceLine />
  <TrainingSchedule />
  <DirectionalShadow :height="17" :up="true" />
  <template v-for="file in caseFilesArray" v-bind:key="file.index">
    <div :class="{ 'hidden': (file.index !== index) }">
      <CaseFile>
        <template #file-no>{{ file.fileNo }}</template>
        <template #id-no>{{ file.idNo }}</template>
        <template #prisoner-code>{{ file.prisonerCode }}</template>
        <template #mugshot>
          <img class="w-[90%] mt-2" :src="file.mugshotUrl" />
        </template>
        <template #name>{{ file.name }}</template>
        <template #gender>{{ file.gender }}</template>
        <template #dob>{{ file.dob }}</template>
        <template #height>{{ file.height }}</template>
        <template #weight>{{ file.weight }}</template>
        <template #breakdown-1>
          <div class="font-bold" v-html="file.breakdown1"></div>
        </template>
        <template #breakdown-2>
          <div class="font-bold" v-html="file.breakdown2"></div>
        </template>
        <template #breakdown-3>
          <div class="font-bold" v-html="file.breakdown3"></div>
        </template>
        <template #thumbprint>
          <img class="w-[80px] block m-auto" :src="file.thumbprintUrl" />
        </template>
        <template #signature>{{ file.signature }}</template>
      </CaseFile>
    </div>
  </template>
  <div class="mx-6 mb-7 mt-2 file-nav-grid">
    <div>
      <template v-if="index !== 1">
        <div class="cursor-pointer" @click.prevent="previous">
          <p class="font-bold"><line-md:arrow-small-left class="w-6 h-6 mb-1 inline bg-orange-500" /> PREV. FILE</p>
        </div>
      </template>
    </div>
    <div class="grid place-items-center">
      <p class="text-xs">{{ index }}/{{ numFiles }}</p>
    </div>
    <div>
      <template v-if="index !== numFiles">
        <div class="cursor-pointer" @click.prevent="next">
          <p class="font-bold text-end">NEXT FILE <line-md:arrow-small-right
              class="w-6 h-6 mb-1 inline bg-orange-500" /></p>
        </div>
      </template>
    </div>
  </div>
  <DirectionalShadow :height="17" :up="false" />
  <div class="grid place-items-center">
    <GameMap2 />
    <GameMap1 />
  </div>
  <DirectionalShadow :height="17" :up="true" />
  <CountdownTimer />
  <DirectionalShadow :height="17" :up="false" />
  <SubmitGameAnswer />
</template>

<style scoped>
.file-nav-grid {
  display: grid;
  grid-template-columns: 3fr 1fr 3fr;
}

hr {
  border-color: var(--color-text);
  margin: 1rem auto;
}

img {
  filter: sepia(100%) saturate(35%) brightness(100%) hue-rotate(5deg);
}
</style>