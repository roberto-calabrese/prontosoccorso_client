<template>
  <v-app>
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
        <nuxt-link to="/">
          <div class="logo">
            <h2 class="text-uppercase">Pronto Soccorso</h2>
            <h1 class="text-uppercase text-overline-">L i v e</h1>
          </div>
        </nuxt-link>

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

      <v-list color="transparent">
        <nuxt-link to="/">
          <v-list-item prepend-icon="mdi-view-dashboard" title="Home"></v-list-item>
        </nuxt-link>

      </v-list>

      <v-list v-if="apiStore.listRegion">
        <v-list-group :value="regione.regione" v-for="regione in apiStore.listRegion['routes']" :key="regione.slug_regione">
          <template v-slot:activator="{ props }">
            <v-list-item
                v-bind="props"
                prepend-icon="mdi mdi-medical-bag"
                :title="regione.regione"
            >
              <template v-slot:subtitle>
                <span class="text-amber-accent-3">Nr ospedali: {{ regione.n_ospedali }}</span>
              </template>
            </v-list-item>
          </template>
          <v-list-item
              v-for="(provincia, provinciaKey) in regione.province"
              prepend-icon="mdi mdi-city"
              :to="`${regione.slug_regione}/${provincia.meta.slug}`"
              :key="provinciaKey"
              :title="provincia.meta.Titolo"
              :value="provincia.meta.slug"
          >
            <template v-slot:subtitle>
              <span class="text-amber-accent-3">Nr ospedali: {{ provincia.n_ospedali }}</span>
            </template>
          </v-list-item>
        </v-list-group>
      </v-list>

<!--      <template v-slot:append>-->
<!--        <div class="pa-2">-->
<!--          <v-btn block color="primary">-->
<!--            Logout-->
<!--          </v-btn>-->
<!--        </div>-->
<!--      </template>-->
    </v-navigation-drawer>

    <v-main class="background-main">
      <slot/>
    </v-main>

    <v-footer
        height="55"
        style="max-height: 55px;"
        :app="!mobile"
        class="d-flex flex-column"
        elevation="10"
    >
      <div class="px-4 py-1 text-center w-100 text-overline">
        <strong>PS</strong> {{ new Date().getFullYear() }} — <strong><a class="text-white" href="https://github.com/roberto-calabrese" target="_blank">Roberto Calabrese</a></strong> —
        <span class="font-weight-thin font-italic"> v.0.1 Beta</span>
      </div>
    </v-footer>

  </v-app>
</template>

<script setup lang="ts">
import {useTheme, useDisplay} from "vuetify";

import {useCoreStore} from "~/store/core";
const coreStore = useCoreStore();

import {useApiStore} from "~/store/api";
const apiStore = useApiStore();
apiStore.fetchInit();


const theme = useTheme();
const {mobile} = useDisplay()
const drawer = ref(false);
const fab = ref(false);


</script>

<style>


.background-bar {
  background-image: linear-gradient(to bottom, #0a1412, #101817, #151b1b, #1a1f1f, #1e2323) !important;
}

.background-main {
  background-image: linear-gradient(to right top, #393c3c, #3c4041, #3f4546, #434a4b, #464e51, #495256, #4d565a, #505a5f, #545e65, #59636b, #5e6770, #636b76);
  background-size: 200% auto;
  animation: gradientAnimation 10s linear infinite;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.logo {
  line-height: normal;

  h2 {
    font-size: 10px;
  }

  h1 {
    font-size: 18px;
    animation: animationLogo 10s infinite;
  }
}

@keyframes animationLogo {
  0% {
    color: red;
  }
  25% {
    color: yellow;
  }
  50% {
    color: green;
  }
  75% {
    color: white;
  }
  100% {
    color: red;
  }
}

</style>