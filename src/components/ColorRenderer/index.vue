<template>
  <div class="flex items-center gap-2 p-2">
    <div v-for="color in colors" :key="color.id">
      <div>
        <UiBadge :color="color.hex" :size="14" />
      </div>
      <div>
        {{ color.hex }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  colors: { [key: number]: string };
}>();

const colors = computed(() =>
  Object.entries(props.colors)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([step, hex]) => [step, hex])
    .map(([step, hex]) => ({ id: Number(step), hex }))
);
</script>
