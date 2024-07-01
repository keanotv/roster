<script setup lang="ts">
import PoliceLine from './PoliceLine.vue';
import { useFormStore } from '@/stores/form';

const formStore = useFormStore()
</script>

<template>
  <PoliceLine />
  <div class="m-8 mt-6 mb-16 submit-answer">
    <form @submit.prevent="() => {
      if (!formStore.isSubmitting) formStore.submitGameAnswer()
    }" class="w-[100%] max-w-[480px]">
      <div class="grid place-items-center">
        <line-md:search-twotone class="w-8 h-8 mb-2" />
        <h1 class="mb-6 font-bold">SOLVE THE MYSTERY</h1>
      </div>
      <div class="mb-2 ml-1">
        <p class="font-bold text-sm">Batch & VG</p>
        <p class="text-xs">e.g. Batch 3 - NUS Healthcare</p>
      </div>
      <input placeholder="Batch X - VG" :class="{ 'cursor-not-allowed': formStore.isSubmitting }"
        class="w-[100%] mb-3 rounded-lg p-1 pl-2 hover:bg-orange-200 hover:outline-none" type="text"
        v-model.lazy="formStore.gameForm.vg" :disabled="formStore.isSubmitting">
      <div class="mb-2 ml-1">
        <p class="font-bold text-sm">1) Who took the Golden Donut?</p>
        <p class="text-xs">* Please state your evidence</p>
      </div>
      <textarea maxlength="1000" placeholder="Person A took the donut..."
        :class="{ 'cursor-not-allowed': formStore.isSubmitting }"
        class="mb-2 rounded-lg p-1 pl-2 hover:bg-orange-200 hover:outline-none" rows="5"
        v-model.lazy="formStore.gameForm.answerPt1" :disabled="formStore.isSubmitting">
    </textarea>
      <div class="mb-2 ml-1">
        <p class="font-bold text-sm">2) Where is the Golden Donut now?</p>
        <p class="text-xs">* Please state your evidence</p>
      </div>
      <textarea maxlength="1000" placeholder="The donut is at..."
        :class="{ 'cursor-not-allowed': formStore.isSubmitting }"
        class="mb-4 rounded-lg p-1 pl-2 hover:bg-orange-200 hover:outline-none" rows="5"
        v-model.lazy="formStore.gameForm.answerPt2" :disabled="formStore.isSubmitting">
    </textarea>
      <button :class="{ 'cursor-not-allowed': formStore.isSubmitting }"
        class="items-center justify-center p-2 font-medium rounded-lg border-solid border" type="submit"
        :disabled="formStore.isSubmitting">
        Submit
      </button>
    </form>
  </div>
</template>

<style>
.submit-answer {
  display: flex;
  justify-content: center;
}

h1 {
  font-size: large;
}

input,
textarea {
  width: 100%;
  height: auto;
  color: var(--vt-c-text-light-1);
  font-family: 'PPMori', 'Space Mono';
}
</style>