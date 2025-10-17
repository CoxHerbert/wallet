<template>
  <label class="wf-switch">
    <input
      type="checkbox"
      class="wf-switch__input"
      :checked="checked"
      :disabled="disabled"
      @change="onToggle"
    />
    <span class="wf-switch__slider"></span>
  </label>
</template>

<script>
import Props from '../../mixins/props.js'
export default {
  name: 'wf-switch',
  mixins: [Props],
  data() {
    return { checked: false, activeValue: '1', inactiveValue: '0' }
  },
  watch: {
    text: {
      handler() {
        this.initValue()
        this.handleChange(this.text)
      }
    }
  },
  methods: {
    initValue() {
      const { dicData } = this.column || {}
      if (dicData && dicData.length == 2) {
        this.inactiveValue = dicData[0].value
        this.activeValue = dicData[1].value
      }
      this.checked = this.text == this.activeValue
    },
    onToggle(event) {
      const value = event.target.checked ? this.activeValue : this.inactiveValue
      this.checked = event.target.checked
      this.text = value
      this.handleClick()
    }
  }
}
</script>

<style lang="scss" scoped>
.wf-switch {
  position: relative;
  display: inline-flex;
  width: 40px;
  height: 20px;
  align-items: center;
}

.wf-switch__input {
  opacity: 0;
  width: 0;
  height: 0;
}

.wf-switch__slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #dcdfe6;
  border-radius: 999px;
  transition: background-color 0.2s ease;
}

.wf-switch__slider::before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 2px;
  top: 2px;
  background-color: #fff;
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.wf-switch__input:checked + .wf-switch__slider {
  background-color: #409eff;
}

.wf-switch__input:checked + .wf-switch__slider::before {
  transform: translateX(20px);
}
</style>
