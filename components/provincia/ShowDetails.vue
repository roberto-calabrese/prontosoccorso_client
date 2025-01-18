<template>
  <v-card min-width="100" min-height="100">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-row>
            <!-- INFO BASE -->
            <v-col cols="12">
              <v-card color="1" variant="outlined" class="mb-4">
                <v-card-title>
                  <span class="text-1">Informazioni</span>
                </v-card-title>
                <v-card-subtitle class="text-wrap">
                  <p class="mt-2">Ospedale: <span class="text-string">{{ item.nome }}</span></p>
                  <p class="mt-2">Tipologia: <span class="text-string">{{ item.adulti ? 'Adulti' : 'Pediatrico' }}</span></p>
                </v-card-subtitle>
                <v-card-text>
                  <p class="mt-2" v-if="item.descrizione"><strong>Descrizione:</strong> <span class="text-string">{{ item.descrizione }}</span></p>
                  <p class="mt-2" v-if="item.indirizzo"><strong>Indirizzo:</strong> <span class="text-string">{{ item.indirizzo }}</span></p>
                  <p class="mt-2" v-if="item.telefono"><strong>Telefono:</strong> <span class="text-string">{{ item.telefono }}</span></p>
                  <p class="mt-2" v-if="item.email"><strong>Email:</strong> <span class="text-string">{{ item.email }}</span></p>
                  <p class="mt-2" v-if="item.web"><strong>Sito Internet:</strong> <a :href="item.web" target="_blank">Link Esterno</a></p>

                  <!-- Google Maps Button -->
                  <v-btn
                      v-if="item?.google_maps"
                      color="primary"
                      prepend-icon="mdi-google-maps"
                      target="_blank"
                      :href="item.google_maps"
                      class="mt-3"
                  >
                    Indicazioni stradali
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- STATO CODICI -->
            <v-col cols="12">
              <v-card color="1" variant="outlined" class="mb-4">
                <v-card-title>Stato Attuale</v-card-title>
                <v-card-text class="pa-0">
                  <!-- Skeleton loader per il caricamento -->
                  <v-skeleton-loader
                      v-if="!item.data?.data"
                      type="list-item-two-line, list-item-two-line"
                      height="150px"
                  ></v-skeleton-loader>

                  <!-- Tabella dinamica -->
                  <v-col v-else cols="12" class="pa-0">
                    <table-detail :data="item.data?.data" />
                  </v-col>

                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="6">
            <v-row>
              <!-- INFO EXTRA -->
              <v-col cols="12">
                <v-card color="1" variant="outlined" class="mb-4">
                  <v-card-title>Informazioni Extra</v-card-title>
                  <v-card-text class="pa-0">
                    <v-skeleton-loader
                        v-if="!item.data?.data"
                        type="list-item-two-line, list-item-two-line"
                        height="200px"
                    ></v-skeleton-loader>

                    <template v-else-if="item.data?.data?.extra">
                      <v-table class="pa-0">
                        <thead>
                        <tr>
                          <th>Etichetta</th>
                          <th>Valore</th>
                        </tr>
                        </thead>
                        <tbody>

                        <template v-for="(value, key) in item.data.data" :key="key">

                          <template v-if="key === 'extra'">
                            <template v-for="(extraValue, extraKey) in value" :key="extraKey">
                              <tr>
                                <td>
                                  <strong>{{ extraValue.label }}:</strong>
                                </td>
                                <td>
                                  <v-chip
                                      color="warning"
                                      size="small"
                                      label
                                      variant="flat"
                                  >
                                    <h4 class="text-black bold">{{ extraValue.value }}</h4>
                                    <span class="text-black"  v-if="extraValue.label === 'Indice di sovraffollamento'">%</span>
                                  </v-chip>
                                </td>
                              </tr>
                            </template>
                          </template>
                        </template>
                        </tbody>
                      </v-table>
                    </template>
                    <template v-else>
                       <p class="pa-4">Nessun dato disponibile</p>
                    </template>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- MAPPA -->
              <v-col cols="12">
                <v-card color="1" variant="outlined">
                  <v-card-title>Mappa</v-card-title>
                  <v-card-subtitle v-if="geolocationStore.geolocation.init">
                    <p><strong>Distanza:</strong> {{ calculateDistance.toFixed(2) }} Km</p>
                  </v-card-subtitle>
                  <v-card-text>
                    <provincia-map-hospital :ospedali="formattedHospitalData" :embedded="embedded" />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {defineComponent, computed} from 'vue';
import {useGeolocationStore} from '~/store/geolocation';
import TableDetail from "~/components/provincia/TableDetail.vue";

interface Item {
  descrizione: string;
  adulti: boolean;
  indirizzo: string;
  telefono: string;
  email: string;
  web: string;
  google_maps?: string;
  coords: {
    lat: number;
    lng: number;
  };
  data?: {
    data?: Record<string, any>;
  };
  nome: string;
}

export default defineComponent({
  name: 'ShowDetails',
  components: {TableDetail},
  props: {
    item: {
      type: Object as () => Item,
      required: true,
    },
    embedded: {
      type: Boolean,
      default: false,
    }
  },
  setup(props) {
    const geolocationStore = useGeolocationStore();

    const embedded = computed(() => {
      return props.embedded;
    });

    const calculateDistance = computed(() => {
      if (geolocationStore.geolocation.init) {
        const {latitude, longitude} = geolocationStore.userPosition;
        const {lat, lng} = props.item.coords;
        return geolocationStore.calculateDistance(latitude, longitude, lat, lng);
      }
      return 0;
    });

    const formattedHospitalData = computed(() => {
      return [{
          nome: props.item.nome,
          descrizione: props.item.descrizione,
          adulti: props.item.adulti,
          indirizzo: props.item?.indirizzo,
          telefono: props.item?.telefono,
          email: props.item?.email,
          web: props.item?.web,
          google_maps: props.item?.google_maps,
          lat: props.item.coords.lat,
          lng: props.item.coords.lng,
        }]
    });


    return {
      geolocationStore,
      calculateDistance,
      formattedHospitalData,
      embedded
    };
  },
});
</script>

<style>

</style>