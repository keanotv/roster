<script setup lang="ts">
import { getStartTimeAndDurationArrayString, updateTimingsData } from '@/utils/game';
import { useGlobalToast } from '@/utils/toast';
import { onMounted, ref } from 'vue';

const durationArr: number[] = new Array(25)
durationArr.fill(5);
const durations = ref(durationArr)
const startTime = ref("14:20")
const startTimeEl = ref(null as unknown as HTMLParagraphElement)

const timings = ref([] as string[])

const updateReady = ref(false)
let hasError = false
const isLoading = ref(false)
const globalToast = useGlobalToast()

const timingsData = ref({
  id: 0,
  time: "14:20",
  durations: "[5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]"
})
const originalData = ref(JSON.stringify(timingsData))

const updateTimings = async () => {
  const timingsArr = []
  const data = await getStartTimeAndDurationArrayString()
  timingsArr.push(data.time)
  startTime.value = data.time
  if (data.durations !== null) {
    durations.value = JSON.parse(data.durations)
  }
  let time = new Date()
  time.setHours(Number(data.time.split(':')[0]))
  time.setMinutes(Number(data.time.split(':')[1]))
  durations.value.forEach(durationInMinutes => {
    time = new Date(time.getTime() + durationInMinutes * 60000)
    timingsArr.push(time.toTimeString().substring(0, 5))
  })
  timings.value = timingsArr
}

const updateTimingsFromDurationRef = () => {
  const timingsArr = []
  timingsArr.push(startTime.value)
  let time = new Date()
  time.setHours(Number(startTime.value.split(':')[0]))
  time.setMinutes(Number(startTime.value.split(':')[1]))
  durations.value.forEach(durationInMinutes => {
    time = new Date(time.getTime() + durationInMinutes * 60000)
    timingsArr.push(time.toTimeString().substring(0, 5))
  })
  timings.value = timingsArr
  timingsData.value.time = startTime.value
  timingsData.value.durations = JSON.stringify(durations.value)
  checkDiffAndValid()
}

const validateDuration = (index: number, e: Event) => {
  if ((e.target as HTMLParagraphElement).innerText.match(/^\d+$/)) {
    durations.value[index] = Number((e.target as HTMLParagraphElement).innerText)
    updateTimingsFromDurationRef()
    hasError = false
  } else {
    hasError = true
    globalToast.error("Please check duration value")
  }
}

const validateStartTime = () => {
  if (startTimeEl.value.innerText.match(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)) {
    startTime.value = startTimeEl.value.innerText
    hasError = false
    updateTimingsFromDurationRef()
  } else {
    hasError = true
    globalToast.error("Please check time format")
  }
}

const checkDiffAndValid = () => {
  if (originalData.value != JSON.stringify(timingsData.value) && !hasError) {
    updateReady.value = true
  } else {
    updateReady.value = false
  }
}

onMounted(() => {
  updateTimings()
  getStartTimeAndDurationArrayString().then(data => {
    timingsData.value = data
    originalData.value = JSON.stringify(timingsData.value)
  })
})

const sendUpdate = async () => {
  updateReady.value = false
  isLoading.value = true
  const success = await updateTimingsData(timingsData.value)
  if (success) {
    originalData.value = JSON.stringify(timingsData.value)
    checkDiffAndValid()
  }
  isLoading.value = false
}
</script>

