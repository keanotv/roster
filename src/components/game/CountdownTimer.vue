<script setup lang="ts">
import { getCountdownData } from '@/utils/game';
import VueCountdown from '@chenfengyuan/vue-countdown'
import InterviewVideos from '@/components/game/InterviewVideos.vue'
import { onMounted, ref } from 'vue';
const transformSlotProps = (props: any[]) => {
  const formattedProps: any = {};
  Object.entries(props).forEach(([key, value]) => {
    formattedProps[key] = value < 10 ? `0${value}` : String(value);
  });

  return formattedProps;
}
const countdownStarted = ref(false)
const countdownEnded = ref(false)
const videoRevealed = ref(false)
const remainingTime = ref(0)
const endDateString = ref("")

const updateCountdown = async () => {
  const data = await getCountdownData()
  if (data) {
    if (data.started) {
      countdownEnded.value = false
      const end = new Date()
      end.setHours(Number(data.end.split(':')[0]))
      end.setMinutes(Number(data.end.split(':')[1]))
      end.setSeconds(0)
      end.setMilliseconds(0)
      remainingTime.value = end.getTime() - (new Date()).getTime()
      endDateString.value = end.toLocaleTimeString()
      countdownStarted.value = true
    } else {
      countdownEnded.value = false
      countdownStarted.value = false
    }
    videoRevealed.value = data.video
  }
}

onMounted(async () => {
  updateCountdown()
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      updateCountdown()
    }
  })
})
</script>

<template>
  <VueCountdown :time="remainingTime" :transform="transformSlotProps" :interval="100"
    @end="() => { if (countdownStarted) countdownEnded = true }" v-slot="{ hours, minutes, seconds, milliseconds }">
    <div class="grid place-items-center h-36 mb-2">
      <div>
        <p class="text-center">Time remaining: </p>
        <p v-if="countdownEnded" class="text-center text-3xl">00h:00m:00s</p>
        <p v-else-if="countdownStarted" :class="{ 'ticker': countdownStarted }" class="text-center text-4xl">
          {{ hours }}h:{{ minutes }}m:{{ seconds }}s.{{ Math.floor(milliseconds / 100) }}
        </p>
        <p v-else class="text-3xl">??h:??m:??s</p>
        <p v-if="countdownEnded" class="text-center text-sm">Time's up! Please return to the ballroom</p>
        <p v-else-if="countdownStarted" class="text-center text-sm">Counting down to {{ endDateString }}</p>
      </div>
    </div>
  </VueCountdown>
  <template v-if="videoRevealed">
    <div class="grid place-items-center gap-4">
      <InterviewVideos />
    </div>
  </template>
</template>

<style scoped>
.ticker {
  -webkit-animation: ticking 4s infinite;
  -moz-animation: ticking 4s infinite;
  -o-animation: ticking 4s infinite;
  animation: ticking 4s infinite;
}

@keyframes ticking {
  0% {
    color: red;
  }

  15% {
    color: white;
  }

  30% {
    color: red;
  }

  100% {
    color: red;
  }
}
</style>