<template>
  <v-dialog
      max-width="500"
      v-model="dialog"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
          prepend-icon="mdi-information-slab-circle-outline"
          size="large"
          text="Legenda"
          v-bind="activatorProps"
          class="ml-4"
      ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Legenda Codici">
        <v-card-text>
          <v-list lines="two">
            <v-list-item>
              <v-list-item-title>
                <v-chip variant="flat" color="red">Rosso</v-chip>
                Emergenza
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1 ms-1">
                Assenza o rapido deterioramento di una o più funzioni vitali
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>
                <v-chip variant="flat" color="yellow">Giallo</v-chip>
                Urgenza indifferibile
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1 ms-1">
                Rischio compromissione funzioni vitali. Condizione stabile con rischio evolutivo
              </v-list-item-subtitle>

            </v-list-item>

            <v-list-item>
              <v-list-item-title>
                <v-chip variant="flat" color="green">Verde</v-chip>
                Urgenza differibile
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1 ms-1">
                Condizione stabile senza rischio evolutivo con sofferenza e ricaduta sullo stato generale
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>
                <v-chip variant="flat" color="blue">Azzurro</v-chip>
                Urgenza minore
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1 ms-1">
                Condizione stabile senza rischio evolutivo
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>
                <v-chip variant="flat" color="neutro">Bianco</v-chip>
                Non urgenza
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1 ms-1">
                Condizione stabile senza rischio evolutivo, non urgente o minima rilevanza clinica
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
              text="Chiudi"
              @click="dialog = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import {shallowRef} from 'vue';
const dialog = shallowRef(false)
</script>/