<template>
  <div class="my-8 grid place-items-center">
    <div class="mb-4">
      <p class="text-center text-xs p-1">HH:MM (24h)</p>
      <p class="text-center p-1 px-2 starttime-setter" ref="startTimeEl" contenteditable spellcheck="false"
        @blur="validateStartTime">
        {{ startTime }}</p>
    </div>
    <div class="schedule">
      <table class="time-table">
        <thead>
          <tr>
            <th class="move">
              <p class="font-bold">Duration</p>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(duration, index) in durations" :key="index">
            <tr>
              <td>
                <p ref="editedEl" @blur.prevent="(e) => {
                  validateDuration(index, e)
                }" contenteditable>{{ duration }}</p>
              </td>
            </tr>
          </template>
          <tr>
            <td>-</td>
          </tr>
        </tbody>
      </table>
      <table class="time-table">
        <thead>
          <tr>
            <th class="move">
              <p class="font-bold">Time</p>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(timing, index) in timings" :key="index">
            <tr>
              <td>
                {{ timing }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <template v-for="i in 8">
              <th>
                <p class="px-4 font-bold">{{ i }}</p>
              </th>
            </template>
            <th class="move">Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="hidden"></td>
            <td rowspan="2" colspan="8">
              Discussion + Movement
            </td>
            <td>{{ timings[0] }}</td>
          </tr>
          <tr>
            <td>{{ timings[1] }}</td>
          </tr>
          <tr>
            <StationCell letter="A" />
            <StationCell letter="B" />
            <StationCell letter="C" />
            <StationCell letter="D" />
            <StationCell letter="E" />
            <StationCell letter="F" />
            <ExpRoomCell />
            <td>{{ timings[2] }}</td>
          </tr>
          <tr>
            <td>{{ timings[3] }}</td>
          </tr>
          <tr>
            <td>{{ timings[4] }}</td>
          </tr>
          <tr>
            <td colspan="4"></td>
            <td class="move" colspan="2">move to exp room</td>
            <td>{{ timings[5] }}</td>
          </tr>
          <tr>
            <StationCell letter="C" />
            <StationCell letter="D" />
            <StationCell letter="E" />
            <StationCell letter="F" />
            <ExpRoomCell />
            <td class="move" colspan="2">move from exp room</td>
            <td>{{ timings[6] }}</td>
          </tr>
          <tr>
            <StationCell letter="A" />
            <StationCell letter="B" />
            <td>{{ timings[7] }}</td>
          </tr>
          <tr>
            <td>{{ timings[8] }}</td>
          </tr>
          <tr>
            <td colspan="2"></td>
            <td class="move" colspan="2">move to exp room</td>
            <td>{{ timings[9] }}</td>
          </tr>
          <tr>
            <StationCell letter="E" />
            <StationCell letter="F" />
            <ExpRoomCell />
            <td class="move" colspan="2">move from exp room</td>
            <td colspan="2"></td>
            <td>{{ timings[10] }}</td>
          </tr>
          <tr>
            <StationCell letter="A" />
            <StationCell letter="B" />
            <StationCell letter="C" />
            <StationCell letter="D" />
            <td>{{ timings[11] }}</td>
          </tr>
          <tr>
            <td>{{ timings[12] }}</td>
          </tr>
          <tr>
            <td class="move" colspan="2">move to exp room</td>
            <td>{{ timings[13] }}</td>
          </tr>
          <tr>
            <ExpRoomCell />
            <td class="move" colspan="2">move from exp room</td>
            <td colspan="4"></td>
            <td>{{ timings[14] }}</td>
          </tr>
          <tr>
            <StationCell letter="A" />
            <StationCell letter="B" />
            <StationCell letter="C" />
            <StationCell letter="D" />
            <StationCell letter="E" />
            <StationCell letter="F" />
            <td>{{ timings[15] }}</td>
          </tr>
          <tr>
            <td>{{ timings[16] }}</td>
          </tr>
          <tr>
            <td>{{ timings[17] }}</td>
          </tr>
          <tr>
            <td rowspan="3" colspan="8">Buffer + Interview Rooms</td>
            <td>{{ timings[18] }}</td>
          </tr>
          <tr>
            <td>{{ timings[19] }}</td>
          </tr>
          <tr>
            <td>{{ timings[20] }}</td>
          </tr>
          <tr>
            <td rowspan="2" colspan="8">Submit Answers by {{ timings[23] }}</td>
            <td>{{ timings[21] }}</td>
          </tr>
          <tr>
            <td>{{ timings[22] }}</td>
          </tr>
          <tr>
            <td rowspan="3" colspan="8">Final Reveal</td>
            <td>{{ timings[23] }}</td>
          </tr>
          <tr>
            <td>{{ timings[24] }}</td>
          </tr>
          <tr>
            <td>{{ timings[25] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <button :disabled="!updateReady" class="text-sm update-button p-1 px-2 rounded-md w-18"
      :class="{ 'opacity-50': !updateReady }" @click.prevent="sendUpdate">
      <template v-if="isLoading">
        <line-md:loading-alt-loop class="icon" />
      </template>
      <template v-else>UPDATE</template>
    </button>
  </div>
</template>

<style scoped>
.schedule {
  display: flex;
  width: 100vw;
  max-width: 960px;
  overflow-x: auto;
  white-space: nowrap;
}

table {
  border-collapse: collapse;
  table-layout: fixed;
}

th,
td {
  border: 1px solid;
  border-color: var(--color-border-alt);
  padding: 0.2rem 0.4rem;
  text-align: center;
  max-width: 120px;
  width: 18vw;
  height: 1rem;
  font-weight: bold;

  @media (min-width: 600px) {
    max-width: 120px;
  }
}

.starttime-setter {
  border: solid 1px;
  border-color: var(--color-border);
}

.update-button {
  border-width: 1px;
  border-color: var(--color-border);
  margin: 2rem 0rem;
}
</style>