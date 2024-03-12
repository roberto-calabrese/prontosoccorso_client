<template>
  <v-container fluid>
    <h2 class="my-8 text-uppercase text-center">Presidi Medici di Emergenza a <span
        class="text-amber-accent-3">{{ uppercaseFirstLetter(provincia) }}</span></h2>
    <template v-for="categoria in ospedali">
      <v-card flat v-if="categoria.data">
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
            <v-dialog max-width="700">
              <template v-slot:activator="{ props: activatorProps }">
                <v-chip prepend-icon="mdi-information" size="large" variant="elevated" v-bind="activatorProps" label
                        color="teal-darken-4">
                  <template slot="prepend">
                    <v-icon icon="mdi-information"/>
                  </template>
                  <span class="text-white">{{ item.nome }}</span>
                </v-chip>
              </template>

              <template v-slot:default="{ isActive }">

                <v-card
                    :title="item.nome"
                    :text="item.descrizione"
                    prepend-icon="mdi-medical-bag">

                  <template v-slot:title>
                    <span class="text-amber-accent-3">{{ item.nome }}</span>
                  </template>


                  <template v-slot:text>
                    <span class="text-amber-accent-4">{{ item.descrizione }}</span>
                  </template>

                  <v-card-text>
                    <p><strong>Tipo:</strong> {{ item.type }}</p>
                    <p><strong>Indirizzo:</strong> {{ item.indirizzo }}</p>
                    <p><strong>Telefono:</strong> {{ item.telefono }}</p>
                    <p><strong>Email:</strong> {{ item.email }}</p>
                    <p><strong>Web:</strong> <a :href="item.web" target="_blank">Link</a></p>
                    <p><strong>Coordinate:</strong> Lat {{ item.coords.lat }}, Lng {{ item.coords.lng }}</p>
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

          <template v-for="codice in ['totali', 'rosso', 'giallo', 'verde', 'bianco']"
                    v-slot:[`item.data.data.${codice}.value`]="{ item }">
            <div v-if="!item.data.data && !item.data.data?.[codice]?.value">
              <v-progress-circular
                  indeterminate
                  :color="codice === 'rosso' ? 'red' : (codice === 'giallo' ? 'yellow' : (codice === 'verde' ? 'green' : 'white'))"
              ></v-progress-circular>
            </div>
            <template v-if="item.data.data?.[codice]?.extra">
              <v-dialog max-width="540">
                <template v-slot:activator="{ props: activatorProps }">
                  <v-chip
                      v-bind="activatorProps"
                      :color="codice === 'rosso' ? 'red' : (codice === 'giallo' ? 'yellow' : (codice === 'verde' ? 'green' : 'white'))"
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
                          <th class="text-left" v-for="(extraItem, key) in item.data.data?.[codice]?.extra"
                              :key="key">
                            {{ extraItem.label }}
                          </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td v-for="(extraItem, key) in item.data.data?.[codice]?.extra" :key="key">
                            <v-chip
                                :color="codice === 'rosso' ? 'red' : (codice === 'giallo' ? 'yellow' : (codice === 'verde' ? 'green' : 'white'))"
                            >
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
                :class="codice === 'rosso' ? 'text-red' : (codice === 'giallo' ? 'text-yellow' : (codice === 'verde' ? 'text-green' : 'text-white'))"
            >
              {{ item.data.data?.[codice]?.value ?? 0 }}
            </h2>
          </template>

          <template v-slot:bottom></template>

        </v-data-table>

      </v-card>

      <v-divider color="success" class="my-8"></v-divider>

    </template>
  </v-container>
</template>

<script setup>
import {useCoreStore} from "~/store/core";
const coreStore = useCoreStore()

const {regione, provincia} = useRoute().params

const interval = ref(null)

const headers = [
  {title: 'Presidio', align: 'start', key: 'nome'},
  {title: 'Indice Sovraffollamento: ', align: 'emd', key: 'data.data.extra.indice_sovraffollamento.value'},
  {title: 'Codice Rosso', align: 'end', key: 'data.data.rosso.value'},
  {title: 'Codice Giallo', align: 'end', key: 'data.data.giallo.value'},
  {title: 'Codice Verde', align: 'end', key: 'data.data.verde.value'},
  {title: 'Codice Bianco', align: 'end', key: 'data.data.bianco.value'},
  {title: 'Totali', align: 'end', key: 'data.data.totali.value'},
];

const sortBy = ref([{key: 'data.data.extra.indice_sovraffollamento.value', order: 'asc'}])

let channel, event;
const pusher = window.pusher;

const presidi = ref();

const ospedali = ref([
  {
    titolo: 'Pediatrici',
    icon: 'mdi-human-baby-changing-table',
    data: [],
    search: ref('')
  },
  {
    titolo: 'Adulti',
    icon: 'mdi-account',
    data: [],
    search: ref('')
  }
]);

onMounted(async () => {
  startInterval()
  presidi.value = await updatePresidi();
  await subscribeToChannel();
})

onBeforeUnmount(() => {
  clearInterval(interval.value)
})

async function fetchData() {
  try {

    coreStore.setLoading(true)

    const data = await fetch(`${regione}/${provincia}`);

    if (!data) {
      console.log('error');
      showError('Page Not Found')
    }

    return data;

  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    setTimeout(() => {coreStore.setLoading(false)}, 1000)
  }
}


async function updatePresidi() {
  const presidi = await fetchData();

  const adulti = [];
  const bambini = [];

  for (const obj of presidi.data) {
    if (obj.adulti) {
      adulti.push(obj);
    } else {
      bambini.push(obj);
    }
  }

  ospedali.value[0].data = bambini;
  ospedali.value[1].data = adulti;

  return presidi;
}

async function subscribeToChannel() {
  channel = pusher.subscribe(presidi.value.websocket.channel);
  event = presidi.value.websocket.event;
  channel.bind(event, (data) => {
    console.log('Evento ricevuto:', data);
    for (const [key, value] of Object.entries(data.data)) {
      for (const categoria of ospedali.value) {
        const presidio = categoria.data.find(presidio => presidio.key === key);
        if (presidio) {
          presidio.data = value;
        }
      }
    }
  });
}

function uppercaseFirstLetter(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function startInterval() {
  interval.value = setInterval(async () => {
    await updatePresidi();
  }, 10000);
}

</script>