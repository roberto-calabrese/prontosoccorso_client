<template>
  <NuxtLayout :name="layout">
    <NuxtPage/>
  </NuxtLayout>
</template>


<script setup>
const route = useRoute()

const layout = computed(() => {
  return route.query.embedded === 'true' ? 'embedded' : 'default'
})
</script>

<style lang="postcss">
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(.4rem);
}
</style>