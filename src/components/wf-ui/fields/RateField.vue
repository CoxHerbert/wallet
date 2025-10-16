<template>
  <van-field :label="column.label" :label-width="column.labelWidth || labelWidth">
    <template #input>
      <van-rate
        v-model="localValue"
        :count="column.count || 5"
        :size="column.size || 24"
        :color="column.color || '#ffd21e'"
        :void-color="column.voidColor || '#c8c9cc'"
        :allow-half="column.allowHalf || false"
        :disabled="isDisabled"
      />
    </template>
  </van-field>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: [Number, String],
  column: { type: Object, required: true },
  labelWidth: String,
  disabled: Boolean,
});

const emit = defineEmits(['update:modelValue', 'change']);
const isDisabled = computed(() => props.disabled || props.column.disabled);

const localValue = computed({
  get() {
    if (props.modelValue === undefined || props.modelValue === null) return 0;
    return Number(props.modelValue);
  },
  set(value) {
    const numberValue = Number(value);
    emit('update:modelValue', numberValue);
    emit('change', numberValue);
  },
});
</script>
