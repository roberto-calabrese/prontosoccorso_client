<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card class="text-center">
      <v-card-title class="headline">Ruota il dispositivo</v-card-title>
      <v-card-text>
        <v-icon large class="rotate-icon">mdi-rotate-3d</v-icon>
        <p>Per una migliore esperienza, ruota il dispositivo in orizzontale.</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">Ho capito</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default {
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    checkOrientation() {
      const dialogShown = localStorage.getItem('dialogShown');

      if (!dialogShown && window.innerHeight > window.innerWidth) {
        this.dialog = true;
        localStorage.setItem('dialogShown', 'true');
      }
    },
    closeDialog() {
      this.dialog = false;
    },
  },
  mounted() {
    this.checkOrientation();
    // window.addEventListener("resize", this.checkOrientation);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkOrientation);
  },
};
</script>

<style scoped>
.rotate-icon {
  font-size: 48px;
  color: #f57c00;
}
</style>
