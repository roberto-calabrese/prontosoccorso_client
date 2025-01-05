<template>
  <v-theme-provider theme="customLightTheme">
    <v-app>
      <v-main class="background-main">
        <slot/>
      </v-main>
      <core-snack-bar></core-snack-bar>
    </v-app>
  </v-theme-provider>
</template>


<style lang="postcss">
.background-main {
  background-image: linear-gradient(to right top, rgb(var(--v-theme-bg1)), rgb(var(--v-theme-bg2)));
  background-size: 200% auto;
  animation: gradientAnimation 10s linear infinite;
}


@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

</style>
<script setup lang="ts">
</script>