<template>
  <div class="wf-rate">
    <button
      v-for="index in count"
      :key="index"
      type="button"
      class="wf-rate__item"
      :class="{ 'wf-rate__item--active': index <= (Number(text) || 0) }"
      :disabled="disabled"
      @click="setValue(index)"
    >
      ★
    </button>
    <span
      v-if="column.showText && column.texts && column.texts[text - 1]"
      class="wf-rate__text"
    >
      {{ column.texts[text - 1] }}
    </span>
    <span v-else-if="column.showScore && !column.showText" class="wf-rate__text">{{ text }}</span>
  </div>
</template>

<script>
import Props from '../../mixins/props.js'
export default {
  name: 'wf-rate',
  mixins: [Props],
  data() {
    return { text: 0 }
  },
  computed: {
    count() {
      return this.column?.max || 5
    }
  },
  methods: {
    setValue(index) {
      if (this.disabled) return
      const value = Number(index)
      if (!value && value !== 0) return
      this.text = value
      this.ensureMin(value)
      this.handleClick()
    },
    ensureMin(value) {
      if (this.column?.minCount === 0 || this.column?.allowEmpty) return
      if (!value && value !== undefined) {
        this.$nextTick(() => {
          this.text = 1
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wf-rate {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.wf-rate__item {
  border: none;
  background: transparent;
  color: #c8c9cc;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.wf-rate__item--active {
  color: #ffd21e;
}

.wf-rate__text {
  margin-left: 8px;
}
</style>
