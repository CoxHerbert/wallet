<template>
	<div class="wf-dynamic">
                <van-card class="wf-dynamic-card" v-if="text && text.length == 0">
                        <template #title>
                                <div class="head">
                                        <div class="title">#1</div>
                                        <div class="add-btn" @click="handleAddRow" v-if="option.addBtn && !disabled">
                                                <van-icon name="plus" />
                                                <span>添加</span>
                                        </div>
                                </div>
                        </template>
                </van-card>
                <template v-for="(item, index) in text" :key="index" v-else>
                        <van-card class="wf-dynamic-card" :key="index">
                                <template #title>
                                        <div class="head">
                                                <div class="title">#{{ index + 1 }}</div>
                                                <div class="add-btn" @click="handleAddRow" v-if="option.addBtn && !disabled">
                                                        <van-icon name="plus" />
                                                        <span>添加</span>
                                                </div>
                                        </div>
                                </template>
                                <template #desc>
                                        <wkf-form
                                                ref="main"
                                                v-model="text[index]"
                                                :option="{ labelPosition: 'top', disabled: disabled, dynamicIndex: index, ...option }"
                                                @label-change="handleLabelChange"
                                        ></wkf-form>
                                </template>
                                <template #footer>
                                        <div class="head" v-if="!disabled">
                                                <van-button
                                                        v-if="option.addBtn"
                                                        plain
                                                        type="primary"
                                                        size="small"
                                                        :style="{ width: '45%' }"
                                                        @click="handleAddRow"
                                                >
                                                        添 加
                                                </van-button>
                                                <van-button
                                                        v-if="option.delBtn"
                                                        plain
                                                        type="danger"
                                                        size="small"
                                                        :style="{ width: '45%' }"
                                                        @click="handleDelRow(index)"
                                                >
                                                        删 除
                                                </van-button>
                                        </div>
                                </template>
                        </van-card>
                </template>
        </div>
</template>

<script>
import Props from '../../mixins/props.js'
// #ifdef APP
import WkfForm from '../wkf-form/wkf-form.vue'
// #endif
export default {
	name: 'wf-dynamic',
	// #ifdef H5
	components: { WkfForm: () => import('../wf-form/wf-form.vue') },
	// #endif
	// #ifdef APP
	components: { WkfForm },
	// #endif
	mixins: [Props],
	computed: {
		option() {
			return this.column.children
		}
	},
	methods: {
		handleAddRow() {
			this.text.push({})
		},
                handleDelRow(index) {
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
	width: 690rpx;
	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.add-btn {
		color: #4b9eff;
	}
}
</style>
