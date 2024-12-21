<template>
  <v-breadcrumbs :items="breadcrumbs">
    <template v-slot:divider>
      <v-icon icon="mdi-chevron-right"></v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const generateBreadcrumbs = (route) => {
  const breadcrumbs = [];
  const pathArray = route.path.split('/').filter((part) => part);

  pathArray.reduce((path, part) => {
    const fullPath = `${path}/${part}`;
    breadcrumbs.push({
      title: part.charAt(0).toUpperCase() + part.slice(1), // Capitalizza il nome
      to: fullPath,
    });
    return fullPath;
  }, '');

  return [{ title: 'Home', to: '/' }, ...breadcrumbs];
};

const route = useRoute();
const breadcrumbs = ref(generateBreadcrumbs(route));

watch(
    () => route.path,
    (newPath) => {
      breadcrumbs.value = generateBreadcrumbs(route);
    }
);
</script>

<style scoped>

</style>