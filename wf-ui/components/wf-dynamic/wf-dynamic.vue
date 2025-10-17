<template>
  <div class="wf-dynamic">
    <template v-if="!text || text.length === 0">
      <div class="wf-dynamic__card">
        <div class="wf-dynamic__head">
          <div class="wf-dynamic__title">#1</div>
          <button type="button" class="wf-dynamic__action" @click="handleAddRow" v-if="option.addBtn && !disabled">
            添加
          </button>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="wf-dynamic__card" v-for="(item, index) in text" :key="index">
      <div class="wf-dynamic__head">
        <div class="wf-dynamic__title">#{{ index + 1 }}</div>
        <button type="button" class="wf-dynamic__action" @click="handleAddRow" v-if="option.addBtn && !disabled">
          添加
        </button>
      </div>
      <div class="wf-dynamic__body">
        <wf-form
          ref="main"
          v-model="text[index]"
          :option="{ labelPosition: 'top', disabled: disabled, dynamicIndex: index, ...option }"
          @label-change="handleLabelChange"
        />
      </div>
      <div class="wf-dynamic__foot" v-if="!disabled">
        <button
          v-if="option.addBtn"
          type="button"
          class="wf-dynamic__secondary"
          @click="handleAddRow"
        >
          添 加
        </button>
        <button
          v-if="option.delBtn"
          type="button"
          class="wf-dynamic__danger"
          @click="handleDelRow(index)"
        >
          删 除
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import Props from '../../mixins/props.js'
import WfForm from '../wf-form/wf-form.vue'
export default {
  name: 'wf-dynamic',
  components: { WfForm },
  mixins: [Props],
  computed: {
    option() {
      return this.column.children || {}
    }
  },
  methods: {
    handleAddRow() {
      if (!Array.isArray(this.text)) this.text = []
      this.text.push({})
    },
    handleDelRow(index) {
      if (!Array.isArray(this.text)) return
      this.text.splice(index, 1)
    },
    handleLabelChange({ prop, value, index }) {
      if (!this.text[index]) return
      this.text[index] = {
        ...this.text[index],
        [`$${prop}`]: value
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wf-dynamic {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.wf-dynamic__card {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 12px;
}

.wf-dynamic__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.wf-dynamic__title {
  font-weight: 600;
}

.wf-dynamic__action,
.wf-dynamic__secondary,
.wf-dynamic__danger {
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.wf-dynamic__action,
.wf-dynamic__secondary {
  background-color: #409eff;
  color: #fff;
}

.wf-dynamic__danger {
  background-color: #f56c6c;
  color: #fff;
  margin-left: 8px;
}

.wf-dynamic__body {
  margin-bottom: 12px;
}

.wf-dynamic__foot {
  display: flex;
  gap: 8px;
}
</style>
