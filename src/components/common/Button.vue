<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: "submit" | "button" | "reset";
    to?: string;
    href?: string;
    target?: string;
    variant?: string;
    iconBefore?: string;
    iconAfter?: string;
    size?: string;
    busy?: boolean;
    circle?: boolean;
    title?: string;
  }>(),
  {
    type: "button",
    to: "",
    href: "",
    target: undefined,
    variant: undefined,
    iconBefore: undefined,
    iconAfter: undefined,
    size: undefined,
    circle: false,
    title: undefined,
  },
);

const buttonClasses = computed(() => {
  const classes = ["btn"] as string[];
  if (props.variant) {
    classes.push(`btn-${props.variant}`);
  }
  if (props.size) {
    classes.push(`btn-${props.size}`);
  }
  if (props.busy) {
    classes.push(`btn-disabled`);
  }
  if (props.circle) {
    classes.push("rounded-full");
  }
  return classes.join(" ");
});

const emit = defineEmits<{
  (e: "click", event: Event): void;
}>();

function onClick(event: Event) {
  emit("click", event);
}

const _iconBefore = computed(() =>
  props.busy ? "fa-spin fa-spinner-third fa-light" : props.iconBefore,
);
</script>

<template>
  <!-- btn-primary btn-warning btn-error btn-light btn-neutral btn-white btn-secondary btn-sm btn-xs btn-lg -->
  <router-link v-if="to" :to="to" :class="buttonClasses" :title="title"
    ><InnerButton :icon-before="_iconBefore" :icon-a-fter="iconAfter"
      ><slot /></InnerButton
  ></router-link>
  <a
    v-else-if="href"
    :href="href"
    :target="target"
    :class="buttonClasses"
    :title="title"
  >
    <InnerButton :icon-before="_iconBefore" :icon-after="iconAfter"
      ><slot
    /></InnerButton>
  </a>
  <button
    v-else
    :type="type"
    :class="buttonClasses"
    :title="title"
    @click="onClick"
  >
    <InnerButton :icon-before="_iconBefore" :icon-after="iconAfter"
      ><slot
    /></InnerButton>
  </button>
</template>

<style scoped lang="postcss">
.btn-error {
  @apply text-white;
  :deep() {
    i,
    svg {
      @apply text-white;
    }
  }
}
</style>
