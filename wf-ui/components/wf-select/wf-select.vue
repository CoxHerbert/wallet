<template>
  <div class="wf-select">
    <select
      class="wf-select__control"
      v-model="selectedValue"
      :multiple="isMultiple"
      :disabled="disabled"
      @change="onChange"
      @click="handleClick"
    >
      <option v-if="!isMultiple" disabled value="">
        {{ getPlaceholder(column, column.type) }}
      </option>
      <option
        v-for="(option, index) in flatOptions"
        :key="index"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script>
import Props from '../../mixins/props.js'
export default {
  name: 'wf-select',
  mixins: [Props],
  data() {
    return { selectedValue: '' }
  },
  computed: {
    isMultiple() {
      return !!this.column?.multiple
    },
    flatOptions() {
      const options = []
      const traverse = (list = [], parents = []) => {
        list.forEach((item) => {
          const labelParts = [...parents, item?.[this.labelKey] || '']
          const label = labelParts.filter(Boolean).join(' / ')
          options.push({
            value: item?.[this.valueKey],
            label,
            disabled: item?.disabled
          })
          const children = item?.[this.childrenKey]
          if (Array.isArray(children) && children.length) {
            traverse(children, labelParts)
          }
        })
      }
      traverse(this.dic)
      return options
    }
  },
  watch: {
    text: {
      handler(val) {
        if (this.isMultiple) {
          if (Array.isArray(val)) this.selectedValue = val
          else if (typeof val === 'string' && val) this.selectedValue = val.split(',')
          else this.selectedValue = []
        } else {
          if (Array.isArray(val)) this.selectedValue = val[0] ?? ''
          else this.selectedValue = val ?? ''
        }
      },
      immediate: true
    },
    dic: {
      handler(val) {
        if (!this.validateNull(val)) this.initTextLabel?.()
      },
      deep: true
    }
  },
  methods: {
    onChange() {
      if (this.isMultiple) {
        const values = Array.isArray(this.selectedValue) ? this.selectedValue : []
        this.text = this.stringMode ? values.join(',') : values
      } else {
        const value = this.selectedValue ?? ''
        this.text = value
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wf-select {
  width: 100%;
}

.wf-select__control {
  width: 100%;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
}
</style>
