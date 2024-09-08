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
  indirizzo?: string;
  telefono?: string;
  email?: string;
  web?: string;
  google_maps?: string;
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
          const hospitalId = hospital.nome;

          const popupContent = `
              <div>
              <h3>${hospital.nome}</h3>
              <hr>
              <h4><strong>Tipologia:</strong> ${hospital.adulti ? 'Adulti' : 'Pediatrico'}</h4>
              ${hospital.descrizione ? `<p><strong>Descrizione:</strong> <div style="max-height: 70px; overflow-y: auto;">${hospital.descrizione}</div></p>` : ''}
              ${hospital.indirizzo ? `<p><strong>Indirizzo:</strong> ${hospital.indirizzo}</p>` : ''}
              ${hospital.telefono ? `<p><strong>Telefono:</strong> <a href="tel:${hospital.telefono}">${hospital.telefono}</a></p>` : ''}
              ${hospital.email ? `<p><strong>Email:</strong> <a href="mailto:${hospital.email}">${hospital.email}</a></p>` : ''}
              ${hospital.web ? `<p><strong>Sito Internet:</strong> <a href="${hospital.web}" target="_blank">Link esterno</a></p>` : ''}
              ${hospital.google_maps ? `<div class="text-center"><button class="googleMaps" id="googleMapsBtn-${hospitalId}"><i class="mdi-map mdi v-icon notranslate v-theme--customDarkTheme v-icon--size-default" aria-hidden="true"></i> Apri in Google Maps</button></div>` : ''}
            </div>
          `;

          document.addEventListener('click', function (event) {
            const target = event.target as HTMLElement;
            if (target && target.id === `googleMapsBtn-${hospitalId}`) {
              window.open(hospital.google_maps, '_blank');
            }
          });

          // Aggiungi il marker alla mappa
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

.leaflet-popup-content hr{
  margin: 6px 0;
}

.leaflet-popup-content p{
  margin: 4px 0;
}

.googleMaps {
  margin-top: 4px;
  padding: 8px;
  background: #fff3e0;

}
</style>