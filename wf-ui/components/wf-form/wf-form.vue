<template>
    <div class="wf-form">
        <van-form class="wf-form-content" ref="form">
            <template v-if="option.column && option.column.length > 0">
                <template v-for="(item, index) in option.column">
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
                        :label-width="option.labeWidth"
                        :label-position="option.labelPosition"
                        :key="index"
                        :dynamic-index="option.dynamicIndex"
                        @label-change="handleLabelChange"
                    ></wf-form-item>
                </template>
            </template>
            <template v-if="option.group && option.group.length > 0">
                <van-collapse :accordion="false">
                    <template v-for="(group, gIndex) in option.group">
                        <van-collapse-item
                            v-if="group.display !== false"
                            :key="gIndex"
                            :disabled="group.arrow === false"
                            :open="group.collapse !== false"
                            :title="group.label"
                        >
                            <!-- #ifndef APP -->
                            <template #title>
                                <span>
                                    <van-icon
                                        v-if="group.icon"
                                        :name="group.icon.replace('el-icon-', '')"
                                        style="margin-right: 10rpx"
                                    ></van-icon>
                                    {{ group.label }}
                                </span>
                            </template>
                            <!-- #endif -->
                            <template v-for="(item, index) in group.column">
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
                                    :key="index"
                                    :label-width="option.labelWidth"
                                    :label-position="option.labelPosition"
                                    :dynamic-index="option.dynamicIndex"
                                    @label-change="handleLabelChange"
                                ></wf-form-item>
                            </template>
                        </van-collapse-item>
                    </template>
                </van-collapse>
            </template>
        </van-form>
        <div
            v-if="
                ((option.column && option.column.length > 0) || (option.group && option.group.length > 0)) &&
                menuBtn.show
            "
            class="wf-form-bottom"
        >
            <van-button
                :style="{ width: '320rpx' }"
                v-if="menuBtn.submitBtn"
                :loading="allDisabled"
                type="primary"
                size="large"
                @click="submit"
            >
                {{ menuBtn.submitText }}
            </van-button>
            <slot name="menu"></slot>
            <!-- <van-button v-if="menuBtn.enptyBtn" :loading="allDisabled" type="info" size="medium" @click="clear">{{ menuBtn.emptyText }}</van-button> -->
        </div>
    </div>
</template>

