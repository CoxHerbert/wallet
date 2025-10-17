<template>
  <div class="wf-radio">
    <label
      v-for="(item, index) in dic"
      :key="index"
      class="wf-radio__label"
    >
      <input
        class="wf-radio__input"
        type="radio"
        :value="item[valueKey]"
        :name="column?.prop || 'wf-radio'"
        v-model="text"
        :disabled="disabled || item.disabled"
        @change="handleClick"
      />
      <span class="wf-radio__text">{{ item[labelKey] }}</span>
    </label>
  </div>
</template>

<script>
import Props from '../../mixins/props.js'
export default {
  name: 'wf-radio',
  mixins: [Props]
}
</script>

<style lang="scss" scoped>
.wf-radio {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.wf-radio__label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.wf-radio__input {
  width: 16px;
  height: 16px;
}
</style>
