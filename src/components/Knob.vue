<script setup lang="ts">
const mouse = useMouse();
const mousePressed = useMousePressed();

const props = defineProps<{
  modelValue: number;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const pan = computed({
  get: () => props.modelValue,
  set: (val: number) => {
    emits("update:modelValue", val);
  },
});

const dotTransform = computed(
  () => `transform:rotateZ(${pan.value * 135}deg);`,
);

let dragging = false;
let mouseStartY = 0;
let mouseEndY = 0;
let originalPan = 0;
function startDrag() {
  console.log("start-drag");
  dragging = true;
  originalPan = pan.value;
  mouseStartY = mouse.y.value;
}

watch(mousePressed.pressed, () => !mousePressed.pressed.value && endDrag());

function endDrag() {
  console.log("end-drag");
  dragging = false;
}

watch(mouse.y, onDrag);
function onDrag() {
  if (dragging) {
    mouseEndY = mouse.y.value;
    //console.log("dragging", mouseEndY);
    calculateVol();
  }
}

function calculateVol() {
  const delta = (mouseEndY - mouseStartY) / 300;
  setPan(originalPan + delta);
}

function setPan(newPanValue: number) {
  let processedVal = newPanValue;
  if (processedVal > 1) {
    processedVal = 1;
  } else if (processedVal < -1) {
    processedVal = -1;
  }
  console.log(`new pan value: ${processedVal} ${newPanValue}`);
  pan.value = processedVal;
}
</script>

<template>
  <button
    type="button"
    class="knob"
    @mousedown="startDrag"
    :style="dotTransform"
  >
    <div class="knob-dot"></div>
    <div class="center-mark"></div>
  </button>
</template>

<style scoped lang="postcss">
.knob {
  @apply flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-orange-100;
}

.knob-dot {
  @apply h-2 w-2 rounded-full bg-orange-400;
  transform: translateY(-1em);
}
</style>
