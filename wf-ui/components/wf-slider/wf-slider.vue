<template>
  <div class="wf-slider">
    <template v-if="column.range">
      <input
        class="wf-slider__range"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        v-model.number="sliderValue[0]"
        :disabled="disabled"
        @change="onRangeChange"
      />
      <input
        class="wf-slider__range"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        v-model.number="sliderValue[1]"
        :disabled="disabled"
        @change="onRangeChange"
      />
    </template>
    <template v-else>
      <input
        class="wf-slider__range"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        v-model.number="sliderValue"
        :disabled="disabled"
        @change="onChange"
      />
    </template>
    <span class="wf-slider__text">{{ showText }}</span>
  </div>
</template>

<script>
import Props from '../../mixins/props.js'

export default {
  name: 'wf-slider',
  mixins: [Props],
  data() {
    return { text: 0, sliderValue: 0 }
  },
  computed: {
    min() {
      return this.column?.min ?? 0
    },
    max() {
      return this.column?.max ?? 100
    },
    step() {
      return this.column?.step ?? 1
    },
    showText() {
      if (typeof this.text == 'object') return this.text.join(',')
      else return this.text
    }
  },
  watch: {
    text: {
      handler(val) {
        this.initValue()
        this.handleChange(val)
      }
    }
  },
  methods: {
    initValue() {
      if (this.column.range) {
        const value = Array.isArray(this.text) ? this.text : (this.text + '').split(',')
        const start = Number(value[0]) || this.min
        const end = Number(value[1] ?? start) || this.min
        this.sliderValue = [start, end]
      } else {
        const single = Array.isArray(this.text) ? this.text[0] : this.text
        this.sliderValue = Number(single) || this.min
      }
    },
    onRangeChange() {
      if (!Array.isArray(this.sliderValue)) return
      const start = Math.min(Math.max(this.sliderValue[0], this.min), this.max)
      const end = Math.min(Math.max(this.sliderValue[1], this.min), this.max)
      this.sliderValue = [start, Math.max(start, end)]
      const result = this.sliderValue
      this.text = this.column?.range && this.stringMode ? result.join(',') : result
    },
    onChange() {
      const value = Math.min(Math.max(Number(this.sliderValue) || this.min, this.min), this.max)
      this.sliderValue = value
      this.text = value
    }
  }
}
</script>

<style lang="scss" scoped>
.wf-slider {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wf-slider__range {
  flex: 1;
}

.wf-slider__text {
  min-width: 48px;
}
</style>
