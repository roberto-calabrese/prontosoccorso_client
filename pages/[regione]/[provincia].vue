<template>
  <v-container>
<!--    <h3 class="display-1 text-center mb-6">Presidi Medici di Emergenza a {{ provincia }}</h3>-->
    <v-row>
      <v-col>
        <v-card
            flat
            :title="provincia"
        >
          <template v-slot:text>
            <v-text-field
                v-model="search"
                label="Cerca"
                prepend-inner-icon="mdi-magnify"
                single-line
                variant="outlined"
                hide-details
            ></v-text-field>
          </template>

          <v-data-table
              :headers="headers"
              :items="presidi"
              :search="search"
          ></v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-row >
      <v-col v-for="(presidio, key) in presidi" :key="key" cols="12" sm="6" md="6">
        <v-card class="mb-6" elevation="3" :title="presidio.nome">
          <v-card-text>
            <p><strong>Tipo:</strong> {{ presidio.type }}</p>
            <p><strong>Indirizzo:</strong> {{ presidio.indirizzo }}</p>
            <p><strong>Telefono:</strong> {{ presidio.telefono }}</p>
            <p><strong>Email:</strong> {{ presidio.email }}</p>
            <p><strong>Web:</strong> <a :href="presidio.web" target="_blank">Link</a></p>
            <p><strong>Coordinate:</strong> Lat {{ presidio.coords.lat }}, Lng {{ presidio.coords.lng }}</p>
            <v-divider class="my-4"></v-divider>
            <v-progress-linear
                :active="!presidio.data.data"
                color="primary"
                indeterminate
                rounded
                height="6"
            ></v-progress-linear>
            <div v-if="presidio.data">
              <h3 class="subtitle-1 font-weight-bold">Situazione Attuale</h3>
              <v-list density="compact">
                <v-list-item v-for="(value, key) in presidio.data.data" :key="key" v-show="key !== 'extra'">
                  <v-list-item v-if="key !== 'extra'">
                    <v-list-item-title><strong>{{ key }}:</strong> {{ value.value }}</v-list-item-title>
                    <v-list-item-subtitle v-for="(extraValue, extraKey) in value.extra" :key="extraKey">
                      <strong>{{ extraValue.label }}:</strong> {{ extraValue.value }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list-item>
              </v-list>

              <v-card-actions v-if="presidio.data.data">
                <v-btn
                    :prepend-icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                    @click="show = !show"
                >Extra</v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show">
                  <v-divider></v-divider>
                  <template v-for="(value, key) in presidio.data.data" :key="key">
                    <v-card-text v-show="key === 'extra'" >
                      <p v-for="(extraValue, extraKey) in value" :key="extraKey">
                        <strong>{{ extraValue.label }}: </strong>{{ extraValue.value }}
                      </p>
                    </v-card-text>
                  </template>
                </div>
              </v-expand-transition>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const { regione, provincia } = useRoute().params


const { data, error, pending } = await useAPIFetch<ResultsType>(`/${regione}/${provincia}`, {
  method: "GET",
})

const presidi = data.value.data


console.log(presidi)


const search = ref('')
const headers = [
  {
    align: 'start',
    key: 'name',
    sortable: true,
    title: 'Ospedale',
  },
  { key: 'calories', title: 'Calories' },
  { key: 'fat', title: 'Fat (g)' },
  { key: 'carbs', title: 'Carbs (g)' },
  { key: 'protein', title: 'Protein (g)' },
  { key: 'iron', title: 'Iron (%)' },
];
const desserts = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
    iron: 1,
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3,
    iron: 1,
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16,
    carbs: 23,
    protein: 6,
    iron: 7,
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    iron: 8,
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16,
    carbs: 49,
    protein: 3.9,
    iron: 16,
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0,
    carbs: 94,
    protein: 0,
    iron: 0,
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    iron: 2,
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    iron: 45,
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25,
    carbs: 51,
    protein: 4.9,
    iron: 22,
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26,
    carbs: 65,
    protein: 7,
    iron: 6,
  }
  ];

const show = ref(false);

const presidiTable = presidi.map(value => {
  return {
    name: value.nome
  }
});

console.log(presidiTable);

console.log(runtimeConfig.public.pusher.schema);

window.pusher.subscribe(data.value.websocket.channel).bind(data.value.websocket.event, (data) => {
  console.log('Evento ricevuto:', data);
  for (const [key, value] of Object.entries(data.data)) {
    presidi[key].data = value
  }
});

</script>