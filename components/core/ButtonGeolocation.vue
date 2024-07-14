<template>
  <div>
    <v-btn append-icon="mdi-crosshairs-gps" @click="toggleGeolocation" :color="gpsOk ? 'green' : ''">
      {{ messageSwitch }}
      <v-progress-circular
          v-if="geolocationEnabled && !userPosition"
          :indeterminate="true"
          class="ms-2"
          size="24"
      ></v-progress-circular>
    </v-btn>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useGeolocationStore } from '~/store/geolocation';

const geolocationStore = useGeolocationStore();
const geolocationEnabled = ref(geolocationStore.geolocation.init);

const toggleGeolocation = () => {
  geolocationEnabled.value = !geolocationEnabled.value;
};

watch(geolocationEnabled, (newValue) => {
  if (newValue) {
    geolocationStore.trackPosition();
  } else {
    geolocationStore.clearWatch();
  }
});

watch(() => geolocationStore.geolocation.init, (newValue) => {
  geolocationEnabled.value = newValue;
});

const userPosition = computed(() => geolocationStore.userPosition);

const messageSwitch = computed(() => (geolocationEnabled.value ? "GPS On" : "GPS Off"));

const gpsOk = computed(() => geolocationEnabled.value && userPosition.value);

</script>