<template>
  <div class="wf-checkbox">
    <div
      class="wf-checkbox__option"
      v-for="(item, index) in list"
      :key="index"
    >
      <label class="wf-checkbox__label">
        <input
          class="wf-checkbox__input"
          type="checkbox"
          :value="item[valueKey]"
          v-model="text"
          :disabled="disabled || item.disabled"
          @change="handleClick"
        />
        <span class="wf-checkbox__text">{{ item[labelKey] }}</span>
      </label>
    </div>
  </div>
</template>

<script>
import Props from '../../mixins/props.js'

export default {
  name: 'wf-checkbox',
  mixins: [Props],
  watch: {
    dic: {
      handler(val) {
        if (!this.validateNull(val)) this.initValue()
      },
      deep: true
    }
  },
  data() {
    return { list: [] }
  },
  methods: {
    initValue() {
      if (this.validateNull(this.dic)) return
      let valueArr = []
      if (Array.isArray(this.text)) valueArr = this.text
      else if (!this.validateNull(this.text)) valueArr = (this.text + '').split(',')
      if (valueArr.length) {
        this.dic.forEach((v) => {
          if (valueArr.find((val) => val == v[this.valueKey])) v.checked = true
          else v.checked = false
        })
      }
      this.list = this.deepClone(this.dic)
      if (!Array.isArray(this.text)) {
        this.text = valueArr
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wf-checkbox {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.wf-checkbox__label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.wf-checkbox__input {
  width: 16px;
  height: 16px;
}
</style>
