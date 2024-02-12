<template>
  <v-container>
    <v-row>
      <v-col v-for="item in regioni ">
          <v-card
              class="mx-auto my-8"
              max-width="344"
              :to="item.nome"
              rel="noopener"
          >
            <template v-slot:title>
              {{ item.nome }}
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

const { data, error, pending } = await useAPIFetch<ResultsType>("/regioni", {
  method: "GET",
})

const regioni = data.value.regioni;

</script>