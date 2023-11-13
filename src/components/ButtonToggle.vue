<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const val = computed({
  get: () => props.modelValue,
  set: (val) => emits("update:modelValue", val),
});
</script>

<template>
  <Button @click="val = !val" :variant="(val && 'secondary') || undefined"
    ><slot
  /></Button>
</template>

<style scoped lang="postcss"></style>
