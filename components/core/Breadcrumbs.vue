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
import { slugToTitle } from '@/utils/string-utils';

const generateBreadcrumbs = (route) => {
  const breadcrumbs = [];
  const pathArray = route.path.split('/').filter((part) => part);

  pathArray.reduce((path, part) => {
    const fullPath = `${path}/${part}`;
    breadcrumbs.push({
      title: slugToTitle(part),
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