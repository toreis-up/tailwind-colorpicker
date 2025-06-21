<template>
  <UBadge ref="previewRef" :style="chip" class="size-6 rounded" />
</template>
<script lang="ts" setup>
const {color} = defineProps<{
  color: string
}>();

const chip = computed(() => ({ backgroundColor: color }));
</script>