<script setup lang="ts">
import { getCountdownData, updateCountdownData, type CountdownData } from '@/utils/game';
import { useGlobalToast } from '@/utils/toast';
import { onMounted, ref } from 'vue';

const countdownData = ref({
  id: 0,
  end: "00:00",
  started: false,
  video: false,
  reveal: false
} as CountdownData)
const originalData = ref(JSON.stringify(countdownData.value))

onMounted(() => {
  getCountdownData().then(data => {
    countdownData.value = data
    originalData.value = JSON.stringify(countdownData.value)
  })
})

const updateReady = ref(false)
const isLoading = ref(false)
let hasError = false
const globalToast = useGlobalToast()

const endEl = ref(null as unknown as HTMLParagraphElement)

const validate = () => {
  if (endEl.value.innerText.match(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)) {
    countdownData.value.end = endEl.value.innerText
    hasError = false
    checkDiffAndValid()
  } else {
    hasError = true
    globalToast.error("Please check time format")
    checkDiffAndValid()
  }
}

const checkStarted = () => {
  countdownData.value.started = !countdownData.value.started
  checkDiffAndValid()
}

const checkVideo = () => {
  countdownData.value.video = !countdownData.value.video
  checkDiffAndValid()
}

const checkReveal = () => {
  countdownData.value.reveal = !countdownData.value.reveal
  checkDiffAndValid()
}

const checkDiffAndValid = () => {
  if (originalData.value != JSON.stringify(countdownData.value) && !hasError) {
    updateReady.value = true
  } else {
    updateReady.value = false
  }
}

const sendUpdate = async () => {
  updateReady.value = false
  isLoading.value = true
  const success = await updateCountdownData(countdownData.value)
  if (success) {
    originalData.value = JSON.stringify(countdownData.value)
    checkDiffAndValid()
  }
  isLoading.value = false
}
</script>

<template>
  <div class="mx-4 grid grid-cols-3 grid-rows-2 gap-4 place-items-center">
    <div>
      <p class="text-center text-xs p-1">HH:MM (24h)</p>
      <p class="text-center p-1 px-2 countdown-setter" ref="endEl" contenteditable spellcheck="false" @blur="validate">
        {{ countdownData!.end }}</p>
    </div>
    <div class="grid place-items-center">
      <p class="text-sm">start</p>
      <input class="my-2 w-4 h-4" v-model="countdownData.started" type="checkbox" @click="checkStarted" />
    </div>
    <div class="row-span-2">
      <button :disabled="!updateReady" class="text-sm update-button p-1 px-2 rounded-md w-18"
        :class="{ 'opacity-50': !updateReady }" @click.prevent="sendUpdate">
        <template v-if="isLoading">
          <line-md:loading-alt-loop class="icon" />
        </template>
        <template v-else>UPDATE</template>
      </button>
    </div>
    <div class="grid place-items-center">
      <p class="text-sm">videos</p>
      <input class="my-2 w-4 h-4" v-model="countdownData.video" type="checkbox" @click="checkVideo" />
    </div>
    <div class="grid place-items-center">
      <p class="text-sm">reveal game</p>
      <input class="my-2 w-4 h-4" v-model="countdownData.reveal" type="checkbox" @click="checkReveal" />
    </div>
  </div>
</template>

<style scoped>
.countdown-setter {
  border: solid 1px;
  border-color: var(--color-border);
}

.update-button {
  border-width: 1px;
  border-color: var(--color-border);
  margin: 2rem 0rem;
}
</style>