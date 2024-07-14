<template>
  <div class="">
    <v-btn append-icon="mdi-crosshairs-gps" @click="sheet = !sheet" :color="gpsOk ? 'green' : ''">
      GPS
      <template v-slot:append>
        <v-icon size="x-large"></v-icon>
      </template>
    </v-btn>
    <v-bottom-sheet v-model=  "sheet" inset>
      <v-card
          class=""
          height="120px"
      >
        <v-card-text>
          <v-row align="center" justify="space-between">
            <v-col cols="6">
              <v-switch
                  v-model="geolocationEnabled"
                  @change="toggleGeolocation"
                  color="primary"
                  label="on">
                <template v-slot:label>
                  {{ messageSwitch }}
                  <v-progress-circular v-if="geolocationEnabled && !userPosition"
                      :indeterminate="geolocationEnabled && !userPosition"
                      class="ms-2"
                      size="24"
                  ></v-progress-circular>
                </template>
              </v-switch>
            </v-col>
            <v-col cols="6">
              <div v-if="geolocationEnabled && userPosition">
                <div>Lat: {{ userPosition.latitude }}</div>
                <div>Lng: {{ userPosition.longitude }}</div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {useGeolocationStore} from '~/store/geolocation';

const geolocationStore = useGeolocationStore();
const geolocationEnabled = ref(geolocationStore.geolocation.init);

const toggleGeolocation = () => {
  if (geolocationEnabled.value) {
    geolocationStore.trackPosition();
  } else {
    geolocationStore.clearWatch();
  }
};

watch(() => geolocationStore.geolocation.init, (newValue) => {
  geolocationEnabled.value = newValue;
});

const userPosition = computed(() => geolocationStore.userPosition);

const sheet = ref(false)

const messageSwitch = computed(() => (geolocationEnabled.value ? "Disattiva GPS" : "Attiva GPS"));

const gpsOk  = computed(() => geolocationEnabled.value && userPosition);

</script>
