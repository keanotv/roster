<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
const userStore = useUserStore()

const handleSubmitPassword = async () => {
  isLoggingIn.value = true
  await userStore.login(password.value)
  isLoggingIn.value = false
}

const password = ref('')
const isLoggingIn = ref(false)
</script>

<template>
  <div class="grid place-items-center h-[80vh]">
    <div>
      <h1 class="text-center">Hello, beloved!</h1>
      <div class="mb-12">
        <BForm
          class="flex mt-4 mb-2 gap-2"
          @submit.prevent="handleSubmitPassword"
        >
          <BInput
            id="password"
            type="password"
            v-model.lazy="password"
            :disabled="isLoggingIn"
          />
          <BButton type="submit" :disabled="isLoggingIn">Enter</BButton>
        </BForm>
        <p class="text-center">Please enter password to proceed</p>
      </div>
    </div>
  </div>
</template>
