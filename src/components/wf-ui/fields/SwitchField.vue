<template>
  <van-field :label="column.label" :label-width="column.labelWidth || labelWidth">
    <template #input>
      <van-switch v-model="localValue" :disabled="isDisabled" size="24px" />
    </template>
  </van-field>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  column: { type: Object, required: true },
  labelWidth: String,
  disabled: Boolean,
});

const emit = defineEmits(['update:modelValue', 'change']);
const isDisabled = computed(() => props.disabled || props.column.disabled);

const localValue = computed({
  get() {
    return Boolean(props.modelValue);
  },
  set(value) {
    emit('update:modelValue', value);
    emit('change', value);
  },
});
</script>
