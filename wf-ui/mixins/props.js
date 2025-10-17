// src/components/YourComponent.vue (script part or .js component)
import { DIC_PROPS, DIC_HTTP_PROPS, DIC_LIST } from '../util/variable.js';
import { getPlaceholder } from '../util/dataformat.js';
import Event from './event.js';

export default {
  name: 'YourComponent',
  mixins: [Event],

  // Vue 3 需显式声明 emits
  emits: [
    'label-change',
    // 下列事件若在 mixin/内部有触发可一并声明
    'update:value',
    'change',
    'blur',
    'focus',
    'click',
  ],

  props: {
    value: {
      // 若配合 v-model:value 使用，请在父组件用 v-model:value
      type: [String, Number, Array, Object, Boolean, null],
      default: undefined,
    },
    column: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    dic: {
      type: Array,
      default: () => [],
    },
    dynamicIndex: {
      type: [Number, String, Object],
      default: undefined,
    },
  },

  data() {
    return {
      text: undefined,
      stringMode: false,
      textLabel: '',
      // 若 column.* 可能未定义，使用可选链避免首次渲染报错
      blur: this.column?.blur,
      focus: this.column?.focus,
      change: this.column?.change,
      click: this.column?.click,
    };
  },

  computed: {
    isArray() {
      return this.column?.dataType === 'array';
    },
    isString() {
      return this.column?.dataType === 'string';
    },
    isNumber() {
      return this.column?.dataType === 'number';
    },
    valueKey() {
      return { ...DIC_PROPS, ...(this.column?.props || {}) }.value;
    },
    labelKey() {
      return { ...DIC_PROPS, ...(this.column?.props || {}) }.label;
    },
    childrenKey() {
      return { ...DIC_PROPS, ...(this.column?.props || {}) }.children;
    },
    descKey() {
      return { ...DIC_PROPS, ...(this.column?.props || {}) }.desc;
    },
  },

  watch: {
    text: {
      handler(val) {
        if (this.initValue && typeof this.initValue === 'function') {
          this.initValue();
        }
        if (DIC_LIST.includes(this.column?.type)) {
          this.initTextLabel();
        }
        // 这里的 handleChange 来自 mixin: Event
        this.handleChange?.(val);
      },
    },
    value: {
      handler() {
        // 来自 mixin: Event（原逻辑）
        this.initVal?.();
      },
      immediate: true,
    },
  },

  methods: {
    getPlaceholder,

    initTextLabel() {
      if (!this.validateNull?.(this.text) && !this.validateNull?.(this.dic)) {
        const textLabel = [];
        let arr = this.deepClone?.(this.dic) ?? [];
        const val = String(this.text ?? '').split(',');

        val.forEach((t) => {
          const { list, label } = this.handleTextLabel(arr, t);
          if (!this.validateNull?.(list)) arr = list;
          if (label) textLabel.push(label);
        });

        // Vue 3 直接赋值即可，无需 this.$set
        this.textLabel = textLabel.join('/');

        this.$emit('label-change', this.stringMode ? this.textLabel : textLabel);
      } else {
        this.textLabel = '';
        this.$emit('label-change', '');
      }
    },

    handleTextLabel(list, value) {
      let result = {};
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (item?.[this.valueKey] == value) {
          result.label = item?.[this.labelKey];
          result.list = item?.[this.childrenKey];
          break;
        }
        const children = item?.[this.childrenKey];
        if (!this.validateNull?.(children)) {
          result = this.handleTextLabel(children, value);
          if (result.label) return result;
        }
      }
      if (Object.keys(result).length === 0) result = { list, label: value };
      return result;
    },
  },
};
