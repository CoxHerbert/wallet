<template>
  <div class="wf-cascader">
    <select
      class="wf-cascader__control"
      :multiple="isMultiple"
      v-model="selectedValue"
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
  name: 'wf-cascader',
  mixins: [Props],
  data() {
    return { show: false, textLabel: '', selectedValue: '' }
  },
  computed: {
    isMultiple() {
      return this.column?.type === 'cascader'
    },
    flatOptions() {
      const list = []
      const travel = (items = [], parents = []) => {
        items.forEach((item) => {
          const labelParts = [...parents, item?.[this.labelKey] || '']
          const label = labelParts.filter(Boolean).join(' / ')
          list.push({
            value: item?.[this.valueKey],
            label,
            disabled: item?.disabled
          })
          const children = item?.[this.childrenKey]
          if (Array.isArray(children) && children.length) {
            travel(children, labelParts)
          }
        })
      }
      travel(this.dic)
      return list
    }
  },
  watch: {
    dic: {
      handler(val) {
        if (!this.validateNull(val)) this.initTextLabel()
      },
      deep: true
    },
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
    }
  },
  methods: {
    onChange() {
      if (this.isMultiple) {
        const values = Array.isArray(this.selectedValue) ? this.selectedValue : []
        this.text = this.stringMode ? values.join(',') : values
      } else {
        this.text = this.selectedValue
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wf-cascader {
  width: 100%;
}

.wf-cascader__control {
  width: 100%;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
}
</style>
