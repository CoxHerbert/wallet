<template>
  <div class="wf-form">
    <form class="wf-form-content" ref="form" @submit.prevent>
      <template v-if="option.column && option.column.length > 0">
        <template v-for="(item, index) in option.column" :key="`column-${index}`">
          <wf-form-item
            v-if="item.display !== false && filter(item)"
            v-model="form[item.prop]"
            :ref="item.prop"
            :column="item"
            :disabled="
              allDisabled ||
              option.disabled ||
              option.readonly ||
              option.detail ||
              item.disabled ||
              item.readonly ||
              item.detail
            "
            :dic="dic[item.prop]"
            :label-width="option.labelWidth"
            :label-position="option.labelPosition"
            :key="index"
            :dynamic-index="option.dynamicIndex"
            @label-change="handleLabelChange"
          />
        </template>
      </template>
      <template v-if="option.group && option.group.length > 0">
        <div
          v-for="(group, gIndex) in option.group"
          :key="`group-${gIndex}`"
          v-if="group.display !== false"
          class="wf-form-group"
        >
          <div class="wf-form-group__title">
            <span v-if="group.icon" class="wf-form-group__icon">{{ group.icon }}</span>
            {{ group.label }}
          </div>
          <div class="wf-form-group__content">
            <wf-form-item
              v-for="(item, index) in group.column"
              :key="`group-${gIndex}-${index}`"
              v-if="item.display !== false && filter(item)"
              v-model="form[item.prop]"
              :ref="item.prop"
              :column="item"
              :disabled="
                allDisabled ||
                option.disabled ||
                option.readonly ||
                option.detail ||
                item.disabled ||
                item.readonly ||
                item.detail
              "
              :dic="dic[item.prop]"
              :label-width="option.labelWidth"
              :label-position="option.labelPosition"
              :dynamic-index="option.dynamicIndex"
              @label-change="handleLabelChange"
            />
          </div>
        </div>
      </template>
    </form>
    <div
      v-if="
        ((option.column && option.column.length > 0) || (option.group && option.group.length > 0)) &&
        menuBtn.show
      "
      class="wf-form-bottom"
    >
      <button
        v-if="menuBtn.submitBtn"
        type="button"
        class="wf-form-bottom__btn wf-form-bottom__btn--primary"
        :disabled="allDisabled"
        @click="submit"
      >
        {{ menuBtn.submitText }}
      </button>
      <slot name="menu"></slot>
    </div>
  </div>
</template>

<script>
import Dic from '../../mixins/dic.js'
import { formInitVal, initRules } from '../../util/dataformat.js'
import { filter } from '../../util/unsupport.js'
export default {
  name: 'wf-form',
  mixins: [Dic],
  props: {
    option: {
      type: Object,
      required: true,
      default: () => ({ column: [], menuBtn: false })
    },
    value: {}
  },
  watch: {
    form: {
      handler(val) {
        if (this.formCreate) {
          this.$emit('input', val)
        }
      },
      deep: true
    },
    value: {
      handler(val) {
        if (this.formCreate) {
          this.setForm(val)
        } else {
          this.formVal = Object.assign(this.formVal, val || {})
        }
      },
      deep: true,
      immediate: true
    },
    option: {
      handler() {
        this.init(false)
      },
      deep: true
    }
  },
  computed: {
    column() {
      let result = []
      const column = this.option.column
      const group = this.option.group
      if (!this.validateNull(column)) result = column
      if (!this.validateNull(group)) {
        group.forEach((g) => {
          if (!this.validateNull(g.column)) result = result.concat(g.column)
        })
      }
      return result
    },
    dynamicOption() {
      const list = []
      this.column.forEach((ele) => {
        if (ele.type == 'dynamic' && ele.display !== false && filter(ele)) {
          list.push(ele)
        }
      })
      return list
    },
    menuBtn() {
      const { menuBtn, submitBtn, enptyBtn, submitText, emptyText, detail, readonly, disabled } = this.option
      return {
        show: menuBtn === false || detail || readonly || disabled ? false : true,
        submitBtn: submitBtn === false ? false : true,
        enptyBtn: enptyBtn === false ? false : true,
        submitText: submitText || '提交',
        emptyText: emptyText || '清空'
      }
    }
  },
  data() {
    return {
      form: {},
      rules: {},
      dic: {},
      formVal: {},
      formCreate: false,
      allDisabled: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.init()
    }, 200)
  },
  methods: {
    filter,
    init(init = true) {
      this.initDic()
      if (init) {
        const defaultValue = formInitVal(this.column).tableForm
        Object.keys(defaultValue).forEach((ele) => {
          if (this.validateNull(this.formVal[ele])) {
            this.formVal[ele] = defaultValue[ele]
          }
        })
        this.setForm(this.formVal)
      }
      this.rules = initRules(this.column)
      this.formCreate = true
    },
    initDic() {
      this.column.forEach((col) => {
        this.handleDic(col).then((dic) => {
          if (!this.validateNull(dic)) {
            this.$set ? this.$set(this.dic, col.prop, dic) : (this.dic[col.prop] = dic)
          }
        })
      })
    },
    setForm(value) {
      Object.keys(value || {}).forEach((ele) => {
        this.$set ? this.$set(this.form, ele, value[ele]) : (this.form[ele] = value[ele])
      })
    },
    validateCellForm() {
      return new Promise((resolve) => {
        this.validate((valid) => resolve(valid))
      })
    },
    validate(callback) {
      const errors = []
      Object.keys(this.rules || {}).forEach((prop) => {
        const value = this.form[prop]
        const fieldRules = this.rules[prop]
        fieldRules.forEach((rule) => {
          if (rule.required) {
            const empty = this.validateNull(value) || (Array.isArray(value) && value.length === 0)
            if (empty) errors.push({ prop, rule })
          }
          if (rule.validator && typeof rule.validator === 'function') {
            const result = rule.validator({}, value)
            if (result === false) errors.push({ prop, rule })
          }
        })
      })
      const valid = errors.length === 0
      if (!valid) {
        console.warn('Form validation failed', errors)
      }
      callback?.(valid, this.hide)
      return valid
    },
    submit() {
      this.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.deepClone(this.form), this.hide)
        }
      })
    },
    resetFields() {
      this.form = {}
      this.init()
    },
    show() {
      this.allDisabled = true
    },
    hide() {
      this.allDisabled = false
    },
    handleLabelChange({ prop, value, change }) {
      this.$set ? this.$set(this.form, `${prop}`, value) : (this.form[`${prop}`] = value)
      if (change) {
        change.call(this, { value })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wf-form {
  padding: 0 16px;
  background: #fff;
}

.wf-form-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wf-form-group {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 12px;
}

.wf-form-group__title {
  font-weight: 600;
  margin-bottom: 8px;
}

.wf-form-bottom {
  width: 100%;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.wf-form-bottom__btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.wf-form-bottom__btn--primary {
  background-color: #409eff;
  color: #fff;
}
</style>
