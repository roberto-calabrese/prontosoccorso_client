<template>
  <v-container>
        <h2 class="display-1 text-center mb-6">Presidi Medici di Emergenza a {{ uppercaseFirstLetter(provincia) }}</h2>
        <template v-for="categoria in ospedali">
          <v-card flat v-if="categoria.data">
            <v-card-title class="d-flex align-center pe-2">
              <v-icon :icon="categoria.icon"></v-icon> &nbsp;
              Pronto Soccorso {{ categoria.titolo }}

              <v-spacer></v-spacer>

              <v-text-field
                  v-model="categoria.search"
                  prepend-inner-icon="mdi-magnify"
                  density="compact"
                  label="Cerca"
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
            >
              <template v-slot:item.data.data.extra.indice_sovraffollamento.value="{ item}">
                <v-chip rounded>
                  {{ item.data.data.extra.indice_sovraffollamento.value }}%
                </v-chip>

              </template>

              <template v-slot:item.nome="{ item }">
                <v-dialog max-width="700">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-chip v-bind="activatorProps" label>
                      {{ item.nome }}
                    </v-chip>
                  </template>

                  <template v-slot:default="{ isActive }">

                    <v-card
                        :title="item.nome"
                        :text="item.descrizione"
                        prepend-icon="mdi-medical-bag">
                      <v-card-text>
                        <p><strong>Tipo:</strong> {{ item.type }}</p>
                        <p><strong>Indirizzo:</strong> {{ item.indirizzo }}</p>
                        <p><strong>Telefono:</strong> {{ item.telefono }}</p>
                        <p><strong>Email:</strong> {{ item.email }}</p>
                        <p><strong>Web:</strong> <a :href="item.web" target="_blank">Link</a></p>
                        <p><strong>Coordinate:</strong> Lat {{ item.coords.lat }}, Lng {{ item.coords.lng }}</p>
                        <v-divider class="my-4"></v-divider>
                        <template v-for="(value, key) in item.data.data" :key="key">
                          <v-card-text v-show="key === 'extra'">
                            <p v-for="(extraValue, extraKey) in value" :key="extraKey">
                              <strong>{{ extraValue.label }}: </strong>
                              <v-chip color="success" size="small" label>{{ extraValue.value }}<span v-if="extraValue.label === 'Indice di sovraffollamento'">%</span></v-chip>
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

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const {regione, provincia} = useRoute().params

const headers = [
  {title: 'Pronto Soccorso', align: 'start', key: 'nome'},
  {title: 'Indice Sovraffollamento: ', align: 'emd', key: 'data.data.extra.indice_sovraffollamento.value'},
  {title: 'Codice Rosso', align: 'end', key: 'data.data.rosso.value'},
  {title: 'Codice Giallo', align: 'end', key: 'data.data.giallo.value'},
  {title: 'Codice Verde', align: 'end', key: 'data.data.verde.value'},
  {title: 'Codice Bianco', align: 'end', key: 'data.data.bianco.value'},
  {title: 'Totali', align: 'end', key: 'data.data.totali.value'},
];

const sortBy = ref([{key: 'data.data.extra.indice_sovraffollamento.value', order: 'asc'}])

async function fetchData() {
  const {data} = await useAPIFetch<ResultsType>(`/${regione}/${provincia}`, {method: 'GET'});
  return data.value;
}

let ospedali = ref([
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


const presidi = await fetchData();

async function updatePresidi() {
  const presidi = await fetchData();
  ospedali.value[0].data = presidi.data.filter(obj => obj.type === "pediatrico");
  ospedali.value[1].data = presidi.data.filter(obj => obj.type === "adulti");
}

console.log(runtimeConfig.public.pusher.schema);

let channel;
let event;
const pusher = window.pusher;

async function subscribeToChannel() {
  channel = pusher.subscribe(presidi.websocket.channel);
  event = presidi.websocket.event;
  channel.bind(event, (data:any) => {
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


function uppercaseFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// Aggiorna i dati ogni minuto
setInterval(async () => {
  await updatePresidi();
}, 10000);

// Esegui il fetch dei dati all'avvio
updatePresidi();

// Sottoscrivi al canale Pusher all'avvio
subscribeToChannel();

</script>