<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { ButtonLogin } from 'televue'
import TelegramButtonLoader from '@/components/loaders/TelegramButtonLoader.vue'
import type { TelegramUser } from 'user-types'
import { onBeforeMount, onMounted, ref } from 'vue'
import { sendError } from '@/utils/supabase'

const loginWithTelegram = async (user: TelegramUser) => {
  try {
    userStore.login(user)
  } catch (error) {
    if (error instanceof Error) {
      sendError(error)
    }
  }
}
const userStore = useUserStore()

const isLoading = ref(true)
const isLoadingForTooLong = ref(false)

onBeforeMount(() => {
  if (userStore.user.isLoggedIn) {
    isLoading.value = false
  }
})
onMounted(() => {
  function setLoadingToFalseOnTelegramResponseReady(event: MessageEvent) {
    if (event.isTrusted && event.origin === 'https://oauth.telegram.org') {
      try {
        const data = JSON.parse(event.data)
        if (data?.event && data?.event === 'ready') {
          // setTimeout(() => {
          //     isLoading.value = false;
          // }, 20000);
          isLoading.value = false
          window.removeEventListener(
            'message',
            setLoadingToFalseOnTelegramResponseReady
          )
        }
      } catch (err) {
        console.debug(err)
      }
    }
  }
  window.addEventListener('message', setLoadingToFalseOnTelegramResponseReady)
  // if loading for too long, inform user of telegram issue
  setTimeout(() => {
    if (isLoading.value === true) {
      isLoadingForTooLong.value = true
    }
  }, 7_000)
})
</script>

<template>
  <div v-show="isLoading" class="item">
    <TelegramButtonLoader />
  </div>
  <span v-show="isLoading && isLoadingForTooLong" class="fade-in prompt">
    We are experiencing an issue loading the Telegram login button. Please
    refresh the page or try again later.
  </span>
  <div
    v-if="!userStore.user.isLoggedIn"
    v-show="!isLoading"
    class="item fade-in"
  >
    <ButtonLogin
      mode="callback"
      size="large"
      bot-username="v_camp_bot"
      request-access="write"
      @callback="loginWithTelegram"
    />
  </div>
</template>

<style scoped>
.item {
  padding-top: 1rem;
}

.fade-in {
  opacity: 1;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 0.75s;
}

@keyframes fadeInOpacity {
  0% {
    opacity: 0.35;
  }

  100% {
    opacity: 1;
  }
}
</style>
