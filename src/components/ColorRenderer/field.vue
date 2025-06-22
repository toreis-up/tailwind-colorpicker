<template>
  <UTextarea v-model="paletteText" class="w-100" readonly>
    <template #trailing>
      <UTooltip text="Copy to clipboard" :content="{ side: 'right' }">
        <UButton
          :color="copied ? 'success' : 'neutral'"
          variant="link"
          size="sm"
          :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
          aria-label="Copy to clipboard"
          @click="copy(paletteText)"
        />
      </UTooltip>
    </template>
  </UTextarea>
</template>
<script lang="ts" setup>
import { useClipboard } from '@vueuse/core';
import { renderResult } from '#imports';
import { UButton } from '#components';

const { copy, copied } = useClipboard()

const props = defineProps<{
  colors: { [key: number]: string };
  paletteName: string
}>();

const sortedColors = computed(() =>
  Object.entries(props.colors)
    .sort(([a], [b]) => Number(a) - Number(b))
    .reduce((acc, [step, hex]) => {
      acc[Number(step)] = hex;
      return acc;
    }, {} as { [key: number]: string })
);

const paletteText = computed(() => {
  return renderResult({paletteObj: sortedColors.value, paletteName: props.paletteName}).css
})
</script>