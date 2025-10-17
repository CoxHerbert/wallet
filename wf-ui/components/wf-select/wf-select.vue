<template>
        <view class="wf-select">
                <van-field
                        v-model="textLabel"
                        is-link
                        readonly
                        :placeholder="getPlaceholder(column, column.type)"
                        @click="onClick"
                />
                <van-popup v-model:show="show" position="bottom" round>
                        <van-picker
                                show-toolbar
                                :title="column.label"
                                :columns="dic"
                                :columns-field-names="columnsFieldNames"
                                :default-index="defaultIndex"
                                @confirm="handleSubmit"
                                @cancel="show = false"
                        />
                </van-popup>
        </view>
</template>

<script>
import Props from '../../mixins/props.js'
export default {
	name: 'wf-select',
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
                        defaultValue: [],
                        show: false
                }
        },
        computed: {
                columnsFieldNames() {
                        return {
                                text: this.labelKey,
                                value: this.valueKey,
                                children: this.childrenKey
                        }
                },
                defaultIndex() {
                        if (this.validateNull?.(this.text)) return 0
                        const index = this.dic?.findIndex?.((item) => item?.[this.valueKey] == this.text)
                        return index > -1 ? index : 0
                }
        },
        methods: {
                onClick() {
                        if (!this.disabled) this.show = true
                        this.handleClick()
                },
                handleSubmit(payload) {
                        let options = []
                        if (Array.isArray(payload)) {
                                options = payload
                        } else if (Array.isArray(payload?.selectedOptions)) {
                                options = payload.selectedOptions
                        } else if (payload?.selectedValues) {
                                options = (payload.selectedValues || []).map((value, idx) => ({
                                        [this.valueKey]: value,
                                        [this.labelKey]: payload?.selectedOptions?.[idx]?.[this.labelKey]
                                }))
                        } else if (payload) {
                                options = [payload]
                        }
                        const text = []
                        const textLabel = []
                        options.forEach(d => {
                                text.push(d?.[this.valueKey])
                                textLabel.push(d?.[this.labelKey] || '')
                        })
                        this.text = text.join(',')
                        this.textLabel = textLabel.join(',')
                        this.$emit('label-change', this.textLabel)
                        this.show = false
                }
        }
}
</script>

<style lang="scss" scoped>
.wf-select {
	width: 100%;
}
</style>
