<template>
  <div v-if="!props.placeholder">
    <UInput v-bind="$attrs" v-model="text"/>
  </div>
  <div v-else class="py-4">
    <div class="relative">
      <UInput v-bind="$attrs" v-model="text" placeholder="" :ui="{ base: 'peer' }" />
      <label
        class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal"
      >
        <span class="inline-flex bg-default px-1">{{ props.placeholder }}</span>
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
const text = defineModel<string>();
const props = defineProps<{
  placeholder?: string;
}>();
</script>
