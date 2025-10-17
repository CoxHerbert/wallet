<template>
        <div class="wf-rate">
                <van-rate
                        v-model="text"
                        :count="column.max || 5"
                        :color="rateColors.active"
                        :void-color="rateColors.void"
                        :disabled-color="rateColors.disabled"
                        :disabled="disabled"
                        @change="ensureMin"
                ></van-rate>
		<span v-if="column.showText && column.texts && column.texts[text - 1]" class="wf-rate__text">
			{{ column.texts[text - 1] }}
		</span>
		<span v-else-if="column.showScore && !column.showText" class="wf-rate__text">{{ text }}</span>
        </div>
</template>

<script>
import Props from '../../mixins/props.js'
export default {
	name: 'wf-rate',
	mixins: [Props],
        data() {
                return { text: 0 }
        },
        computed: {
                rateColors() {
                        const colors = this.column?.colors || []
                        return {
                                active: colors[1] || colors[0] || '#ffd21e',
                                void: colors[0] || '#c8c9cc',
                                disabled: colors[2] || colors[1] || '#c8c9cc'
                        }
                }
        },
        methods: {
                ensureMin(value) {
                        if (this.column?.minCount === 0 || this.column?.allowEmpty) return
                        if (!value && value !== undefined) {
                                this.$nextTick(() => {
                                        this.text = 1
                                })
                        }
                }
        }
}
</script>

<style lang="scss" scoped>
.wf-rate {
	&__text {
		margin-left: 15rpx;
	}
}
</style>
