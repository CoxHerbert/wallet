<template>
  <div class="wf-form-item">
    <label v-if="column.label" class="wf-form-item__label" :style="labelStyle">
      {{ column.label }}<span v-if="isRequired" class="wf-form-item__required">*</span>
    </label>
    <div class="wf-form-item__content">
      <wf-input
        v-if="[undefined, 'input', 'password', 'textarea', 'number'].includes(column.type) && !column.component"
        v-model="text"
        :column="column"
        :disabled="disabled"
        @change="handleLabelChange"
        :dynamic-index="dynamicIndex"
      />
      <wf-select
        v-else-if="['select'].includes(column.type)"
        v-model="text"
        :column="column"
        :dic="dic"
        :disabled="disabled"
        @label-change="handleLabelChange"
        :dynamic-index="dynamicIndex"
      />
      <wf-cascader
        v-else-if="['cascader', 'tree'].includes(column.type)"
        v-model="text"
        :column="column"
        :dic="dic"
        :disabled="disabled"
        @label-change="handleLabelChange"
        :dynamic-index="dynamicIndex"
      />
      <wf-radio
        v-else-if="'radio' == column.type"
        v-model="text"
        :column="column"
        :dic="dic"
        :disabled="disabled"
        @label-change="handleLabelChange"
        :dynamic-index="dynamicIndex"
      />
      <wf-checkbox
        v-else-if="'checkbox' == column.type"
        v-model="text"
        :column="column"
        :dic="dic"
        :disabled="disabled"
        @label-change="handleLabelChange"
        :dynamic-index="dynamicIndex"
      />
      <wf-rate
        v-else-if="'rate' == column.type"
        v-model="text"
        :column="column"
        :disabled="disabled"
        :dynamic-index="dynamicIndex"
      />
      <wf-slider
        v-else-if="'slider' == column.type"
        v-model="text"
        :column="column"
        :disabled="disabled"
        :dynamic-index="dynamicIndex"
      />
      <wf-switch
        v-else-if="'switch' == column.type"
        v-model="text"
        :column="column"
        :disabled="disabled"
        :dynamic-index="dynamicIndex"
      />
      <wf-date
        v-else-if="DATE_LIST.includes(column.type)"
        v-model="text"
        :column="column"
        :disabled="disabled"
        :dynamic-index="dynamicIndex"
      />
      <wf-upload
        v-else-if="'upload' == column.type"
        v-model="text"
        :column="column"
        :disabled="disabled"
        :dynamic-index="dynamicIndex"
      />
      <wf-dynamic
        v-else-if="'dynamic' == column.type"
        v-model="text"
        ref="temp"
        :column="column"
        :disabled="disabled"
        :dynamic-index="dynamicIndex"
      />
      <wf-map
        v-else-if="'map' == column.type"
        v-model="text"
        ref="temp"
        :column="column"
        :disabled="disabled"
        :dynamic-index="dynamicIndex"
      />
      <wf-table-select
        v-else-if="'table-select' == column.type"
        v-model="text"
        ref="temp"
        :column="column"
        :disabled="disabled"
        @label-change="handleLabelChange"
        :dynamic-index="dynamicIndex"
      />
      <wf-sign
        v-else-if="'sign' == column.type"
        v-model="text"
        ref="temp"
        :column="column"
        :disabled="disabled"
        :dynamic-index="dynamicIndex"
      />
      <WkfUserSelect
        v-else-if="'wf-user-select' == column.component"
        v-model="text"
        :column="Object.assign(column, column.params || {})"
        :check-type="column.params ? column.params.checkType : 'radio'"
        :dic="dic"
        :disabled="disabled"
        :dynamic-index="dynamicIndex"
        @label-change="handleLabelChange"
      />
      <Customtable
        v-else-if="
          ['wf-vo-select', 'wf-prdmo-select', 'wf-plan-select', 'wf-withdrawn-select'].includes(
            column.component
          )
        "
        v-model="text"
        :column="column"
        :check-type="column.params ? column.params.checkType : 'radio'"
        :disabled="disabled"
        @label-change="handleLabelChange"
        :dynamic-index="dynamicIndex"
      />
      <MaterialTable
        v-else-if="['wf-wl-select'].includes(column.component)"
        v-model="text"
        :column="column"
        @label-change="handleLabelChange"
        :check-type="column.params ? column.params.checkType : 'radio'"
        :disabled="disabled"
        :dynamic-index="dynamicIndex"
      />
      <Vaguecustomtableselect
        v-else-if="['wf-fuzzymaterial-select'].includes(column.component)"
        v-model="text"
        :column="column"
        :check-type="column.params ? column.params.checkType : 'radio'"
        :disabled="disabled"
        @label-change="handleLabelChange"
        :dynamic-index="dynamicIndex"
      />
      <template v-else-if="column.component === 'wf-radio-select'">
        <WfUserSelect v-if="isUser(column)" v-model="text" :readonly="column.readonly" :disabled="column.disabled" />
      </template>
      <WfFeasibility v-if="column.component === 'wf-feasibility'" v-model="text"> </WfFeasibility>
    </div>
  </div>
