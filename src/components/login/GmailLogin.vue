<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { useGlobalToast } from '@/utils/toast'
import { GoogleLogin } from 'vue3-google-login'

const globalToast = useGlobalToast()
const callback = async (response: any) => {
  // This callback will be triggered when the user selects or login to
  // his Google account from the popup
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: response.credential
  })
  if (error) {
    alert('Error' + JSON.stringify(error))
  } else {
    globalToast.success("Logged in successfully!")
  }
}
</script>

<template>
  <GoogleLogin :callback="callback" />
</template>
