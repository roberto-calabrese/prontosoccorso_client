<template>
  <v-footer
      :height="footerHeight"
      :style="{ maxHeight: footerHeight + 'px' }"
      :app="mdAndUp"
      class="d-flex flex-column pa-0"
      elevation="10"
  >
    <div class="px-4 p-0 text-center w-100 text-overline">
      <strong>PS</strong> {{ new Date().getFullYear() }} —
      <strong>
        <a class="text-white text-decoration-none" href="https://github.com/roberto-calabrese" target="_blank">
          <v-icon icon="mdi-github"></v-icon> Roberto Calabrese
        </a>
      </strong> —
      <span class="font-weight-thin font-italic"> v.{{ appVersion }}</span>
      <div class="privacy" :class="{'privacy-mdAndUp': mdAndUp}">
        <v-btn to="/privacy-policy" title="Privacy Policy" size="small" density="compact">Privacy Policy</v-btn>
        <v-btn to="/cookie-policy" title="Cookie Policy" size="small" density="compact">Cookie Policy</v-btn>
      </div>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { computed, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';
// import {useApiStore} from "~/store/api";
// const apiStore = useApiStore();
// onMounted(() => {
//   apiStore.fetchGitHub();
// });
// const stars = computed(() => apiStore.github?.stars || 0);

const config = useRuntimeConfig();
const appVersion = config.public.appVersion;

const { mdAndUp } = useDisplay();

const footerHeight = computed(() => {
  return mdAndUp.value ? 30 : 65;
});
</script>

<style scoped>
.privacy-mdAndUp{
  position: absolute;
  bottom: 0;
  right: 1%;
}

.privacy a {
  color: #a8a7a7;
  margin-left: 10px;
  text-underline: none;
}
</style>
