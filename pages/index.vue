<template>
  <v-container class="pa-4" fluid>
    <core-page-hero
        eyebrow="Pronto Soccorso Italia"
        subtitle="Monitora in tempo reale l'affluenza dei pronto soccorso italiani. Scegli la tua regione per iniziare."
        :count="ospedaliTotali"
        count-label="Ospedali monitorati"
    >
      Pronto soccorso in <span class="hl">tempo reale</span>
    </core-page-hero>

    <v-row
        align="stretch"
        justify="center"
        class="mt-2"
    >
      <v-col
          v-for="(item, i) in regioni"
          :key="i"
          cols="6"
          md="3"
      >
        <grid-card
            :to="item.nome"
            :title="item.nome"
            :count="item.numero_ospedali"
            icon="mdi-map-marker-radius"
        />
      </v-col>
    </v-row>

    <Sponsor mini />

    <FeedbackModal />
  </v-container>
</template>
<script setup lang="ts">
import FeedbackModal from "~/components/FeedbackModal.vue";
import Sponsor from "~/components/Sponsor.vue";

const regioni = ref();
const ospedaliTotali = ref();

onMounted(async () => {
  try {

    const data = await fetch('regioni')


    if (!data) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found'
      })
    }

    regioni.value = data.regioni;
    ospedaliTotali.value = data.ospedaliTotali;


  } catch (error) {
    console.error('Error fetching data:', error)
  }
})


</script>