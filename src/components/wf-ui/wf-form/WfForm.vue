<template>
  <van-form ref="formRef" @submit="handleSubmit">
    <van-cell-group inset>
      <component
        v-for="column in normalizedColumns"
        :is="resolveComponent(column)"
        :key="column.prop"
        v-model="formState[column.prop]"
        :column="column"
        :dic="column.dicData || column.dic || []"
        :label-width="column.labelWidth || labelWidth"
        :disabled="disabled || column.disabled"
        @change="(value) => handleFieldChange(column, value)"
      />
    </van-cell-group>
    <slot name="actions">
      <div class="wf-form__actions">
        <van-button round block type="primary" native-type="submit">提交</van-button>
      </div>
    </slot>
  </van-form>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import InputField from '../fields/InputField.vue';
import NumberField from '../fields/NumberField.vue';
import RadioField from '../fields/RadioField.vue';
import CheckboxField from '../fields/CheckboxField.vue';
import SelectField from '../fields/SelectField.vue';
import SwitchField from '../fields/SwitchField.vue';
import RateField from '../fields/RateField.vue';
import SliderField from '../fields/SliderField.vue';
import DateField from '../fields/DateField.vue';
import UnsupportedField from '../fields/UnsupportedField.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  columns: {
    type: Array,
    default: () => [],
  },
  labelWidth: {
    type: String,
    default: '80px',
  },
  disabled: Boolean,
});

const emit = defineEmits(['update:modelValue', 'change', 'submit']);

const formState = reactive({ ...props.modelValue });

watch(
  () => props.modelValue,
  (value) => {
    Object.keys(formState).forEach((key) => delete formState[key]);
    Object.assign(formState, value || {});
  },
  { deep: true }
);

const normalizedColumns = computed(() => {
  return (props.columns || [])
    .map((column) => ({
      ...column,
      type: column.type || 'input',
      prop: column.prop || column.field,
      innerType:
        column.type === 'textarea'
          ? 'textarea'
          : column.type === 'password'
          ? 'password'
          : column.innerType,
    }))
    .filter((column) => !!column.prop);
});

watch(
  normalizedColumns,
  (columns) => {
    columns.forEach((column) => {
      if (!(column.prop in formState)) {
        formState[column.prop] = column.value ?? column.default ?? getInitialValue(column.type);
      }
    });
  },
  { immediate: true }
);

function handleFieldChange(column, value) {
  const updated = { ...formState, [column.prop]: value };
  emit('update:modelValue', updated);
  emit('change', { prop: column.prop, value, column, model: updated });
}

function handleSubmit() {
  emit('submit', { ...formState });
}

function resolveComponent(column) {
  const type = column.type;
  if (['input', 'password', 'textarea'].includes(type)) {
    return InputField;
  }
  if (['number', 'stepper'].includes(type)) {
    return NumberField;
  }
  if (['radio'].includes(type)) {
    return RadioField;
  }
  if (['checkbox'].includes(type)) {
    return CheckboxField;
  }
  if (['select', 'picker'].includes(type)) {
    return SelectField;
  }
  if (['switch'].includes(type)) {
    return SwitchField;
  }
  if (['rate'].includes(type)) {
    return RateField;
  }
  if (['slider'].includes(type)) {
    return SliderField;
  }
  if (['date', 'datetime', 'time'].includes(type)) {
    return DateField;
  }
  return UnsupportedField;
}

const formRef = ref();

defineExpose({
  submit: () => formRef.value?.submit(),
  getModel: () => ({ ...formState }),
});

function getInitialValue(type) {
  if (['checkbox'].includes(type)) return [];
  if (['rate', 'slider', 'number', 'stepper'].includes(type)) return 0;
  if (['switch'].includes(type)) return false;
  return '';
}
</script>

<style scoped lang="scss">
.wf-form__actions {
  margin-top: 16px;
}
</style>
