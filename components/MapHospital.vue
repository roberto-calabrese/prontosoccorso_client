<template>
  <div id="map" :style="{ height: '400px', width: '100%' }"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useGeolocationStore } from '@/store/geolocation'; // Assicurati di usare il percorso corretto
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MappaProps {
  lat: string;
  lng: string;
  tipo: string;
}

export default defineComponent({
  name: 'Mappa',
  props: {
    lat: {
      type: String,
      required: true,
    },
    lng: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  setup(props: MappaProps) {
    const map = ref<L.Map | null>(null);
    const userMarker = ref<L.Marker | null>(null);
    const geolocationStore = useGeolocationStore();

    const userIcon = L.divIcon({
      className: 'user-icon',
      html: '<div class="pulse"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    onMounted(() => {
      map.value = L.map('map').setView([props.lat, props.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map.value);

      L.marker([props.lat, props.lng]).addTo(map.value).bindPopup(props.label).openPopup();

      if (geolocationStore.userPosition) {
        userMarker.value = L.marker(
            [geolocationStore.userPosition.latitude, geolocationStore.userPosition.longitude],
            { icon: userIcon }
        ).addTo(map.value);
        fitMapBounds();
      }
    });

    watch(
        () => geolocationStore.userPosition,
        (newUserPosition) => {
          if (map.value && newUserPosition) {
            if (userMarker.value) {
              userMarker.value.setLatLng([newUserPosition.latitude, newUserPosition.longitude]);
            } else {
              userMarker.value = L.marker([newUserPosition.latitude, newUserPosition.longitude], { color: 'blue' }).addTo(map.value);
            }
            fitMapBounds();
          }
        },
        { immediate: true }
    );

    const fitMapBounds = () => {
      if (map.value && geolocationStore.userPosition) {
        const bounds = L.latLngBounds([
          [props.lat, props.lng],
          [geolocationStore.userPosition.latitude, geolocationStore.userPosition.longitude],
        ]);
        map.value.fitBounds(bounds);
      }
    };

    return {};
  },
});
</script>

<style>
#map {
  height: 100%;
  width: 100%;
}

.user-icon {
  position: relative;
}

.user-icon .pulse {
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 255, 0.5);
  border-radius: 50%;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
}
</style>