<script>
import Dic from '../../mixins/dic.js';
import { formInitVal } from '../../util/dataformat.js';
import { filter } from '../../util/unsupport.js';
export default {
    name: 'wf-form',
    mixins: [Dic],
    props: {
        option: {
            type: Object,
            required: true,
            default: () => {
                return { column: [], menuBtn: false };
            },
        },
        value: {},
    },
    watch: {
        form: {
            handler(val) {
                if (this.formCreate) {
                    this.$emit('input', val);
                }
            },
            deep: true,
        },
        value: {
            handler(val) {
                if (this.formCreate) {
                    this.setForm(val);
                } else {
                    this.formVal = Object.assign(this.formVal, val || {});
                }
            },
            deep: true,
            immediate: true,
        },
        option: {
            handler() {
                this.init(false);
            },
            deep: true,
        },
    },
    computed: {
        column() {
            let result = [];
            const column = this.option.column;
            const group = this.option.group;
            if (!this.validateNull(column)) result = column;
            if (!this.validateNull(group)) {
                group.forEach((g) => {
                    if (!this.validateNull(g.column)) result = result.concat(g.column);
                });
            }
            return result;
        },
        dynamicOption() {
            let list = [];
            this.column.forEach((ele) => {
                if (ele.type == 'dynamic' && ele.display !== false && filter(ele)) {
                    list.push(ele);
                }
            });
            return list;
        },
        menuBtn() {
            const { menuBtn, submitBtn, enptyBtn, submitText, emptyText, detail, readonly, disabled } = this.option;
            return {
                show: menuBtn === false || detail || readonly || disabled ? false : true,
                submitBtn: submitBtn === false ? false : true,
                enptyBtn: enptyBtn === false ? false : true,
                submitText: submitText || '提交',
                emptyText: emptyText || '清空',
            };
        },
    },
    data() {
        return {
            form: {},
            dic: {},
            formVal: {},
            formCreate: false,
            allDisabled: false,
        };
    },
    mounted() {
        setTimeout(() => {
            this.init();
        }, 200);
    },
    methods: {
        filter,
        // 初始化
        init(init = true) {
            this.initDic();
            if (init) {
                const defaultValue = formInitVal(this.column).tableForm;
                Object.keys(defaultValue).forEach((ele) => {
                    if (this.validateNull(this.formVal[ele])) {
                        this.formVal[ele] = defaultValue[ele];
                    }
                });
                this.setForm(this.formVal);
            }
            // #ifdef MP
            this.initFunc();
            // #endif
            this.formCreate = true;
        },
        // 初始化字典
        initDic() {
            this.column.forEach((col) => {
                this.handleDic(col).then((dic) => {
                    if (!this.validateNull(dic)) {
                        this.dic[col.prop] = dic;
                    }
                });
            });
        },
        // #ifdef MP
        initFunc() {
            const column = this.option.column;
            const group = this.option.group;
            if (!this.validateNull(column)) {
                column.forEach((col) => {
                    col.value = this.form[col.prop];
                });
            }
            if (!this.validateNull(group)) {
                group.forEach((g) => {
                    if (!this.validateNull(g.column)) {
                        g.column.forEach((col) => {
                            col.value = this.form[col.prop];
                        });
                    }
                });
            }
        },
        // #endif
        // 表单赋值
        setForm(value) {
            Object.keys(value).forEach((ele) => {
                this.form[ele] = value[ele];
            });
        },
        validateCellForm() {
            if (!this.$refs.form || !this.$refs.form.validate) {
                return Promise.resolve(true);
            }
            return this.$refs.form
                .validate()
                .then(() => true)
                .catch(() => false);
        },
        validate(callback) {
            if (!this.$refs.form || !this.$refs.form.validate) {
                callback(true, this.hide);
                return;
            }
            this.$refs.form
                .validate()
                .then(() => {
                    const dynamicList = [];
                    this.dynamicOption.forEach((ele) => {
                        if (!this.validateNull(this.$refs[ele.prop][0].$refs.temp.$refs.main)) {
                            this.$refs[ele.prop][0].$refs.temp.$refs.main.forEach((item) => {
                                dynamicList.push(item.validateCellForm());
                            });
                        }
                    });
                    Promise.all(dynamicList).then((res) => {
                        const hasError = res.some((error) => !error);
                        if (!hasError) {
                            this.show();
                            callback(true, this.hide);
                        } else {
                            callback(false, this.hide);
                        }
                    });
                })
                .catch(() => {
                    callback(false, this.hide);
                });
        },
        submit() {
            this.validate((valid) => {
                if (valid) {
                    this.$emit('submit', this.deepClone(this.form), this.hide);
                }
            });
        },
        resetFields() {
            if (this.$refs.form && this.$refs.form.resetValidation) {
                this.$refs.form.resetValidation();
            }
            const defaultValue = formInitVal(this.column).tableForm;
            Object.keys(defaultValue).forEach((key) => {
                this.form[key] = defaultValue[key];
            });
        },
        show() {
            this.allDisabled = true;
        },
        hide() {
            this.allDisabled = false;
        },
        handleLabelChange({ prop, value, change }) {
            this.form[`${prop}`] = value;
            if (change) {
                change.call(this, { value });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.wf-form {
    padding: 0 30rpx;
    background: #fff;

    ::v-deep .van-icon {
        margin-right: 0;
    }

    &-bottom {
        width: 100%;
        padding: 10rpx 30rpx calc(env(safe-area-inset-bottom) + 10rpx) 30rpx;
        position: fixed;
        background-color: white;
        z-index: 3;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: space-around;

        ::v-deep .van-button {
            width: 100%;
            padding: 0;
            margin: 0 10rpx;
        }
    }
}
</style>
