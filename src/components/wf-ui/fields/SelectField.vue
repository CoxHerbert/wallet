<template>
  <div class="wf-select-field">
    <van-field
      v-model="displayLabel"
      :label="column.label"
      :label-width="column.labelWidth || labelWidth"
      :placeholder="placeholder"
      readonly
      is-link
      :required="isRequired"
      @click="showPicker = true"
    />
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker
        :columns="pickerColumns"
        :columns-field-names="fieldNames"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  column: { type: Object, required: true },
  dic: {
    type: Array,
    default: () => [],
  },
  labelWidth: String,
});

const emit = defineEmits(['update:modelValue', 'change']);

const showPicker = ref(false);

const options = computed(() => props.column.dicData || props.dic || []);
const valueKey = computed(() => props.column.props?.value || 'value');
const labelKey = computed(() => props.column.props?.label || 'label');

const pickerColumns = computed(() => options.value);
const fieldNames = computed(() => ({ text: labelKey.value, value: valueKey.value }));

const placeholder = computed(() => props.column.placeholder || `请选择${props.column.label || ''}`);
const isRequired = computed(() => props.column.rules?.some((item) => item.required));

const displayLabel = ref('');

watch(
  () => props.modelValue,
  (value) => {
    const current = options.value.find((item) => item[valueKey.value] === value);
    displayLabel.value = current ? current[labelKey.value] : '';
  },
  { immediate: true }
);

watch(
  options,
  () => {
    const current = options.value.find((item) => item[valueKey.value] === props.modelValue);
    displayLabel.value = current ? current[labelKey.value] : '';
  },
  { deep: true }
);

function onConfirm(payload) {
  const option = Array.isArray(payload?.selectedOptions)
    ? payload.selectedOptions[0]
    : Array.isArray(payload)
    ? payload[0]
    : undefined;
  if (option) {
    const value = option[valueKey.value];
    emit('update:modelValue', value);
    emit('change', value);
    displayLabel.value = option[labelKey.value];
  }
  showPicker.value = false;
}
</script>
