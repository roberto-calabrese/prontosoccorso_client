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
        <div class="logo" @click="$router.push('/')">
          <h2 class="text-uppercase">Pronto Soccorso</h2>
          <h1 class="text-uppercase text-overline-">L i v e</h1>
        </div>
        <!--From Uiverse.io by RaspberryBee-->
        <div class="loading" @click="$router.push('/')">
          <svg height="48px" width="64px">
            <polyline id="back" points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"></polyline>
            <polyline id="front" points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"></polyline>
          </svg>
        </div>

      </template>

      <template v-slot:title>

      </template>

      <template v-slot:append>
        <button-geolocation></button-geolocation>
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
        <v-list-item exac prepend-icon="mdi mdi-network-pos" to="/il-progetto" title="Il Progetto"></v-list-item>
        <v-list-item exac prepend-icon="mdi mdi-network-pos" to="/come-funziona" title="Come Funziona"></v-list-item>
      </v-list>

      <v-list v-if="apiStore.settings">
        <v-list-group :value="regione.regione" v-for="regione in apiStore.settings.routes" :key="regione.slug_regione">
          <template v-slot:activator="{ props }">
            <v-list-item
                v-bind="props"
                prepend-icon="mdi mdi-hospital"
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
          <div class="text-center">
            <v-btn
                prepend-icon="mdi-git"
                href="https://github.com/roberto-calabrese"
                color=""
                variant="outlined"
                target="_blank"
                size="small"
                block
            >
              GitHub
            </v-btn>
          </div>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
import ButtonGeolocation from "~/components/core/ButtonGeolocation.vue";
import {useRoute} from 'vue-router'
import {useApiStore} from "~/store/api";
import {useCoreStore} from "~/store/core";

const route = useRoute()
const coreStore = useCoreStore();
const apiStore = useApiStore();
const drawer = ref(false);
apiStore.fetchSettings();

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

/* From Uiverse.io by RaspberryBee */
.loading {
  cursor: pointer;
  top: 19px;
  position: absolute;
  left: 53px;
}
.loading svg polyline {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.loading svg polyline#back {
  fill: none;
}

.loading svg polyline#front {
  fill: none;
  stroke: #FF0000;
  stroke-dasharray: 48, 144;
  stroke-dashoffset: 192;
  animation: dash_682 1.4s linear infinite, animationLogo 10s infinite;
}

@keyframes dash_682 {
  72.5% {
    opacity: 0;
  }

  to {
    stroke-dashoffset: 0;
  }
}


</style>


