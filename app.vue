<template>
  <NuxtPwaManifest />
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
</template>

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