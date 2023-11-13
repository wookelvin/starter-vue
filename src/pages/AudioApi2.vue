<script setup lang="ts">
import { SouthOfTheWaterSong as song } from "@/assets/SouthOfTheWaterSong";

const media = useMedia2Store();
async function loadSong() {
  await media.init(song);
}
</script>

<template>
  <h1>Web Multitracks Demo - Using Web Audio API</h1>
  <div class="mt-3 flex gap-2">
    <Button v-if="media.loading" @click="loadSong" variant="primary" busy>
      Loading Song ...
    </Button>
    <Button v-else-if="!media.song" @click="loadSong" variant="primary">
      Load Song
    </Button>
    <div v-else class="flex items-center gap-2">
      <Button v-if="!media.playing" @click="media.play()" variant="primary"
        >Play</Button
      >
      <Button v-else @click="media.pause()" variant="primary">Pause</Button>
      <Button @click="media.muteAll()">Mute All</Button>
      <Button @click="media.unMuteAll()">Unmute All</Button>
      <Button @click="media.resetSettings()">Reset Settings</Button>
      <Input
        type="number"
        v-model="media.detune"
        label="Pitch"
        class="w-24"
        min="-12"
        max="12"
        @update:model-value="media.togglePlay"
      />
      <Input
        type="number"
        v-model="media.tempo"
        label="Tempo"
        class="w-24"
        min="10"
        max="300"
        @update:model-value="media.togglePlay"
      />
    </div>
  </div>
  <div class="columns-3 gap-20">
    <div class="tracks">
      <Track v-for="(t, i) of media.tracks" :key="i" :track="t" :index="i" />
    </div>
  </div>
</template>

<style scoped lang="postcss">
i {
  font-weight: 100;
}
.tracks {
  @apply my-5 grid gap-2;
}
</style>
