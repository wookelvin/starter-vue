<script setup lang="ts">
import { useMeta } from 'vue-meta';

useMeta({
    title: 'Home',
    htmlAttrs: { lang: 'en', amp: true }
  });
</script>

<template>
  <div
    class="text-center flex items-center justify-center"
    style="height:100vh;"
  >
    <h1><i class="iconoir-peace-hand" /> Home</h1>
  </div>
</template>

<style scoped lang="postcss">
i{ 
  font-weight:100;
}
</style>
