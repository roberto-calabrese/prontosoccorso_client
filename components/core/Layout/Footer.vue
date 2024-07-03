<template>
  <v-footer
      height="30"
      style="max-height: 30px;"
      :app="!mobile"
      class="d-flex flex-column pa-0"
      elevation="10"
  >
    <div class="px-4 p-0 text-center w-100 text-overline">
      <strong>PS</strong> {{ new Date().getFullYear() }} — <strong><a class="text-white text-decoration-none" href="https://github.com/roberto-calabrese" target="_blank"><v-icon icon="mdi-git"></v-icon> Roberto Calabrese</a></strong> —
      <span class="font-weight-thin font-italic"> v.0.10 Beta</span>
    </div>
  </v-footer>
</template>


<script setup lang="ts">
import {useDisplay} from "vuetify";
const {mobile} = useDisplay()

</script>