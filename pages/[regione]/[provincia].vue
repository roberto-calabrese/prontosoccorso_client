<template>
  <v-container fluid>
    <RotateAlert />
    <h2 class="my-8 text-uppercase text-center">Presidi Medici di Emergenza a <span class="text-amber-accent-3">{{ uppercaseFirstLetter(provincia) }}</span></h2>
    <template v-for="categoria in ospedali">
      <div v-if="categoria.data.length">
        <v-card elevation="10" v-if="categoria.data">
          <v-card-title class="d-flex align-center pe-2">
            <v-icon :icon="categoria.icon"></v-icon> &nbsp;
            Pronto Soccorso &nbsp; <span class="text-amber-accent-1"> {{ categoria.titolo }}</span>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="categoria.search"
                prepend-inner-icon="mdi-magnify"
                density="compact"
                label="Filtra"
                single-line
                flat
                hide-details
                variant="solo-filled"
            ></v-text-field>
          </v-card-title>

          <v-divider></v-divider>
          <v-data-table
              v-model:search="categoria.search"
              :headers="headers"
              :items="categoria.data"
              :loading="false"
              :sort-by="sortBy"
              :items-per-page="0"
              color="success"
          >
            <template v-slot:item.nome="{ item }">
              <v-dialog fullscreen max-width="100%" transition="dialog-bottom-transition">
                <template v-slot:activator="{ props: activatorProps }">
                  <v-chip prepend-icon="mdi-information" size="large" variant="elevated" v-bind="activatorProps" label color="teal-darken-4">
                    <template slot="prepend">
                      <v-icon icon="mdi-information"/>
                    </template>
                    <span class="text-white">{{ item.nome }}</span>
                  </v-chip>
                </template>

                <template v-slot:default="{ isActive }">
                  <v-toolbar>
                    <v-btn
                        icon="mdi-close"
                        @click="isActive.value = false"
                    ></v-btn>

                    <v-toolbar-title>
                      <span class="text-amber-accent-3">{{ item.nome }}</span>
                    </v-toolbar-title>


                  </v-toolbar>
                  <v-card>
                    <v-card-text>
                      <p><span class="text-amber-accent-4">{{ item.descrizione }}</span></p>
                      <p><strong>Tipo:</strong> {{ item.type }}</p>
                      <p><strong>Indirizzo:</strong> {{ item.indirizzo }}</p>
                      <p><strong>Telefono:</strong> {{ item.telefono }}</p>
                      <p><strong>Email:</strong> {{ item.email }}</p>
                      <p><strong>Web:</strong> <a :href="item.web" target="_blank">Link</a></p>
                      <p><strong>Coordinate:</strong> Lat {{ item.coords.lat }}, Lng {{ item.coords.lng }}</p>
                      <p v-if="geolocationStore.geolocation.init"><strong>Distanza:</strong> {{ geolocationStore.calculateDistance(geolocationStore.userPosition.latitude, geolocationStore.userPosition.longitude, item.coords.lat, item.coords.lng).toFixed(2) }} Km</p>
                      <v-divider class="my-4"></v-divider>
                      <MapHospital :lat="item.coords.lat" :lng="item.coords.lng" :label="item.nome" />
                      <v-divider class="my-4"></v-divider>
                      <template v-if="!item.data?.data">
                        <v-progress-linear
                            color="teal"
                            indeterminate
                        ></v-progress-linear>
                      </template>
                      <template v-else v-for="(value, key) in item.data.data" :key="key">
                        <v-card-text v-show="key === 'extra'">
                          <p v-for="(extraValue, extraKey) in value" :key="extraKey">
                            <strong>{{ extraValue.label }}: </strong>
                            <v-chip color="success" size="small" label>{{ extraValue.value }}<span
                                v-if="extraValue.label === 'Indice di sovraffollamento'">%</span></v-chip>
                          </p>
                        </v-card-text>
                      </template>
                    </v-card-text>

                    <template v-slot:actions>
                      <v-btn
                          class="ml-auto"
                          text="Chiudi"
                          @click="isActive.value = false"
                      ></v-btn>
                    </template>
                  </v-card>
                </template>
              </v-dialog>
            </template>

            <template v-slot:item.data.data.extra.indice_sovraffollamento.value="{ item }">
              <v-chip rounded>
                {{ item.data.data?.extra?.indice_sovraffollamento.value }}%
              </v-chip>
            </template>

            <template v-slot:item.distanza="{ item }">
              <v-chip rounded>
                {{ item.distanza.toFixed(2) }} Km
              </v-chip>

            </template>

            <template v-for="codice in ['totali', 'rosso', 'arancione', 'giallo', 'verde', 'azzurro', 'bianco']"
                      v-slot:[`item.data.data.${codice}.value`]="{ item }">
              <div v-if="!item.data.data && !item.data.data?.[codice]?.value">
                <v-progress-circular
                    indeterminate
                    :color=getColorProgress(codice)
                ></v-progress-circular>
              </div>
              <template v-if="item.data.data?.[codice]?.extra">
                <v-dialog max-width="540">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-chip
                        v-bind="activatorProps"
                        :color=getColorProgress(codice)
                    >
                      <h2>{{ item.data.data?.[codice]?.value }}</h2>
                    </v-chip>
                  </template>

                  <template v-slot:default="{ isActive }">
                    <v-card
                        :title="`Situazione Codice ${uppercaseFirstLetter(codice)}`"
                        prepend-icon="mdi-alarm-light"
                    >
                      <template v-slot:text>
                        <v-table>
                          <thead>
                          <tr>
                            <th class="text-left" v-for="(extraItem, key) in item.data.data?.[codice]?.extra" :key="key">
                              {{ extraItem.label }}
                            </th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr>
                            <td v-for="(extraItem, key) in item.data.data?.[codice]?.extra" :key="key">
                              <v-chip :color=getColorProgress(codice)>
                                <h2>{{ extraItem.value }}</h2>
                              </v-chip>
                            </td>
                          </tr>
                          </tbody>
                        </v-table>
                      </template>

                      <template v-slot:actions>
                        <v-btn
                            class="ml-auto"
                            text="Chiudi"
                            @click="isActive.value = false"
                        ></v-btn>
                      </template>
                    </v-card>
                  </template>
                </v-dialog>
              </template>
              <h2 v-else-if="item.data.data" class="mr-2"
                  :class=getColorText(codice)
              >
                {{ item.data.data?.[codice]?.value ?? 0 }}
              </h2>
            </template>

            <template v-slot:bottom></template>

          </v-data-table>

        </v-card>
        <v-divider color="success" class="my-8"></v-divider>
      </div>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useGeolocationStore } from '~/store/geolocation';
