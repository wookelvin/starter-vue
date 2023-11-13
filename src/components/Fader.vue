<script setup lang="ts">
const mouse = useMouse();
const mousePressed = useMousePressed();

const props = defineProps<{
  modelValue: number;
  label: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const amount = computed({
  get: () => props.modelValue,
  set: (val: number) => {
    emits("update:modelValue", val);
  },
});

const levelPercent = computed(() => `width: ${amount.value * 100}%`);

function setFader(newValue: number) {
  let processedVal = newValue;
  if (processedVal > 1) {
    processedVal = 1;
  } else if (newValue < 0) {
    processedVal = 0;
  }
  console.log(`new pan value: ${processedVal} ${newValue}`);
  amount.value = processedVal;
}

let startX = 0;
let endX = 0;
let dragging = false;
let originalAmount = 0;
function onMouseDown() {
  dragging = true;
  startX = mouse.x.value;
  originalAmount = amount.value;
}

watch(mouse.x, onMouseMove);
function onMouseMove() {
  if (dragging) {
    endX = mouse.x.value;
    calculateVol();
  }
}

watch(mousePressed.pressed, () => !mousePressed.pressed.value && onMouseUp());

function onMouseUp() {
  dragging = false;
}

const faderRef = ref<HTMLDivElement>();
function calculateVol() {
  let width = 100;
  if (faderRef.value) {
    width = faderRef.value.clientWidth;
  }
  const delta = (endX - startX) / width;
  setFader(originalAmount + delta);
}
</script>

<template>
  <div
    class="track-fader"
    @mousedown="onMouseDown"
    ref="faderRef"
    draggable="false"
  >
    <div class="track-level" :style="levelPercent"></div>
    <div class="track-label">
      {{ label }}
    </div>
  </div>
</template>

<style scoped lang="postcss">
.track-label {
  @apply pointer-events-none absolute bottom-0 left-0 right-0 top-0 z-[3] flex select-none items-center gap-2 px-5 font-bold;
}
.track-fader {
  height: 3em;
  @apply relative flex-1 overflow-hidden rounded-lg bg-gray-200;
}
.track-level {
  @apply pointer-events-none absolute bottom-0 left-0 top-0 z-[2] bg-orange-400;
}
</style>
