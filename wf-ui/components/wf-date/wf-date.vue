<template>
	<div class="wf-date">
		<template v-if="[1, 2, 3, 4].includes(type)">
			<div class="wf-date__field" @click="handleShowSelect">
                                <van-field
                                        v-model="date"
                                        :label-width="0"
                                        :border="false"
                                        :placeholder="getPlaceholder(column)"
                                        readonly
                                >
                                        <template #left-icon>
                                                <van-icon name="calendar-o" color="rgb(192, 196, 204)" size="26"></van-icon>
                                        </template>
                                </van-field>
			</div>
			<calendar
				ref="calendar"
				:type="type"
				:init-start-date="initStartDate"
				:init-end-date="initEndDate"
				lunar
				is-fixed
				:max-year="2099"
				max-date="2099-12-31"
				@change="onChange"
				@clear="onClear"
			></calendar>
		</template>

		<template v-if="[5, 6].includes(type)">
			<div class="wf-date-time">
				<div class="wf-date-time__start" @click="handleShowSelect('initStartDate')">
                                        <van-field
                                                v-model="initStartDate"
                                                :style="{ padding: '0' }"
                                                :label-width="0"
                                                :border="false"
                                                :placeholder="type == 5 ? getPlaceholder(column) : column.startPlaceholder || '开始时间'"
                                                :input-align="type == 5 ? 'left' : 'center'"
                                                readonly
                                        >
                                                <template #left-icon>
                                                        <van-icon name="clock-o" color="rgb(192, 196, 204)" size="26"></van-icon>
                                                </template>
                                        </van-field>
				</div>
				
				<template v-if="type == 6">
					至
					<div class="wf-date-time__end" @click="handleShowSelect('initStartDate')">
                                                <van-field
                                                        v-model="initEndDate"
                                                        :style="{ padding: '0' }"
                                                        :label-width="0"
                                                        :border="false"
                                                        :placeholder="column.endPlaceholder || '结束时间'"
                                                        :input-align="type == 5 ? 'left' : 'center'"
                                                        readonly
                                                ></van-field>
					</div>
				</template>
			</div>
                        <van-popup v-model:show="showTime" position="bottom" round>
                                <van-picker
                                        show-toolbar
                                        :title="type == 5 ? '时间' : timeType == 'initStartDate' ? '开始时间' : '结束时间'"
                                        :columns="timeColumns"
                                        :default-indexes="timeDefaultIndexes"
                                        cancel-button-text="清空"
                                        confirm-button-text="确定"
                                        @confirm="onConfirm"
                                        @cancel="handlePickerCancel"
                                />
                        </van-popup>
                </template>
        </div>
</template>

<script>
import Props from '../../mixins/props.js'

import Calendar from './components/calendar.vue'

import timeFormat from '../../util/timeFormat.js'
export default {
	name: 'wf-date',
	mixins: [Props],
	components: { Calendar },
	computed: {
		type() {
			switch (this.column.type) {
				case 'date':
					return 1
				case 'daterange':
					return 2
				case 'datetime':
					return 3
				case 'datetimerange':
					return 4
				case 'time':
					return 5
				case 'timerange':
					return 6
			}
		},
                valueFormat() {
                        switch (this.column.type) {
                                case 'date':
                                case 'daterange':
                                        return 'yyyy-MM-dd'
                                case 'datetime':
                                case 'datetimerange':
                                        return 'yyyy-MM-dd HH:mm:ss'
                                case 'time':
                                case 'timerange':
                                        return 'HH:mm:ss'
                        }
                },
                timeColumns() {
                        const pad = (num) => `${num}`.padStart(2, '0')
                        const createRange = (count) => Array.from({ length: count }, (_, index) => pad(index))
                        return [
                                { values: createRange(24) },
                                { values: createRange(60) },
                                { values: createRange(60) }
                        ]
                }
        },
	data() {
                return {
                        date: '',
                        initStartDate: '',
                        initEndDate: '',
                        showTime: false,
                        timeType: '',
                        timeDefaultIndexes: [0, 0, 0]
                }
        },
	methods: {
		initValue() {
			const initVal = this.text ? (this.text + '').split(',') : []
			if (!this.validateNull(initVal)) {
				if ([1, 3, 5].includes(this.type)) this.date = initVal[0]
				else if ([2, 4].includes(this.type)) this.date = initVal.join(' 至 ')

				if (initVal[0]) this.initStartDate = timeFormat(this.formatTime(initVal[0]), this.valueFormat)
				if (initVal[1]) this.initEndDate = timeFormat(this.formatTime(initVal[1]), this.valueFormat)
			} else {
				this.date = ''
				this.initStartDate = ''
				this.initEndDate = ''
			}
		},
                handleShowSelect(type) {
                        if (this.disabled) return
                        if ([1, 2, 3, 4].includes(this.type)) this.$refs.calendar.show()
                        else {
                                this.timeType = type
                                this.timeDefaultIndexes = this.parseTimeToIndexes(this[type])
                                this.showTime = true
                        }
                        this.handleClick()
                },
		formatTime(val) {
			if ([5, 6].includes(this.type)) return '2008-08-08 ' + val
			else return val
		},
		onChange(val) {
			const { result } = val
			if (result) this.text = result
		},
                onClear() {
                        this.showTime = false
                        if (this.stringMode) this.text = ''
                        else this.text = []
                        if ([5, 6].includes(this.type)) {
                                this.initEndDate = ''
                        }
                        this.initStartDate = ''
                },
                onConfirm({ selectedValues }) {
                        const [hour = '00', minute = '00', second = '00'] = selectedValues || []
                        const result = `${hour}:${minute}:${second}`
                        if (this.type == 5) this.text = result
                        else {
                                if (this.timeType == 'initStartDate') {
                                        this.initStartDate = result
                                        setTimeout(() => {
                                                this.handleShowSelect('initEndDate')
                                        }, 350)
                                } else {
                                        this.text = [this.initStartDate, result]
                                }
                        }
                        this.showTime = false
                },
                handlePickerCancel() {
                        this.onClear()
                },
                parseTimeToIndexes(value) {
                        const parts = (value || '').split(':').map((item) => parseInt(item, 10) || 0)
                        const [hour = 0, minute = 0, second = 0] = parts
                        return [hour, minute, second]
                }
        }
}
</script>

<style lang="scss" scoped>
.wf-date {
	width: 100%;
	&-time {
		display: flex;
		align-items: center;
	}
	
	&__field,
	&-time__start,
	&-time__end {
		position: relative;
	
                .van-field {
                        padding: 20rpx 0;
                }
	
		&::after {
			position: absolute;
			top: 0;
			left: 0;
			width: 90%;
			height: 90%;
			z-index: 100;
			content: '';
		}
	}
}
</style>
