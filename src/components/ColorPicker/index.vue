<template>
  <div class="flex items-center gap-2 p-2">
    <Color v-model="color" />
    <Step v-model="step" />
    <UButton variant="link" color="error" @click="remove">削除</UButton>
  </div>
</template>
<script lang="ts" setup>
import Color from "./color.vue";
import Step from "./step.vue";

const emit = defineEmits<{
  (e: "remove"): void;
}>();

function remove() {
  emit("remove");
}

const color = defineModel<string>("color");
const step = defineModel<string | number>("step");
</script>
