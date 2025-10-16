<template>
  <van-field :label="column.label" :label-width="column.labelWidth || labelWidth">
    <template #input>
      <van-radio-group v-model="localValue" :direction="column.direction || 'horizontal'">
        <van-radio
          v-for="item in options"
          :key="item[valueKey]"
          :name="item[valueKey]"
          :disabled="isDisabled || item.disabled"
        >
          {{ item[labelKey] }}
        </van-radio>
      </van-radio-group>
    </template>
  </van-field>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: [String, Number, Boolean],
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
    return props.modelValue ?? '';
  },
  set(value) {
    emit('update:modelValue', value);
    emit('change', value);
  },
});
</script>
