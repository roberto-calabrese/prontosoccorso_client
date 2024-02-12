<template>
  <v-container>
    <v-row>
      <v-col v-for="item in province ">
        <v-card
            class="mx-auto my-8"
            max-width="344"
            :to="currentRegione+'/'+item.meta.slug"
            rel="noopener"
        >
          <template v-slot:title>
            {{ item.meta.Titolo }}
          </template>

          <template v-slot:subtitle>
            numero ospedali: {{ item.numero_ospedali}}
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">

const { regione } = useRoute().params

const { data, error, pending } = await useAPIFetch<ResultsType>(`/${regione}`, {
  method: "GET",
})

console.log(data.value);

const currentRegione = data.value.regione;
const province  = data.value.provincie;

console.log(province);

</script>