<template>
  <van-field
    :label="column.label"
    :label-width="column.labelWidth || labelWidth"
    :required="isRequired"
  >
    <template #input>
      <van-stepper
        v-model="localValue"
        :min="column.min ?? 0"
        :max="column.max ?? Number.MAX_SAFE_INTEGER"
        :step="column.step ?? 1"
        :disabled="isDisabled"
        integer
      />
    </template>
  </van-field>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  column: { type: Object, required: true },
  labelWidth: String,
  disabled: Boolean,
});

const emit = defineEmits(['update:modelValue', 'change']);

const isDisabled = computed(() => props.disabled || props.column.disabled);
const isRequired = computed(() => props.column.rules?.some((item) => item.required));

const localValue = computed({
  get() {
    if (props.modelValue === undefined || props.modelValue === null) {
      return props.column.min ?? 0;
    }
    return Number(props.modelValue);
  },
  set(value) {
    const numberValue = Number(value);
    emit('update:modelValue', numberValue);
    emit('change', numberValue);
  },
});
</script>
