<template>
  <van-field :label="column.label" :label-width="column.labelWidth || labelWidth">
    <template #input>
      <van-checkbox-group v-model="localValue" :direction="column.direction || 'horizontal'">
        <van-checkbox
          v-for="item in options"
          :key="item[valueKey]"
          :name="item[valueKey]"
          :disabled="isDisabled || item.disabled"
        >
          {{ item[labelKey] }}
        </van-checkbox>
      </van-checkbox-group>
    </template>
  </van-field>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [Array, String],
    default: () => [],
  },
  column: { type: Object, required: true },
  dic: {
    type: Array,
    default: () => [],
  },
  labelWidth: String,
  disabled: Boolean,
});

const emit = defineEmits(['update:modelValue', 'change']);

const options = computed(() => props.column.dicData || props.dic || []);
const valueKey = computed(() => props.column.props?.value || 'value');
const labelKey = computed(() => props.column.props?.label || 'label');
const isDisabled = computed(() => props.disabled || props.column.disabled);

const localValue = computed({
  get() {
    if (Array.isArray(props.modelValue)) return [...props.modelValue];
    if (typeof props.modelValue === 'string') {
      return props.modelValue.split(props.column.separator || ',').filter(Boolean);
    }
    return [];
  },
  set(value) {
    let output = value;
    if (props.column.stringMode || typeof props.modelValue === 'string') {
      output = value.join(props.column.separator || ',');
    }
    emit('update:modelValue', output);
    emit('change', output);
  },
});
</script>
