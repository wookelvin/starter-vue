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
    <div>
      <h1><i class="iconoir-peace-hand" /> VUE3 TEMPLATE STARTER</h1>
      <p>Boilerplate repo that includes all you need to get started</p>
      <ul class="my-3">
        <li>vite</li>
        <li>vue3</li>
        <li>typescript</li>
        <li>pinia</li>
        <li>tailwindcss</li>
        <li>postcss with nesting, autoprefixer, importing</li>
        <li>eslintrc</li>
        <li>@ alias setup</li>
        <li>@vueuse/core</li>
        <li>lodash</li>
        <li>iconoir</li>
        <li>daisy UI</li>
      </ul>
      <div>
        <button class="btn">
          Nice!
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
i{ 
  font-weight:100;
}
</style>
