<template>
  <div class="wf-input">
    <textarea
      v-if="column?.type === 'textarea'"
      class="wf-input__textarea"
      v-model="text"
      :placeholder="getPlaceholder(column, column.type)"
      :disabled="disabled"
      :maxlength="column.maxlength || 350"
      :style="textareaStyle"
      @click="handleClick"
      @focus="handleFocus"
      @blur="handleBlur"
    ></textarea>
    <input
      v-else
      class="wf-input__field"
      :type="inputType"
      v-model="text"
      :placeholder="getPlaceholder(column, column.type)"
      :disabled="disabled"
      :maxlength="column.maxlength || 350"
      :style="fieldStyle"
      @click="handleClick"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<script>
import Props from '../../mixins/props.js'
export default {
  name: 'wf-input',
  mixins: [Props],
  data() {
    return {
      typeDic: {
        input: 'text',
        number: 'number',
        textarea: 'textarea',
        password: 'password'
      }
    }
  },
  computed: {
    inputType() {
      return this.typeDic[this.column?.type] || 'text'
    },
    textareaStyle() {
      return {
        minHeight: this.column?.height || '70px'
      }
    },
    fieldStyle() {
      if (this.column?.type !== 'textarea') {
        return { height: this.column?.height || '40px' }
      }
      return {}
    }
  }
}
</script>

<style lang="scss" scoped>
.wf-input {
  width: 100%;
}

.wf-input__field,
.wf-input__textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}

.wf-input__textarea {
  resize: vertical;
}
</style>
