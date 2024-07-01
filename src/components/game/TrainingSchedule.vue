<script setup lang="ts">
import { onMounted, ref } from 'vue';
import StationCell from './table/StationCell.vue';
import ExpRoomCell from './table/ExpRoomCell.vue';
import { getStartTimeAndDurationArrayString } from '@/utils/game';

const durationArr: number[] = new Array(25)
durationArr.fill(5);
const durations = ref(durationArr)

const timings = ref([] as string[])

const updateTimings = async () => {
  const timingsArr = []
  const data = await getStartTimeAndDurationArrayString()
  timingsArr.push(data.time)
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

onMounted(() => {
  updateTimings()
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      updateTimings()
    }
  })
})

</script>

<template>
  <div class="grid place-items-center">
    <div class="mt-8 mb-4 grid place-items-center">
      <p class="font-bold underline">TRAINING SCHEDULE</p>
    </div>
    <div class="schedule mb-8">
      <table class="time-table">
        <thead>
          <tr>
            <th class="move">
              <p class="font-bold py-1">Time</p>
            </th>
          </tr>
        </thead>
        <template v-for="timing in timings" :key="timing">
          <tr>
            <td>
              {{ timing }}
            </td>
          </tr>
        </template>
      </table>
      <table>
        <thead>
          <tr>
            <template v-for="i in 8">
              <th>
                <p class="px-4 py-1 font-bold">Batch {{ i }}</p>
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
  </div>
</template>

<style scoped>
.move {
  background-color: rgba(177, 177, 177, 0.719);
}

.schedule {
  display: flex;
  width: 100vw;
  max-width: 960px;
  overflow-x: auto;
  white-space: nowrap;
}

.time-table {
  position: sticky;
  left: 0;
  z-index: 100;
}

.time-table tr {
  background-color: var(--color-background);
}

table {
  border-collapse: collapse;
  font-size: 0.5rem;
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
</style>