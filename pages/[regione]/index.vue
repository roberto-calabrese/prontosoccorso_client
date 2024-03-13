<template>
  <v-container class="pa-4 text-center" fluid>
    <h2 class="my-8 text-uppercase">Dati nelle <span class="text-green-accent-4">province</span> disponibili</h2>
    <v-row
        align="center"
        class="fill-height"
        justify="center"
    >
      <template v-for="(item, i) in province" :key="i">
        <v-col
            cols="12"
            md="3"
        >
          <v-hover v-slot="{ isHovering, props }">
            <v-card
                :class="{ 'on-hover': isHovering }"
                :elevation="isHovering ? 12 : 2"
                v-bind="props"
                :to="currentRegione+'/'+item.meta.slug"
            >
              <v-card-title class="text-uppercase text-h5 text-white d-flex flex-column">
                <p class="mt-2 text-amber-accent-3">
                  {{ item.meta.Titolo }}
                </p>

                <div>
                  <p class="text-uppercase text-caption font-weight-medium">
                    numero ospedali: <strong class="text-amber-accent-4 text-sm-h6">{{ item.numero_ospedali }}</strong>
                  </p>
                </div>
              </v-card-title>
            </v-card>
          </v-hover>
        </v-col>
      </template>
    </v-row>
  </v-container>

</template>

<script setup lang="ts">
import type {RouteParams} from "vue-router";
import {uppercaseFirstLetter} from "~/utils/string-utils";
const {regione}: RouteParams = useRoute().params
useHead({
  title: `Pronto Soccorso Live - ${uppercaseFirstLetter(regione)}`,
  meta: [
    { name: 'description', content: `Ospedali presenti in ${regione}` },
  ],
})

const province = ref();
const currentRegione = ref();


onMounted(async () => {

  try {
    const data = await fetch(`${regione}`)

    // if (!data) {
    //   throw createError({
    //     statusCode: 404,
    //     statusMessage: 'Page Not Found'
    //   })
    // }

    currentRegione.value = data.regione;
    province.value = data.provincie;

  } catch (error) {
    console.error('Error fetching data:', error)
  }
})


</script>