<script setup lang="ts">
import { fetchGameAnswers } from '@/utils/game';
import type { AnswerRow } from '@/utils/supabase';
import { onMounted, ref } from 'vue';


const gameAnswers = ref([] as AnswerRow[])

const loadGameAnswers = async () => {
  gameAnswers.value = await fetchGameAnswers()
}

onMounted(() => {
  loadGameAnswers()
})

const getFormattedTime = (createdAt: string) => {
  const createdAtDate = new Date(createdAt)
  return createdAtDate.toLocaleTimeString().concat(' +' + createdAtDate.getMilliseconds())
}
</script>

<template>
  <div class="m-8 mb-16 flex justify-center">
    <div class="w-[100%] max-w-[480px]">
      <p class="mb-4 font-bold text-lg">Game Answers</p>
      <template v-for="(answer, index) in gameAnswers" v-bind:key="answer.id">
        <div>
          <hr>
          <div class="my-4">
            <p class="font-bold">{{ index + 1 }}: {{ answer.vg }}</p>
            <p class="mb-2">Submitted at: {{ getFormattedTime(answer.created_at) }}</p>
            <p class="mb-1">{{ '1) ' + answer.answer!.split('|')[0] }}</p>
            <p>{{ '2) ' + answer.answer!.split('|')[1] }}</p>
          </div>
        </div>
      </template>
      <hr>
      <button @click.prevent="loadGameAnswers"
        class="my-4 items-center justify-center p-2 font-medium rounded-lg border-solid border">
        Refresh
      </button>
    </div>
  </div>
</template>

<style scoped>
hr {
  border-color: var(--color-text);
  margin: 1rem auto;
}
</style>