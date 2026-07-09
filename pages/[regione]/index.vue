<template>
  <v-container class="pa-4" fluid>
    <core-page-hero
        eyebrow="Province disponibili"
        :subtitle="`Seleziona una provincia della regione ${uppercaseFirstLetter(regione)} per vedere lo stato dei pronto soccorso.`"
        :count="ospedaliTotali"
        count-label="Ospedali in regione"
    >
      <span class="hl">{{ uppercaseFirstLetter(regione) }}</span>
    </core-page-hero>

    <v-row
        align="stretch"
        justify="center"
        class="mt-2"
    >
      <v-col
          v-for="(item, i) in province"
          :key="i"
          cols="6"
          md="3"
      >
        <grid-card
            :to="currentRegione + '/' + item.meta.slug"
            :title="item.meta.Titolo"
            :count="item.numero_ospedali"
            icon="mdi-city-variant-outline"
        />
      </v-col>
    </v-row>

    <div class="text-center mt-6">
      <core-navigation-button v-if="province" destination="/" />
    </div>
    <FeedbackModal />
  </v-container>

</template>

<script setup lang="ts">
import type {RouteParams} from "vue-router";
import {uppercaseFirstLetter} from "~/utils/string-utils";
import FeedbackModal from "~/components/FeedbackModal.vue";
const {regione}: RouteParams = useRoute().params
useHead({
  title: `Pronto Soccorso Live - ${uppercaseFirstLetter(regione)}`,
  meta: [
    { name: 'description', content: `Ospedali presenti in ${regione}` },
  ],
})

const province = ref();
const currentRegione = ref();
const ospedaliTotali = ref();

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
    ospedaliTotali.value = data.ospedaliTotali;

  } catch (error) {
    console.error('Error fetching data:', error)
  }
})


</script>