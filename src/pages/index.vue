<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="min-h-screen p-6">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Tailwind カラーパレット作るやーつ &beta;</h1>
      <UiInput v-model="paletteName" placeholder="パレット名" />
      ベースとなる色を選択してください。
      <ColorPickerList v-model="colorList" />
      <UButton @click="genPalette">パレット生成</UButton>
      <ColorRenderer :colors="generatedPalette" />
      <ColorRendererField
        autoresize
        :palette-name="paletteName"
        :colors="generatedPalette"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ColorElement } from "~/types/step";

const paletteName = ref("custom");
const generatedPalette = ref({});

const colorList = ref<ColorElement[]>([
  { id: 1, hex: "#000000", step: "auto" },
]);

const genPalette = () => {
  generatedPalette.value = generatePalette(colorList.value);
};
</script>