</template>

<script>
import WkfUserSelect from '@/pages/plugin/workflow/components/custom-fileds/wf-user-select/index.vue'
import WfFeasibility from '@/pages/plugin/workflow/components/wf-feasibility/wf-feasibility.vue'
import WfUserSelect from '@/pages/plugin/workflow/components/custom-fileds/wf-user-select/index.vue'
import Customtable from '@/pages/plugin/workflow/components/custom-fileds/wf-customtable-select/index.vue'
import MaterialTable from '@/pages/plugin/workflow/components/custom-fileds/wf-material-select/index.vue'
import Vaguecustomtableselect from '@/pages/plugin/workflow/components/custom-fileds/wf-fuzzymaterial-select/index.vue'

import { DATE_LIST } from '../../util/variable.js'
import { mpFormInitVal } from '../../util/dataformat.js'
export default {
  name: 'wf-form-item',
  components: {
    WfFeasibility,
    WkfUserSelect,
    WfUserSelect,
    Customtable,
    MaterialTable,
    Vaguecustomtableselect
  },
  props: {
    column: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: [Object, Array, String, Number]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    dic: {
      type: Array,
      default: () => []
    },
    labelPosition: String,
    labelWidth: Number,
    dynamicIndex: undefined
  },
  watch: {
    text: {
      handler(val) {
        if (this.init || !this.validateNull(val)) {
          this.init = true
          this.$emit('input', val)
          this.$emit('change', val)
        } else {
          this.init = true
        }
      }
    },
    value: {
      handler(val) {
        this.text = val || mpFormInitVal(this.column)
      },
      immediate: true
    }
  },
  computed: {
    params() {
      return this.column.params || {}
    },
    event() {
      return this.column.event || {}
    },
    labelStyle() {
      const width = this.column.labelWidth || this.labelWidth
      if (!width) return {}
      return { width: typeof width === 'number' ? `${width}px` : width }
    },
    isRequired() {
      return Array.isArray(this.column.rules) && this.column.rules.some((rule) => rule.required)
    }
  },
  data() {
    return { text: undefined, init: false, DATE_LIST }
  },
  methods: {
    isUser(column) {
      return column?.children?.props?.url === '/blade-system/search/user'
    },
    handleLabelChange(val) {
      this.text = val
      this.$emit('label-change', {
        prop: this.column.prop,
        value: val,
        index: this.dynamicIndex,
        change: this.column.change
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wf-form-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.wf-form-item__label {
  font-weight: 500;
}

.wf-form-item__required {
  color: #f56c6c;
  margin-left: 4px;
}

.wf-form-item__content {
  width: 100%;
}
</style>
