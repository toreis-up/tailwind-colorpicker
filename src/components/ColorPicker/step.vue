<template>
  <USelect v-model="selectMode" :items="options" class="w-24" />
</template>

<script lang="ts" setup>
import { STEP_OPTIONS } from "~/types/step";

const options = ref(STEP_OPTIONS);

const selectMode = defineModel<string>();
</script>
