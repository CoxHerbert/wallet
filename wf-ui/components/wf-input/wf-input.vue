<template>
        <div class="wf-input">
                <van-field
                        v-model="text"
                        :type="typeDic[column.type]"
                        :maxlength="column.maxlength || 350"
                        :placeholder="getPlaceholder(column, column.type)"
                        :disabled="disabled"
                        :border="column.border || false"
                        :autosize="autosize"
                        :style="fieldStyle"
                        @click="handleClick"
                        @focus="handleFocus"
                        @blur="handleBlur"
                />
        </div>
</template>

<script>
import Props from '../../mixins/props.js'
export default {
	name: 'wf-input',
	mixins: [Props],
        data() {
                return {
                        typeDic: {
                                input: 'text',
                                number: 'digit',
                                textarea: 'textarea',
                                password: 'password'
                        }
                }
        },
        computed: {
                autosize() {
                        if (this.column?.type === 'textarea') {
                                return {
                                        minHeight: this.column?.height || '70px'
                                }
                        }
                        return undefined
                },
                fieldStyle() {
                        if (this.column?.type !== 'textarea') {
                                return { height: this.column?.height || '70rpx' }
                        }
                        return {}
                }
        }
}
</script>

<style lang="scss" scoped>
.wf-input {
	width: 100%;
}
</style>
