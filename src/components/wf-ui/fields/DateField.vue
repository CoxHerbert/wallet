<template>
  <div class="wf-date-field">
    <van-field
      v-model="displayLabel"
      :label="column.label"
      :label-width="column.labelWidth || labelWidth"
      :placeholder="placeholder"
      readonly
      is-link
      @click="showCalendar = true"
    />
    <van-popup v-model:show="showCalendar" position="bottom">
      <component
        :is="pickerComponent"
        v-bind="pickerProps"
        @confirm="handleConfirm"
        @cancel="showCalendar = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
  modelValue: [String, Number, Array],
  column: { type: Object, required: true },
  labelWidth: String,
});

const emit = defineEmits(['update:modelValue', 'change']);

const showCalendar = ref(false);
const displayLabel = ref('');

const placeholder = computed(() => props.column.placeholder || `请选择${props.column.label || ''}`);
const mode = computed(() => props.column.mode || props.column.type || 'date');

const pickerComponent = computed(() => {
  if (mode.value.includes('time')) return 'van-datetime-picker';
  return 'van-calendar';
});

const pickerProps = computed(() => {
  if (pickerComponent.value === 'van-datetime-picker') {
    return {
      type: mode.value.includes('range') ? 'datetime' : mode.value,
      minDate: props.column.minDate ? new Date(props.column.minDate) : undefined,
      maxDate: props.column.maxDate ? new Date(props.column.maxDate) : undefined,
      modelValue: parseValue(props.modelValue),
    };
  }
  return {
    type: mode.value.includes('range') ? 'range' : 'single',
    minDate: props.column.minDate ? new Date(props.column.minDate) : undefined,
    maxDate: props.column.maxDate ? new Date(props.column.maxDate) : undefined,
    defaultDate: parseValue(props.modelValue),
  };
});

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      displayLabel.value = '';
      return;
    }
    if (Array.isArray(value)) {
      displayLabel.value = value.map(formatDate).join(' ~ ');
    } else {
      displayLabel.value = formatDate(value);
    }
  },
  { immediate: true }
);

function parseValue(value) {
  if (!value) return undefined;
  if (Array.isArray(value)) {
    return value.map((item) => new Date(item));
  }
  return new Date(value);
}

function formatDate(value) {
  if (!value) return '';
  return dayjs(value).format(props.column.format || 'YYYY-MM-DD');
}

function handleConfirm(value) {
  let result = value;
  if (pickerComponent.value === 'van-calendar' && Array.isArray(value)) {
    result = value.map((item) => dayjs(item).format('YYYY-MM-DD'));
  } else if (value instanceof Date) {
    result = dayjs(value).format('YYYY-MM-DD');
  }
  emit('update:modelValue', result);
  emit('change', result);
  if (Array.isArray(result)) {
    displayLabel.value = result.map((item) => formatDate(item)).join(' ~ ');
  } else {
    displayLabel.value = formatDate(result);
  }
  showCalendar.value = false;
}
</script>
