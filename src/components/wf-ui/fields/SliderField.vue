<template>
  <van-field :label="column.label" :label-width="column.labelWidth || labelWidth">
    <template #input>
      <div class="wf-slider__wrapper">
        <van-slider
          v-model="localValue"
          :min="column.min ?? 0"
          :max="column.max ?? 100"
          :step="column.step ?? 1"
          :disabled="isDisabled"
          :bar-height="column.barHeight || 4"
        />
        <span class="wf-slider__value">{{ localValue }}</span>
      </div>
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
    if (props.modelValue === undefined || props.modelValue === null) return props.column.min ?? 0;
    return Number(props.modelValue);
  },
  set(value) {
    const numberValue = Number(value);
    emit('update:modelValue', numberValue);
    emit('change', numberValue);
  },
});
</script>

<style scoped lang="scss">
.wf-slider__wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.wf-slider__value {
  min-width: 40px;
  text-align: right;
  color: #323233;
}
</style>
