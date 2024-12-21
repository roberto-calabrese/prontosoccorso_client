<template>
  <v-container fluid>
    <RotateAlert />
    <h2 class="text-uppercase text-center">Presidi Medici di Emergenza nella provincia di <span class="text-amber-accent-3">{{ provincia.replace('-', ' ') }}</span></h2>
    <h3 v-if="ospedaliTotali" class="mb-8 text-uppercase text-center"><span class="text-green-accent-4">{{ ospedaliTotali }}</span> Ospedali</h3>
    <div class="text-center my-4" v-if="headers.length">
      <!-- Mappa -->
      <v-dialog
            v-model="showMap"
            transition="dialog-bottom-transition"
            fullscreen
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                prepend-icon="mdi-map"
                size="large"
                text="Mostra mappa"
                v-bind="activatorProps"
            ></v-btn>
          </template>

          <v-card>
            <v-toolbar>
              <v-btn
                  icon="mdi-close"
                  @click="showMap = false"
              ></v-btn>
              <v-toolbar-title>Mappa Ospedali</v-toolbar-title>
              <v-spacer></v-spacer>

              <button-geolocation></button-geolocation>
            </v-toolbar>
            <MapHospital :ospedali="datiMappa" height="100%" />
          </v-card>
        </v-dialog>

      <!-- Info Codici -->
      <Legenda/>
    </div>

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
                style="z-index: 100"
            >

              <template v-slot:item.nome="{ item }">
                <v-chip
                    prepend-icon="mdi-information"
                    size="large"
                    variant="elevated"
                    label
                    color="teal-darken-4"
                    @click="openModal(item)"
                >
                  <template #prepend>
                    <v-icon icon="mdi-information"/>
                  </template>
                  <span class="text-white">{{ item.nome }}</span>
                </v-chip>
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
                      :color=getColor(codice).text
                  ></v-progress-circular>
                </div>
                <template v-if="item.data.data?.[codice]?.extra">
                  <v-dialog max-width="400">
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-chip
                          v-bind="activatorProps"
                          :color=getColor(codice).text
                      >
                        <h2>{{ item.data.data?.[codice]?.value }}</h2>
                        <p v-if="codice === 'totali'">&nbsp;In attesa</p>
                      </v-chip>
                    </template>

                    <template v-slot:default="{ isActive }">
                      <v-card
                          :title="`Situazione Codice ${uppercaseFirstLetter(codice)}`"
                          prepend-icon="mdi-alarm-light"
                      >
                        <template v-slot:text>
                          <v-list>
                            <v-list-item
                                v-for="(extraItem, key) in item.data.data?.[codice]?.extra"
                                :key="key">
                              <v-list-item-title>
                                <v-chip :color="getColor(codice).text">
                                  <h2>{{ extraItem.value }}</h2>
                                </v-chip>
                                {{ extraItem.label }}
                              </v-list-item-title>

                            </v-list-item>
                          </v-list>
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
                <div  v-else-if="item.data.data">
                  <h2 style="display: inline-block" class="mr-2"
                      :class=getColor(codice).textColor
                  >
                    {{ item.data.data?.[codice]?.value ?? 0 }}
                  </h2>
                  <small v-if="codice === 'totali'" v-tooltip="{openOnClick: true, text: 'Pazienti presenti nella struttura, in attesa, in trattamento, in osservazione ecc..' }">Pazienti totali</small>
                </div>

              </template>

              <template v-slot:bottom></template>

            </v-data-table>

        </v-card>
        <v-divider color="success" class="my-5"></v-divider>
      </div>
    </template>
    <div class="text-center">
      <buy-me-coffe />
    </div>

    <v-alert
        text="I dati mostrati in questa applicazione sono forniti in tempo reale dai pronto soccorso e potrebbero non essere sempre accurati o aggiornati. L’applicazione non è responsabile per eventuali inesattezze o disguidi derivanti dall’utilizzo di queste informazioni. Per emergenze, si consiglia di contattare direttamente il pronto soccorso."
        type="warning"
        closable
        border="start"
        close-label="Close Alert"
        variant="tonal"

    ></v-alert>
    <core-navigation-button v-if="ospedali" :destination=regione />
    <v-dialog
        v-model="isModalOpen"
        fullscreen
        max-width="100%"
        min-height="100%"
        transition="dialog-bottom-transition"
    >
      <v-toolbar v-if="selectedItem">
        <v-btn
            icon="mdi-close"
            @click="closeModal"
        ></v-btn>

        <v-toolbar-title>
          <span class="text-amber-accent-3">{{ selectedItem.nome }}</span>
        </v-toolbar-title>
      </v-toolbar>
      <provincia-show-details v-if="selectedItem" :item="selectedItem" />
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, shallowRef, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useGeolocationStore } from '~/store/geolocation';
import { uppercaseFirstLetter, createSlug } from '~/utils/string-utils';
import MapHospital from '@/components/provincia/MapHospital.vue'
import InfoCodici from '~/components/Legenda.vue'
import Legenda from "~/components/Legenda.vue";
import ButtonGeolocation from "~/components/core/ButtonGeolocation.vue";

