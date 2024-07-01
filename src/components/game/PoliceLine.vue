<script setup lang="ts">
import { SCREEN_SIZE } from '@/constants/constants';
import { useSettingsStore } from '@/stores/settings';
import { ref, watchEffect } from 'vue';
import DirectionalShadow from '../common/DirectionalShadow.vue';

const settingsStore = useSettingsStore();
const multiplier = ref(4)

watchEffect(() => {
  if (settingsStore.screenWidth > SCREEN_SIZE.MEDIUM) {
    multiplier.value = 7
  } else if (settingsStore.screenWidth > SCREEN_SIZE.SMALL_MEDIUM) {
    multiplier.value = 5
  } else {
    multiplier.value = 4
  }
})

const policeLineSrc = "/camp/police-line.jpg"
</script>

<template>
  <DirectionalShadow :height="3" :up="true" />
  <div class="police-line-container">
    <div class="scroll">
      <template v-for="i in multiplier" v-bind:key="i">
        <div class="item">
          <img :src="policeLineSrc" />
        </div>
      </template>
    </div>
    <div class="scroll-two">
      <template v-for="i in multiplier" v-bind:key="i">
        <div class="item">
          <img :src="policeLineSrc" />
        </div>
      </template>
    </div>
  </div>
  <DirectionalShadow :height="3" :up="false" />
</template>

<style scoped>
.police-line-container {
  background-color: #fad320;
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  position: relative;
  white-space: nowrap;
  display: flex;
}

.police-line-container .scroll {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: fit-content;
  white-space: nowrap;
  animation: loop 24s linear infinite;
}

.police-line-container .scroll-two {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: fit-content;
  white-space: nowrap;
  animation: loop-two 24s linear infinite;
  animation-delay: 12s;
  transform: translateX(100%);
}

.item {
  display: flex;
  align-items: center;
  height: calc((4vw + 8vh)/2);
}

img {
  height: 100%;
}

@keyframes loop {
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-100%);
  }
}

@keyframes loop-two {
  0% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(-200%);
  }
}
</style>