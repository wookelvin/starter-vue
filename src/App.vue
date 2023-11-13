<script setup lang="ts"></script>

<template>
  <Container>
    <div class="flex gap-5">
      <router-link class="link" to="/audio-api">Audio API</router-link>
      <router-link class="link" to="/tonejs">Tone.js</router-link>
    </div>
    <RouterView />
  </Container>
</template>

<style scoped lang="postcss"></style>
