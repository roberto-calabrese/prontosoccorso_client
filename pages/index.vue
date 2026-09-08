<template>
  <v-container class="pa-4" fluid>
    <core-page-hero
        eyebrow="Pronto Soccorso Italia"
        subtitle="Monitora in tempo reale l'affluenza dei pronto soccorso italiani. Scegli la tua regione per iniziare."
        :count="ospedaliTotali"
        count-label="Ospedali monitorati"
        :map-points="puntiHero"
        :map-max-zoom="7"
    >
      Pronto soccorso in <span class="hl">tempo reale</span>

      <template #azioni>
        <core-search-trigger variant="hero" />
      </template>
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

/*
 * Baricentro dei presidi di ogni regione monitorata: uno per regione, quindi
 * la cartina di sfondo si inquadra sull'Italia e ogni punto corrisponde a una
 * delle schede qui sotto. Le regioni senza coordinate vengono semplicemente
 * saltate: la mappa si adatta a quelle che ci sono.
 */
const puntiHero = computed(() =>
    (regioni.value ?? [])
        .map((regione: any) => regione?.coords)
        .filter((coords: any) => coords?.lat && coords?.lng),
);

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