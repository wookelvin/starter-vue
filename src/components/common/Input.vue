<script setup lang="ts">
const props = defineProps<{
  type: string;
  label: string;
  modelValue: string | number;
  min: string;
  max: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
}>();

const val = computed({
  get: () => props.modelValue,
  set: (v) => {
    if (typeof props.modelValue === "number" && typeof v === "string") {
      emit("update:modelValue", parseInt(v));
    } else {
      emit("update:modelValue", v);
    }
  },
});
</script>

<template>
  <div class="wrapper">
    <label class="label-text">{{ label }}</label>
    <input :type="type" v-model="val" class="input" />
    <input type="range" :min="min" :max="max" v-model="val" class="range" />
  </div>
</template>

<style scoped lang="postcss">
.input {
  @apply w-full bg-gray-100;
}
label {
  @apply pointer-events-none absolute -top-5 left-3  p-1 text-xs;
}
.wrapper {
  @apply relative flex items-center gap-2;
}
.input {
  @apply w-24;
}
.range {
  @apply w-72;
}
</style>
