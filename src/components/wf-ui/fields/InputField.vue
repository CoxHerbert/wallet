<template>
  <van-field
    v-model="localValue"
    :label="column.label"
    :disabled="isDisabled"
    :label-width="column.labelWidth || labelWidth"
    :placeholder="placeholder"
    :maxlength="column.maxlength || 200"
    :clearable="column.clearable !== false"
    :type="inputType"
    :required="isRequired"
    @focus="(event) => emit('focus', event)"
    @blur="(event) => emit('blur', event)"
    @click="(event) => emit('click', event)"
  />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  column: {
    type: Object,
    required: true,
  },
  labelWidth: String,
  disabled: Boolean,
});

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur', 'click']);

const isDisabled = computed(() => props.disabled || props.column.disabled);
const isRequired = computed(() => props.column.rules?.some((item) => item.required));

const placeholder = computed(() => {
  if (props.column.placeholder) return props.column.placeholder;
  return props.column.label ? `请输入${props.column.label}` : '请输入';
});

const inputType = computed(() => {
  const type = props.column.innerType || props.column.type;
  if (['password', 'textarea', 'number', 'digit', 'tel', 'email'].includes(type)) {
    return type === 'number' ? 'digit' : type;
  }
  return 'text';
});

const localValue = computed({
  get() {
    if (props.modelValue === undefined || props.modelValue === null) return '';
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
    emit('change', value);
  },
});
</script>
