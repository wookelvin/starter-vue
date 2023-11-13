<script setup lang="ts">
import { ToneTrackInfo } from "@/models/ToneTrackInfo";
import { TrackInfo } from "@/models/TrackInfo";
import { uniqueId } from "lodash";
const media = useMediaStore();
// const media = useToneStore();
const props = withDefaults(
  defineProps<{
    id?: string;
    track: TrackInfo;
    index: number;
  }>(),
  {
    id: () => uniqueId("track"),
  },
);

function setMeter(level: number) {
  const meter = document.getElementById(
    props.id + "-meter",
  ) as HTMLMeterElement;
  if (!meter) {
    return;
  }

  if (isFinite(level)) {
    if (level <= -100) {
      meter.value = -100;
    } else if (level >= 10) {
      meter.value = 10;
    } else {
      console.log("setting meter", level, meter);
      meter.value = level;
    }
  } else {
    meter.value = -100;
  }
}

function loop() {
  if (!props.track.playing) {
    //loudness.value = -100;
    setMeter(-100);
    requestAnimationFrame(loop);
    return;
  }

  const analyzer = props.track.nodes.analyzer;
  const sampleBuffer = new Float32Array(analyzer.fftSize);
  props.track.nodes.analyzer.getFloatTimeDomainData(sampleBuffer);

  // let sumOfSquares = 0;
  // for (let i = 0; i < sampleBuffer.length; i++) {
  //   sumOfSquares += sampleBuffer[i] ** 2;
  // }
  //const avgPowerDecibels = 10 * Math.log10(sumOfSquares / sampleBuffer.length);

  let peakInstantaneousPower = 0;
  for (let i = 0; i < sampleBuffer.length; i++) {
    const power = sampleBuffer[i] ** 2;
    peakInstantaneousPower = Math.max(power, peakInstantaneousPower);
  }
  const peakInstantaneousPowerDecibels =
    10 * Math.log10(peakInstantaneousPower);

  setMeter(peakInstantaneousPowerDecibels);
  requestAnimationFrame(loop);
}

onMounted(() => loop());
</script>

<template>
  <div class="flex break-inside-avoid items-center gap-2">
    <div class="flex items-center gap-2">
      <ButtonToggle
        v-model="track.muted"
        @update:model-value="media.updateGain(index)"
        >Mute</ButtonToggle
      >
      <ButtonToggle
        v-model="track.solo"
        @update:model-value="media.updateGain()"
        >Solo</ButtonToggle
      >
      <Knob
        v-model="track.stereoPan"
        @update:model-value="media.updatePan(index)"
      />
    </div>
    <div class="fader-wrapper">
      <Fader
        v-model="track.volume"
        @update:model-value="media.updateGain(index)"
        :label="`${track.track.order} ${track.track.name}`"
      />
      <meter
        class="loudness"
        min="-100"
        max="10"
        value="-100"
        :id="`${id}-meter`"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.fader-wrapper {
  @apply flex-grow;
}

.meter {
  width: 50%;
  @apply h-full rounded-full bg-red-600;
}
meter.loudness {
  @apply mt-1;
  margin-top: unset;
  height: 20px;
  background-color: unset;
  width: 100%;
}
</style>
