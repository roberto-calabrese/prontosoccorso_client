<template>
  <v-layout>
    <v-app-bar
        color="teal-darken-4"
        image="https://www.sicilia.info/wp-content/uploads/sites/91/palermo.jpg"
    >
      <template v-slot:image>
        <v-img
            gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>PS</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon
             v-model="darkMode"
             @click="toggleTheme()"
      >
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
      <slot />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";

const theme = useTheme();
let darkMode = ref(false);

const toggleTheme = () => {
  darkMode.value = !darkMode.value
  theme.global.name.value = darkMode.value ? "light" : "customDarkTheme";
  console.log(`Current theme is dark? ${theme.global.current.value.dark}`);
};

// import {VAppBar} from 'vuetify/components/VAppBar'
// import {VApp} from 'vuetify/components/VApp'
// import {VMain} from 'vuetify/components/VMain'
// import {VSwitch} from 'vuetify/components/VSwitch'

</script>