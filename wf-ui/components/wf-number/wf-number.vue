<template>
	<view class="wf-number">
                <van-stepper
                        v-model="number"
                        :min="column.min || 0"
                        :max="column.max || 99999"
                        :step="column.step || 1"
                        :disabled="disabled"
                        @plus="handleClick"
                        @minus="handleClick"
                        @focus="handleFocus"
                        @blur="handleBlur"
                ></van-stepper>
	</view>
</template>

<script>
import Props from '../../mixins/props.js'
export default {
	name: 'wf-number',
	mixins: [Props],
	watch: {
		text: {
			handler(val) {
				this.number = Number(val)
			},
			immediate: true
        },
        number(val) {
                this.text = val
        }
        },
        data() {
                return { number: undefined }
        }
}
</script>

<style lang="scss" scoped>
.wf-number {
}
</style>
