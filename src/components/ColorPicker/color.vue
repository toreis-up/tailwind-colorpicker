<template>
  <div class="flex items-center gap-2 p-2">
    <UBadge ref="previewRef" :style="chip" class="size-6 rounded" @mousedown="open = true" />
    <UPopover
    :open="open"
    :dismissible="false"
      :content="{
      align: 'start',
      side: 'right',
      sideOffset: 8,
    }" :ui="{ content: 'w-(--reka-popper-anchor-width) p-4' }">
      <template #anchor>
        <UInput ref="inputRef" v-model="textColor" type="text" @focus="open = true" @blur="onInputBlur"/>
      </template>

      <template #content>
        <UColorPicker ref="paletteRef" v-model="paletteColor" size="xl" @mousedown="onPaletteMouseDown"/>
      </template>
    </UPopover>
  </div>
</template>
<script lang="ts" setup>
import chroma from 'chroma-js';

const color = defineModel<string>()

const paletteColor = ref(color);
const textColor = ref(color);

const open = ref(false)

const inputRef = ref();
const paletteRef = ref();
const previewRef = ref();

let paletteClicked = false;

const chip = computed(() => ({ backgroundColor: paletteColor.value }))

function onPaletteMouseDown() {
  paletteClicked = true;
}

function onInputBlur() {
  applyTextColor();
  // パレットがクリックされた場合はopenを閉じない
  if (paletteClicked) {
    paletteClicked = false;
    return;
  }
  open.value = false;
}

function handleDocumentClick(e: MouseEvent) {
  // パレットやテキストボックス以外をクリックした場合のみ閉じる
  const inputEl = inputRef.value?.$el || inputRef.value;
  const paletteEl = paletteRef.value?.$el || paletteRef.value;
  const previewEl = previewRef.value?.$el || previewRef.value;
  if (
    open.value &&
    !inputEl.contains(e.target) &&
    !paletteEl.contains(e.target) &&
    !previewEl.contains(e.target)
  ) {
    open.value = false;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleDocumentClick);
});
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleDocumentClick);
});

function applyTextColor() {
  if (chroma.valid(textColor.value)) {
    const colorStr = textColor.value ?? '';
    const color = chroma(colorStr).hex();
    console.log('Applying text color:', color);
    paletteColor.value = color;
    textColor.value = color;
  } else {
    // 不正な場合は元に戻す
    textColor.value = paletteColor.value
  }

  console.log('Applied text color:', paletteColor.value);
}

watch(paletteColor, (newColor) => {
  console.log('Palette color changed:',textColor.value,'→', newColor);
  textColor.value = newColor;
});
</script>