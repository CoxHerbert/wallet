<template>
        <van-empty
                class="wf-empty"
                :description="text"
                :image="src || imageUrl"
                :image-size="iconSize"
                :style="{ marginTop: marginStyle, fontSize: fontSizeStyle }"
        ></van-empty>
</template>

<script>
export default {
	name: 'wf-empty',
	props: {
		text: { type: String },
		mode: {
			type: String,
			default: () => {
				return 'list'
			}
		},
		src: { type: String },
		iconSize: {
			type: String,
			default: () => {
				return '263'
			}
		},
		marginTop: { type: String },
		fontSize: {
			type: String,
			default: () => {
				return '30'
			}
		}
	},
        data() {
                return { imageUrl: `${this.wfImage}/public/empty.png`, marginTOP: 0 }
        },
        computed: {
                marginStyle() {
                        const value = this.marginTop || this.marginTOP
                        if (value === undefined || value === null || value === '') return undefined
                        return isNaN(Number(value)) ? value : `${value}rpx`
                },
                fontSizeStyle() {
                        if (this.fontSize === undefined || this.fontSize === null || this.fontSize === '') return undefined
                        return isNaN(Number(this.fontSize)) ? this.fontSize : `${this.fontSize}rpx`
                }
        },
        created() {
                const info = uni.getSystemInfoSync?.() || {}
                const screenHeight = info.screenHeight
                if (!this.marginTop && screenHeight) {
                        this.marginTOP = screenHeight / 2.5
                }
        }
}
</script>

<style></style>
