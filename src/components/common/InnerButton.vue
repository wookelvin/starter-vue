<script setup lang="ts">
defineProps<{
  iconBefore?: string;
  iconAfter?: string;
}>();
</script>

<template>
  <span>
    <i v-if="iconBefore" :class="iconBefore" class="me-1" />
    <slot />
    <i v-if="iconAfter" :class="iconAfter" class="ms-1" />
  </span>
</template>

<style scoped lang="postcss">
i,
svg {
  color: theme("colors.purple.500");
}
</style>
