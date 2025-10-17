<template>
	<div class="wf-slider">
                <van-slider
                        v-model="sliderValue"
                        :max="column.max || 100"
                        :min="column.min || 0"
                        :step="column.step || 1"
                        :disabled="disabled"
                        :range="!!column.range"
                        @change="onChange"
                ></van-slider>
		<span class="wf-slider__text">{{ showText }}</span>
	</div>
</template>

<script>
import Props from '../../mixins/props.js'

export default {
        name: 'wf-slider',
        mixins: [Props],
        watch: {
                text: {
                        handler(val) {
				this.initValue()
				this.handleChange(val)
			}
		}
	},
	computed: {
		showText() {
			if (typeof this.text == 'object') return this.text.join(',')
			else return this.text
		}
	},
        data() {
                return { text: 0, sliderValue: 0 }
        },
        methods: {
                initValue() {
                        if (this.column.range) {
                                const value = Array.isArray(this.text) ? this.text : (this.text + '').split(',')
                                const start = Number(value[0]) || 0
                                const end = Number(value[1] ?? start) || 0
                                this.sliderValue = [start, end]
                        } else {
                                const single = Array.isArray(this.text) ? this.text[0] : this.text
                                this.sliderValue = Number(single) || 0
                        }
                },
                onChange(value) {
                        if (this.column.range) {
                                const result = Array.isArray(value) ? value : this.sliderValue
                                this.text = result
                        } else {
                                const result = typeof value === 'number' ? value : this.sliderValue
                                this.text = result
                        }
                }
        }
}
</script>

<style lang="scss" scoped>
.wf-slider {
	display: flex;
	align-items: center;
	&__text {
		margin-left: 20rpx;
	}
}
</style>
