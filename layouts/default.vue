<template>
  <v-app>
    <core-layout-nav/>
    <v-main class="background-main">
      <slot/>
    </v-main>
    <core-layout-footer/>
    <core-snack-bar></core-snack-bar>
    <cookie-banner></cookie-banner>
  </v-app>
</template>


<style lang="postcss">
.background-main {
  background-image: linear-gradient(to right top, #393c3c, #3c4041, #3f4546, #434a4b, #464e51, #495256, #4d565a, #505a5f, #545e65, #59636b, #5e6770, #636b76);
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

@keyframes animationLogo {
  0% {
    color: red;
    stroke: red;
  }
  25% {
    color: yellow;
    stroke: yellow;
  }
  50% {
    color: green;
    stroke: green;
  }
  75% {
    color: white;
    stroke: white;
  }
  100% {
    color: red;
    stroke: red;
  }
}

</style>
<script setup lang="ts">
</script>