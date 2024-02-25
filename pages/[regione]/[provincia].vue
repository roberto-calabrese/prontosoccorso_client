<template>
  <v-container>
    <h2 class="display-1 text-center mb-6">Presidi Medici di Emergenza a {{ uppercaseFirstLetter(provincia) }}</h2>

    <template v-for="categoria in ospedali">
      <v-card flat v-if="categoria.data">
        <v-card-title class="d-flex align-center pe-2">
          <v-icon :icon="categoria.icon"></v-icon> &nbsp;
          Pronto Soccorsi {{ categoria.titolo }}

          <v-spacer></v-spacer>

          <v-text-field
              v-model="categoria.search.value"
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
            v-model:search="categoria.search.value"
            :headers="headers"
            :items="categoria.data"
            :loading="false"
            :sort-by="sortBy"
            :items-per-page="0"
        >
          <template v-slot:item.data.data.rosso.value="{ item }">
            <div v-if="!item.data.data?.rosso?.value">
              <v-progress-circular
                  indeterminate
                  color="red"
              ></v-progress-circular>
            </div>
            <h2 v-else class="text-red">{{ item.data.data?.rosso?.value }}</h2>
          </template>

          <template v-slot:item.data.data.giallo.value="{ item }">
            <div v-if="!item.data.data?.giallo?.value">
              <v-progress-circular
                  indeterminate
                  color="yellow"
              ></v-progress-circular>
            </div>
            <h2 v-else class="text-yellow">{{ item.data.data?.giallo?.value }}</h2>
          </template>

          <template v-slot:item.data.data.verde.value="{ item }">
            <div v-if="!item.data.data?.verde?.value">
              <v-progress-circular
                  indeterminate
                  color="green"
              ></v-progress-circular>
            </div>
            <h2 v-else class="text-green">{{ item.data.data?.verde?.value }}</h2>
          </template>

          <template v-slot:item.data.data.bianco.value="{ item }">
            <div v-if="!item.data.data?.bianco?.value">
              <v-progress-circular
                  indeterminate
                  color="white"
              ></v-progress-circular>
            </div>
            <h2 v-else>{{ item.data.data?.bianco?.value }}</h2>
          </template>

          <template v-slot:bottom> </template>

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
  {title: 'Codice Rosso', align: 'end', key: 'data.data.rosso.value'},
  {title: 'Codice Giallo', align: 'end', key: 'data.data.giallo.value'},
  {title: 'Codice Verde', align: 'end', key: 'data.data.verde.value'},
  {title: 'Codice Bianco', align: 'end', key: 'data.data.bianco.value'},
];

const sortBy = ref([{key: 'data.data.rosso.value', order: 'desc'}])

async function fetchData() {
  const { data } = await useAPIFetch<ResultsType>(`/${regione}/${provincia}`, { method: 'GET' });
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

async function updatePresidi() {
  const presidi = await fetchData();
  ospedali.value[0].data = presidi.data.filter(obj => obj.type === "pediatrico");
  ospedali.value[1].data = presidi.data.filter(obj => obj.type === "adulti");
}

console.log(runtimeConfig.public.pusher.schema);

let channel;
let event;
const pusher = window.pusher; // Assuming pusher is globally accessible

async function subscribeToChannel() {
  const presidi = await fetchData();
  channel = pusher.subscribe(presidi.websocket.channel);
  event = presidi.websocket.event;

  channel.bind(event, (data) => {
    console.log('Evento ricevuto:', data);
    for (const [key, value] of Object.entries(data.data)) {
      for (const presidio of ospedali.value) {
        if (presidio.key === key) {
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