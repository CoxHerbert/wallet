<template>
        <div class="wf-checkbox">
                <van-checkbox-group v-model="text" :disabled="disabled" @click="handleClick">
                        <van-checkbox
                                v-for="(item, index) in list"
                                :key="index"
                                :name="item[valueKey]"
                                :disabled="item.disabled"
                        >
                                {{ item[labelKey] }}
                        </van-checkbox>
                </van-checkbox-group>
        </div>
</template>

<script>
import Props from '../../mixins/props.js'
export default {
	name: 'wf-checkbox',
	mixins: [Props],
	watch: {
		dic: {
			handler(val) {
				if (!this.validateNull(val)) this.initValue()
			},
			deep: true
		}
	},
	data() {
		return { list: [] }
	},
	methods: {
                initValue() {
                        if (this.validateNull(this.dic)) return
                        let valueArr = []
                        if (Array.isArray(this.text)) valueArr = this.text
                        else if (!this.validateNull(this.text)) valueArr = (this.text + '').split(',')
                        if (valueArr.length) {
                                this.dic.forEach((v, i) => {
                                        if (valueArr.find(val => val == v[this.valueKey])) v.checked = true
                                        else v.checked = false
                                })
                        }
                        this.list = this.deepClone(this.dic)
                        if (!Array.isArray(this.text)) {
                                this.text = valueArr
                        }
                }
        }
}
</script>

<style lang="scss" scoped>
.wf-checkbox {
}
</style>
