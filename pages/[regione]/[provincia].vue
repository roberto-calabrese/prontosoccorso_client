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

const search = ref('')

const headers = [
  {title: 'Pronto Soccorso', align: 'start', key: 'nome'},
  {title: 'Codice Rosso', align: 'end', key: 'data.data.rosso.value'},
  {title: 'Codice Giallo', align: 'end', key: 'data.data.giallo.value'},
  {title: 'Codice Verde', align: 'end', key: 'data.data.verde.value'},
  {title: 'Codice Bianco', align: 'end', key: 'data.data.bianco.value'},
];

const sortBy = ref([{key: 'data.data.rosso.value', order: 'desc'}])

const {data, error, pending} = await useAPIFetch<ResultsType>(`/${regione}/${provincia}`, {
  method: "GET",
})

const presidi = data.value.data

let ospedaliPediatrici = presidi.filter(obj => obj.type === "pediatrico");
let ospedaliAdulti = presidi.filter(obj => obj.type === "adulti");

let ospedali = [
  {
    titolo: 'Pediatrici',
    icon: 'mdi-human-baby-changing-table',
    data: ospedaliPediatrici,
    search: ref('')
  },
  {
    titolo: 'Adulti',
    icon: 'mdi-account',
    data: ospedaliAdulti,
    search: ref('')
  }
]

console.log(runtimeConfig.public.pusher.schema);

window.pusher.subscribe(data.value.websocket.channel).bind(data.value.websocket.event, (data) => {
  console.log('Evento ricevuto:', data);
  for (const [key, value] of Object.entries(data.data)) {
    for (const [k, presidio] of Object.entries(presidi)) {
      if (presidio.key === key) {
        presidi[k].data = value
      }
    }
  }
});

function uppercaseFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// Aggiorna i dati ogni minuto
setInterval(async () => {
  const newData = await fetchAndUpdateData();
  updateData(newData);
}, 5000);

async function fetchAndUpdateData() {
  const {data, error, pending} = await useAPIFetch<ResultsType>(`/${regione}/${provincia}`, {
    method: "GET",
  })
  return data.value.data;
}

function updateData(newData) {
  presidi.forEach((presidio, index) => {
    for (const [key, value] of Object.entries(newData)) {
      if (presidio.key === key) {
        presidi[index].data = value;
        break;
      }
    }
  });
}

</script>