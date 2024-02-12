<template>
  <v-container>
    <h3 class="display-1 text-center mb-6">Presidi Medici di Emergenza a {{ provincia }}</h3>
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

const show = ref(false);

console.log(runtimeConfig.public.pusher.schema);

window.pusher.subscribe(data.value.websocket.channel).bind(data.value.websocket.event, (data) => {
  console.log('Evento ricevuto:', data);
  for (const [key, value] of Object.entries(data.data)) {
    presidi[key].data = value
  }
});

</script>