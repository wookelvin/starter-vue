<script setup lang="ts">
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

<style scoped lang="postcss"></style>
