<template>
        <view class="wf-radio">
                <van-radio-group v-model="text" :disabled="disabled" @click="handleClick">
                        <van-radio v-for="(item, index) in dic" :key="index" :name="item[valueKey]">
                                {{ item[labelKey] }}
                        </van-radio>
                </van-radio-group>
        </view>
</template>

<script>
import Props from '../../mixins/props.js'
export default {
	name: 'wf-radio',
	mixins: [Props]
}
</script>

<style lang="scss" scoped>
.wf-radio {
}
</style>