import { uppercaseFirstLetter } from '~/utils/string-utils';

import MapHospital from '@/components/MapHospital.vue'

const geolocationStore = useGeolocationStore();
const isWatching = ref(false);
const { regione, provincia } = useRoute().params as RouteParams;

useHead({
  title: `Pronto Soccorso Live - ${uppercaseFirstLetter(provincia)}`,
  meta: [
    { name: 'description', content: `Situazione dei pronto soccorsi a ${provincia}` },
  ],
});

const interval = ref<ReturnType<typeof setInterval> | null>(null);
const headers = ref<any[]>([]);
const sortBy = ref<any[]>([]);

let channel: any, event: any;
const pusher = (window as any).pusher;

const presidi = ref<any>();

const ospedali = ref([
  {
    titolo: 'Pediatrici',
    icon: 'mdi-human-baby-changing-table',
    data: [],
    search: ref(''),
  },
  {
    titolo: 'Adulti',
    icon: 'mdi-account',
    data: [],
    search: ref(''),
  },
]);

onMounted(async () => {
  startInterval();
  presidi.value = await updatePresidi();
  await subscribeToChannel();

  watch(
      () => geolocationStore.geolocation.init,
      async (newInit) => {
        if (newInit) {
          addDistanceHospital();
          if (!headers.value.some(header => header.key === 'distanza')) {
            headers.value.splice(1, 0, {
              title: 'Distanza',
              align: 'end',
              key: 'distanza',
            });
          }
        } else {
          const index = headers.value.findIndex(header => header.key === 'distanza');
          if (index !== -1) {
            headers.value.splice(index, 1);
          }
        }
      },
      { immediate: true }
  );
});

onBeforeUnmount(() => {
  if (interval.value) {
    clearInterval(interval.value);
  }
  if (channel) {
    channel.unbind(event);
    pusher.unsubscribe(channel);
  }
});

async function fetchData() {
  try {
    return await fetch(`${regione}/${provincia}`);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function updatePresidi() {
  const presidiData = await fetchData();
  if (!headers.value.length && presidiData.tableSettings) {
    headers.value = presidiData.tableSettings.headers;
    sortBy.value = presidiData.tableSettings.sortBy;
  }

  if (geolocationStore.geolocation.init) {
    if (!headers.value.some(header => header.key === 'distanza')) {
      headers.value.splice(1, 0, {
        title: 'Distanza',
        align: 'end',
        key: 'distanza',
      });
    }
  }

  const adulti = [];
  const bambini = [];

  if (presidiData?.data) {
    for (const obj of presidiData.data) {
      if (obj.adulti) {
        adulti.push(obj);
      } else {
        bambini.push(obj);
      }
    }

    ospedali.value[0].data = bambini;
    ospedali.value[1].data = adulti;
  }

  if (geolocationStore.geolocation.init) {
    addDistanceHospital();
  }

  return presidiData;
}

async function subscribeToChannel() {
  channel = pusher.subscribe(presidi.value.websocket.channel);
  event = presidi.value.websocket.event;
  channel.bind(event, (data: any) => {
    console.log('Evento ricevuto:', data);
    for (const [key, value] of Object.entries(data.data)) {
      for (const categoria of ospedali.value) {
        const presidio = categoria.data.find((presidio: any) => presidio.key === key);
        if (presidio) {
          presidio.data = value;
        }
      }
    }
  });
}

function startInterval() {
  interval.value = setInterval(async () => {
    await updatePresidi();
  }, 10000);
}

const getColorText = (codice: string) => {
  switch (codice) {
    case 'rosso':
      return 'text-red';
    case 'giallo':
      return 'text-yellow';
    case 'verde':
      return 'text-green';
    case 'arancione':
      return 'text-orange';
    case 'azzurro':
      return 'text-blue';
    default:
      return 'text-white';
  }
};

const getColorProgress = (codice: string) => {
  switch (codice) {
    case 'rosso':
      return 'red';
    case 'giallo':
      return 'yellow';
    case 'verde':
      return 'green';
    case 'arancione':
      return 'orange';
    case 'azzurro':
      return 'blue';
    default:
      return 'white';
  }
};

function addDistanceHospital() {
  if (geolocationStore.userPosition) {
    const { latitude, longitude } = geolocationStore.userPosition;
    ospedali.value.forEach((categoria: any) => {
      categoria.data.forEach((ospedale: any) => {
        ospedale.distanza = geolocationStore.calculateDistance(latitude, longitude, ospedale.coords.lat, ospedale.coords.lng);
      });
    });
  }
}
</script>