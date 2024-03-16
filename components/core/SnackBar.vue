<template>
  <div>
    <v-snackbar
        v-for="(snackbar, index) in snackbars"
        :key="index"
        v-model="snackbar.active"
        elevation="24"
        :color="snackbar.color"
        timeout="10000"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
            variant="text"
            @click="closeSnackbar(index)"
        >
          Chiudi
        </v-btn>
      </template>
    </v-snackbar>
    <core-check-is-online />
  </div>
</template>

<script setup lang="ts">
import {useCoreStore} from "~/store/core";
const {snackbars, closeSnackbar, openSnackbar} = useCoreStore();

</script>
