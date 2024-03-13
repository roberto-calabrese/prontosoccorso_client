<template>
  <v-snackbar
      v-model="snackbar.active"
      elevation="24"
      :color="snackbar.color"
  >
    {{ snackbar.text }}
    <template v-slot:actions>
      <v-btn
          color="red"
          variant="text"
          @click="snackbar.active = false"
      >
        Chiudi
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import {useCoreStore} from "~/store/core";
const { snackbar } = useCoreStore();



// const props = defineProps({
//     active: {
//       default: false,
//       type: Boolean
//     },
//     text: String,
//     color: String
//   })
//
//   const snackbar = ref(props.active);

</script>