<template>
  <div class="wf-date">
    <template v-if="[1, 3, 5].includes(type)">
      <input
        class="wf-date__input"
        :type="inputType"
        v-model="singleValue"
        :placeholder="getPlaceholder(column)"
        :disabled="disabled"
        :step="step"
        @change="onSingleChange"
        @click="handleClick"
      />
    </template>
    <template v-else>
      <div class="wf-date__range">
        <input
          class="wf-date__input"
          :type="inputType"
          v-model="startValue"
          :placeholder="startPlaceholder"
          :disabled="disabled"
          :step="step"
          @change="onRangeChange"
          @click="handleClick"
        />
        <span class="wf-date__separator">至</span>
        <input
          class="wf-date__input"
          :type="inputType"
          v-model="endValue"
          :placeholder="endPlaceholder"
          :disabled="disabled"
          :step="step"
          @change="onRangeChange"
          @click="handleClick"
        />
      </div>
    </template>
  </div>
</template>

<script>
import Props from '../../mixins/props.js'
import timeFormat from '../../util/timeFormat.js'
export default {
  name: 'wf-date',
  mixins: [Props],
  watch: {
    text: {
      handler() {
        this.initValue()
      },
      immediate: true
    }
  },
  computed: {
    type() {
      switch (this.column.type) {
        case 'date':
          return 1
        case 'daterange':
          return 2
        case 'datetime':
          return 3
        case 'datetimerange':
          return 4
        case 'time':
          return 5
        case 'timerange':
          return 6
      }
      return 1
    },
    valueFormat() {
      switch (this.column.type) {
        case 'date':
        case 'daterange':
          return 'yyyy-MM-dd'
        case 'datetime':
        case 'datetimerange':
          return 'yyyy-MM-dd HH:mm:ss'
        case 'time':
        case 'timerange':
          return 'HH:mm:ss'
      }
      return 'yyyy-MM-dd'
    },
    inputType() {
      if ([1, 2].includes(this.type)) return 'date'
      if ([3, 4].includes(this.type)) return 'datetime-local'
      return 'time'
    },
    step() {
      return [5, 6].includes(this.type) || this.column.type?.includes('time') ? 1 : undefined
    },
    startPlaceholder() {
      return this.type === 6 ? this.column.startPlaceholder || '开始时间' : this.getPlaceholder(this.column)
    },
    endPlaceholder() {
      return this.type === 6 ? this.column.endPlaceholder || '结束时间' : '结束'
    }
  },
  data() {
    return {
      singleValue: '',
      startValue: '',
      endValue: ''
    }
  },
  methods: {
    initValue() {
      const initVal = this.text ? (this.text + '').split(',') : []
      if ([1, 3, 5].includes(this.type)) {
        this.singleValue = this.formatForInput(initVal[0] || this.text)
      } else {
        if (initVal[0]) this.startValue = this.formatForInput(initVal[0])
        if (initVal[1]) this.endValue = this.formatForInput(initVal[1])
      }
    },
    formatForInput(value) {
      if (!value) return ''
      if ([3, 4].includes(this.type)) {
        return value.replace(' ', 'T')
      }
      return value
    },
    formatOutput(value) {
      if (!value) return ''
      if ([3, 4].includes(this.type)) {
        return timeFormat(value.replace('T', ' '), this.valueFormat)
      }
      if ([5, 6].includes(this.type)) {
        return timeFormat(`2000-01-01 ${value}`, this.valueFormat)
      }
      return timeFormat(value, this.valueFormat)
    },
    onSingleChange() {
      const formatted = this.formatOutput(this.singleValue)
      this.text = formatted
    },
    onRangeChange() {
      const start = this.formatOutput(this.startValue)
      const end = this.formatOutput(this.endValue)
      const result = [start, end]
      this.text = this.stringMode ? result.join(',') : result
    }
  }
}
</script>

<style lang="scss" scoped>
.wf-date {
  width: 100%;
}

.wf-date__input {
  width: 100%;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}

.wf-date__range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wf-date__separator {
  white-space: nowrap;
}
</style>
