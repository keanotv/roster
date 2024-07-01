<script setup lang="ts">
import { ContentLoader } from 'vue-content-loader'
</script>

<template>
  <div class="fade-in">
    <ContentLoader
      width="225"
      height="40"
      viewBox="0 0 225 40"
      primaryColor="#000000"
      secondaryColor="#111111"
      :primaryOpacity="0.1"
      :secondaryOpacity="0.7"
      :speed="0.77"
    >
      <rect x="0" y="0" rx="20" ry="20" width="225" height="40" />
    </ContentLoader>
  </div>
</template>

<style scoped>
.fade-in {
  opacity: 1;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 3.5s;
}

@keyframes fadeInOpacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
