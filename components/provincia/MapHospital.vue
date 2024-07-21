<template>
  <div id="map" :style="{ height, width: '100%' }"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useGeolocationStore } from '@/store/geolocation'; // Assicurati di usare il percorso corretto
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/markers/marker-icon-2x.png',
  iconUrl: '/images/markers/marker-icon.png',
  shadowUrl: '/images/markers/marker-shadow.png',
});

interface Ospedale {
  lat: string;
  lng: string;
  nome: string;
  descrizione: string;
  adulti: boolean;
  indirizzo: string;
  telefono: string;
  email: string;
  web: string;
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
  setup(props) {
    const map = ref<L.Map | null>(null);
    const userMarker = ref<L.Marker | null>(null);
    const markers = ref<L.MarkerClusterGroup | null>(null);
    const geolocationStore = useGeolocationStore();

    const userIcon = L.divIcon({
      className: 'user-icon',
      html: '<div class="pulse"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const initializeMap = () => {
      if (props.ospedali.length > 0) {
        map.value = L.map('map').setView([parseFloat(props.ospedali[0].lat), parseFloat(props.ospedali[0].lng)], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map.value);

        markers.value = L.markerClusterGroup();

        props.ospedali.forEach((hospital: Ospedale) => {
          const popupContent = `
            <div>
              <h3>${hospital.nome}</h3>
              <hr>
              <h4><strong>Adulti:</strong> ${hospital.adulti ? 'Sì' : 'No'}</h4>
              <p>${hospital.descrizione}</p>
              <p><strong>Indirizzo:</strong> ${hospital.indirizzo}</p>
              <p><strong>Telefono:</strong> <a href="tel:${hospital.telefono}">${hospital.telefono}</a></p>
              <p><strong>Email:</strong> <a href="mailto:${hospital.email}">${hospital.email}</a></p>
              <p><strong>Web:</strong> <a href="${hospital.web}" target="_blank">${hospital.web}</a></p>
            </div>
          `;
          const marker = L.marker([parseFloat(hospital.lat), parseFloat(hospital.lng)]).bindPopup(popupContent);
          markers.value?.addLayer(marker);
        });

        map.value.addLayer(markers.value);

        if (geolocationStore.userPosition) {
          const popupContentUser = `
            <div>
              <h3>La tua posizione</h3>
            </div>
          `;
          userMarker.value = L.marker(
              [geolocationStore.userPosition.latitude, geolocationStore.userPosition.longitude],
              { icon: userIcon }
          ).bindPopup(popupContentUser).addTo(map.value);
          fitMapBounds();
        }

        addFitBoundsButton();
        fitMapBounds();
      }
    };

    const fitMapBounds = () => {
      if (map.value) {
        let bounds: L.LatLngBounds | null = null;
        props.ospedali.forEach((ospedale: Ospedale) => {
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

    const addFitBoundsButton = () => {
      const fitBoundsButton = L.control({ position: 'topright' });

      fitBoundsButton.onAdd = function () {
        const button = L.DomUtil.create('button', 'fit-bounds-button');
        button.innerHTML = 'Riposiziona'
        button.onclick = fitMapBounds;
        return button;
      };

      fitBoundsButton.addTo(map.value);
    };

    onMounted(() => {
      initializeMap();
    });

    watch(
        () => geolocationStore.userPosition,
        (newUserPosition) => {
          if (map.value && newUserPosition) {
            if (userMarker.value) {
              userMarker.value.setLatLng([newUserPosition.latitude, newUserPosition.longitude]);
            } else {
              userMarker.value = L.marker([newUserPosition.latitude, newUserPosition.longitude], { icon: userIcon }).addTo(map.value);
            }
          }
        },
        { immediate: true }
    );

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

.fit-bounds-button {
  background-color: #0a1412;
  border: 1px solid #ec0f0f;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
}

.fit-bounds-button:hover {
  background-color: rgba(10, 10, 37, 0.73);
}
</style>