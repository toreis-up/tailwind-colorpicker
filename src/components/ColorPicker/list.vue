<template>
  <div>
    <UButton :disabled="colors.length === maxColors" class="mt-2" @click="addColor">
      追加
    </UButton>
    <ColorPicker v-for="color in colors" :key="color.id" :color="color.hex" :step="color.step" @remove="removeColor(color.id)"/>
  </div>
</template>
<script lang="ts" setup>
const minColors = 1;
const maxColors = 11;

const colors = defineModel({
  type: Array<{ id: number, hex: string, step: string }>,
  required: true
});

function addColor() {
  if (colors.value.length >= maxColors) {
    // Prevent adding more than maxColors
    return;
  }
  colors.value.push({
    id: colors.value.length+1,
    hex: '#000000',
    step: 'auto'
  });
}

function removeColor(colorId: number) {
  if (colors.value.length <= minColors) {
    // Prevent removing the last color
    return;
  }
  colors.value = colors.value.filter(color => color.id !== colorId);
}
</script>