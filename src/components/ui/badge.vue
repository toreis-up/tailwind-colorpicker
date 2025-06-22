<template>
  <UBadge ref="previewRef" :style="chip" :class="size" />
</template>
<script lang="ts" setup>
const props = defineProps({
  color: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: false,
    default: 6
  }
});

const chip = computed(() => ({ backgroundColor: props.color }));
const size = computed(() => `size-${props.size} rounded`);
</script>