const geolocationStore = useGeolocationStore();
const { regione, provincia } = useRoute().params as RouteParams;
const showMap = shallowRef(false)

const metaPage = {
  title: `Pronto Soccorso Live - ${uppercaseFirstLetter(provincia)}`,
  meta: [
    { name: 'description', content: `Situazione dei pronto soccorsi a ${provincia}` },
  ],
}

useHead(metaPage);

const interval = ref<ReturnType<typeof setInterval> | null>(null);
const headers = ref<any[]>([]);
const sortBy = ref<any[]>([]);

let channel: any, event: any;
const pusher = (window as any).pusher;

const presidi = ref<any>();
const ospedaliTotali = ref();

interface Ospedale {
  titolo: string;
  icon: string;
  data: any[];
  search: Ref<string>
}

const ospedali = ref<Ospedale[]>([
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


const route = useRoute();
const router = useRouter();
const isModalOpen = ref(false);
const selectedItem = ref(null);

const openModal = async (item) => {
  selectedItem.value = item;
  await nextTick();
  isModalOpen.value = true;
  router.push({ query: { ps: createSlug(item.nome) } });
  useHead({
    title: `Pronto Soccorso Live - ${item.nome}`,
    meta: [
      { name: 'description', content: `Situazione del pronto soccorso ${regione} - ${provincia} - ${item.nome}`, },
    ],
  })
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedItem.value = null;
  router.push({ query: {} });
  useHead(metaPage);
};

const checkAndOpenModalFromURL = async () => {
  if (route.query.ps) {
    const itemId = route.query.ps;
    const item = ospedali.value.flatMap(categoria => categoria.data).find(item => createSlug(item.nome) === itemId);
    if (item) {
      await openModal(item);
    }
  }
};

onMounted(async () => {
  startInterval();
  presidi.value = await updatePresidi();
  await subscribeToChannel();

  await checkAndOpenModalFromURL();

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

watch(() => route.query.ps, async (newValue, oldValue) => {
  if (!newValue) {
    closeModal();
  } else if (newValue !== oldValue) {
    await checkAndOpenModalFromURL();
  }
});

watch(() => route.fullPath, async () => {
  await checkAndOpenModalFromURL();
}, { immediate: true });

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
  if (presidiData && !headers.value.length && presidiData.tableSettings) {
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
    ospedaliTotali.value = presidiData.ospedaliTotali;
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


const getColor = (codice: string) => {
  switch (codice) {
    case 'rosso':
      return {textColor: 'text-red', text: 'red' };
    case 'giallo':
      return {textColor: 'text-yellow', text: 'yellow' };
    case 'verde':
      return {textColor: 'text-green', text: 'green' };
    case 'arancione':
      return {textColor: 'text-orange', text: 'orange' };
    case 'azzurro':
      return {textColor: 'text-blue', text: 'blue' };
    default:
      return {textColor: 'text-white', text: 'white' };
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


const datiMappa = computed(() => {
  const result: any[] = [];

  ospedali.value.forEach((categoria: any) => {
    categoria.data.forEach((ospedale: any) => {
      result.push({
        nome: ospedale.nome,
        descrizione: ospedale.descrizione,
        adulti: ospedale.adulti,
        indirizzo: ospedale?.indirizzo,
        telefono: ospedale?.telefono,
        email: ospedale?.email,
        web: ospedale?.web,
        lat: ospedale.coords.lat,
        lng: ospedale.coords.lng,
        google_maps: ospedale?.google_maps,
        data: ospedale.data.data
      });
    });
  });

  return result;
});
</script>