<template>
  <div id="map" :style="{ height, width: '100%' }"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useGeolocationStore } from '@/store/geolocation'; // Assicurati di usare il percorso corretto
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/markers/marker-icon-2x.png',
  iconUrl: '/images/markers/marker-icon.png',
  shadowUrl: '/images/markers/marker-shadow.png',
});

interface Ospedale {
  lat: string;
  lng: string;
  label: string;
}

export default defineComponent({
  name: 'MappaOspedali',
  props: {
    ospedali: {
      type: Array as PropType<Ospedale[]>,
      required: true,
    },
    height: {
      type: String,
      default: '400px'
    }
  },
  setup(props: Ospedale[]) {
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
      map.value = L.map('map').setView([props.ospedali[0].lat, props.ospedali[0].lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map.value);

      props.ospedali.forEach((hospital:any) => {
        L.marker([hospital.lat, hospital.lng]).addTo(map.value).bindPopup(hospital.label).openPopup();
      });

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
      if (map.value) {
        let bounds: L.LatLngBounds | null = null;
        props.ospedali.forEach((ospedale:any) => {
          const hospitalLatLng = L.latLng(parseFloat(ospedale.lat), parseFloat(ospedale.lng));
          if (!bounds) {
            bounds = L.latLngBounds(hospitalLatLng, hospitalLatLng);
          } else {
            bounds.extend(hospitalLatLng);
          }
        });

        if (geolocationStore.userPosition) {
          const userLatLng = L.latLng(
              geolocationStore.userPosition.latitude,
              geolocationStore.userPosition.longitude
          );
          if (!bounds) {
            bounds = L.latLngBounds(userLatLng, userLatLng);
          } else {
            bounds.extend(userLatLng);
          }
        }

        if (bounds) {
          map.value.fitBounds(bounds);
        }
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