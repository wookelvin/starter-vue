<script setup lang="ts">
import Container from '@/components/Container.vue';

</script>

<template>
  <metainfo>
    <template #title="{ content }">
      {{ content ? `${content} | SITE_NAME` : `SITE_NAME` }}
    </template>
  </metainfo>
  <Container>
    <RouterView />
  </Container>
</template>

<style scoped lang="postcss">

</style>
