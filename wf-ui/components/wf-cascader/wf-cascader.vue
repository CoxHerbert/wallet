<template>
	<div class="wf-cascader">
                <van-field
                        v-model="textLabel"
                        is-link
                        readonly
                        :placeholder="getPlaceholder(column, column.type)"
                        @click="onClick"
                />
                <van-popup v-model:show="show" position="bottom" close-icon="cross" closeable>
                        <cascader :props="column.props" :itemList="dic" :title="column.label" @complete="onConfirm"></cascader>
                </van-popup>
	</div>
</template>

<script>
import Props from '../../mixins/props.js'

import Cascader from './components/cascader'
export default {
	name: 'wf-cascader',
	components: { Cascader },
	mixins: [Props],
	watch: {
		dic: {
			handler(val) {
					if (!this.validateNull(val)) this.initTextLabel()
			},
			deep: true
		}
	},
	data() {
		return {
			show: false,
			textLabel: '',
		}
	},
	methods: {
		onClick() {
			if (!this.disabled) this.show = true
			this.handleClick()
		},
		onConfirm(val) {
			const { result } = val
			const value = val[this.valueKey]
			if (this.column.type == 'cascader') this.text = result.map(r => r[this.valueKey])
			else this.text = value
			this.show = false
		}
	}
}
</script>

<style lang="scss" scoped>
.wf-cascader {
	width: 100%;

        ::v-deep .van-popup__close-icon--top-right {
                top: 20rpx;
        }
}
</style>
