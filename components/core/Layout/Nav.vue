<template>
  <div>
    <v-app-bar class="background-bar">

      <template v-slot:image>
        <v-img
            class="background-bar"
        ></v-img>
      </template>

      <template v-slot:prepend>
        <v-app-bar-nav-icon
            @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
      </template>

      <template v-slot:title>
        <div class="logo" @click="$router.push('/')">
          <h2 class="text-uppercase">Pronto Soccorso</h2>
          <h1 class="text-uppercase text-overline-">L i v e</h1>
        </div>
      </template>

      <v-progress-linear
          :active="coreStore.isLoading"
          :indeterminate="coreStore.isLoading"
          :absolute="true"
          location="bottom"
          height="2"
          color="light-blue-lighten-1"
      ></v-progress-linear>

    </v-app-bar>
    <v-navigation-drawer
        class=""
        v-model="drawer"
        :temporary="true"
    >

      <v-list>
        <v-list-item exac prepend-icon="mdi-view-dashboard" to="/" title="Home"></v-list-item>
        <v-list-item exac prepend-icon="mdi mdi-network-pos" to="/come-funziona" title="Come Funziona"></v-list-item>
      </v-list>

      <v-list v-if="apiStore.settings">
        <v-list-group :value="regione.regione" v-for="regione in apiStore.settings.routes" :key="regione.slug_regione">
          <template v-slot:activator="{ props }">
            <v-list-item
                v-bind="props"
                prepend-icon="mdi mdi-medical-bag"
                :title="regione.regione"
            >
              <template v-slot:subtitle>
                <span class="text-amber-accent-3">Ospedali: {{ regione.n_ospedali }}</span>
              </template>
            </v-list-item>
          </template>
          <v-list-item
              v-for="(provincia, provinciaKey) in regione.province"
              prepend-icon="mdi mdi-city"
              :to="`/${regione.slug_regione}/${provincia.meta.slug}`"
              :key="provinciaKey"
              :value="provincia.meta.slug"
              exac
              active-class="info--text"
          >
            <template v-slot:title>
              {{ provincia.meta.Titolo }} <span class="text-amber-accent-3">{{ provincia.n_ospedali }}</span>
            </template>
          </v-list-item>
        </v-list-group>
      </v-list>

      <template v-slot:append>
        <div class="pa-3 text-center">
          <buy-me-coffe></buy-me-coffe>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()

import {useCoreStore} from "~/store/core";
const coreStore = useCoreStore();

import {useApiStore} from "~/store/api";
const apiStore = useApiStore();
apiStore.fetchSettings();

const drawer = ref(false);

</script>

<style lang="postcss">
.background-bar {
  background-image: linear-gradient(to bottom, #0a1412, #101817, #151b1b, #1a1f1f, #1e2323) !important;
}

.logo {
  line-height: normal;
  cursor: pointer;

  h2 {
    font-size: 10px;
  }

  h1 {
    font-size: 18px;
    animation: animationLogo 10s infinite;
  }
}

</style>


