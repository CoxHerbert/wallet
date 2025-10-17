<template>
  <div class="wf-number">
    <button
      type="button"
      class="wf-number__btn"
      :disabled="disabled || number <= min"
      @click="changeStep(-step)"
    >
      -
    </button>
    <input
      class="wf-number__input"
      type="number"
      v-model.number="number"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <button
      type="button"
      class="wf-number__btn"
      :disabled="disabled || number >= max"
      @click="changeStep(step)"
    >
      +
    </button>
  </div>
</template>

<script>
import Props from '../../mixins/props.js'
export default {
  name: 'wf-number',
  mixins: [Props],
  data() {
    return { number: undefined }
  },
  computed: {
    min() {
      return this.column?.min ?? 0
    },
    max() {
      return this.column?.max ?? 99999
    },
    step() {
      return this.column?.step ?? 1
    }
  },
  watch: {
    text: {
      handler(val) {
        const parsed = Number(val)
        this.number = isNaN(parsed) ? this.min : parsed
      },
      immediate: true
    },
    number(val) {
      if (val === undefined || val === null) return
      const clamped = this.clampValue(Number(val))
      if (clamped !== val) {
        this.number = clamped
        return
      }
      this.text = clamped
    }
  },
  methods: {
    clampValue(value) {
      if (isNaN(value)) return this.min
      if (value < this.min) return this.min
      if (value > this.max) return this.max
      return value
    },
    changeStep(delta) {
      if (this.disabled) return
      const next = this.clampValue((Number(this.number) || 0) + delta)
      this.number = next
      this.handleClick()
    }
  }
}
</script>

<style lang="scss" scoped>
.wf-number {
  display: inline-flex;
  align-items: center;
}

.wf-number__btn {
  width: 32px;
  height: 32px;
  border: 1px solid #dcdfe6;
  background: #f5f7fa;
  cursor: pointer;
}

.wf-number__input {
  width: 60px;
  margin: 0 4px;
  padding: 4px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  text-align: center;
}
</style>
