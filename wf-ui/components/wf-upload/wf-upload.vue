<template>
	<view class="wf-upload">
		<upload :file-list="fileList" :limit="limit" :disabled="disabled" @remove="onRemove" @choose="onChoose"></upload>
	</view>
</template>

<script>
import { DIC_HTTP_PROPS } from '../../util/variable.js'
import { getAsVal } from '../../util/index.js'

import Props from '../../mixins/props.js'

import upload from './components/upload.vue'

export default {
	name: 'wf-upload',
	mixins: [Props],
	components: { upload },
	computed: {
		action() {
			return this.column.action
		},
		limit() {
			return this.column.limit || Number.MAX_VALUE
		},
		fileSize() {
			return this.column.fileSize || Number.MAX_VALUE
		},
		header() {
			return this.column.header || {}
		},
		formData() {
			return this.column.data || {}
		},
		propsHttp() {
			return { ...DIC_HTTP_PROPS, ...this.column.propsHttp }
		},
		fileName() {
			return this.propsHttp.fileName || "file";
		},
	},
	data() {
		return { fileList: [] }
	},
	methods: {
		initValue() {
			const value = this.deepClone(this.text)
			if (!this.validateNull(value)) {
				let fileList = []
				if (typeof value == 'object') {
					value.forEach(v => {
						if (typeof v == 'object') {
							fileList.push({
								url: v[this.valueKey],
								name: v[this.labelKey],
								progress: 100
							})
						} else if (typeof v == 'string') {
							fileList.push({ url: v, progress: 100 })
						}
					})
				} else if (typeof value == 'string') {
					value.split(',').forEach(v => fileList.push({ url: v, progress: 100 }))
				}
				this.fileList = fileList
			}
		},
                async onChoose(list) {
                        for (const file of list) {
                                if (!(file instanceof File)) continue
                                const formData = new FormData()
                                formData.append(this.fileName, file)
                                Object.entries(this.formData || {}).forEach(([key, value]) => {
                                        formData.append(key, value)
                                })
                                try {
                                        const headers = { ...(this.header || {}) }
                                        if (headers['Content-Type']) delete headers['Content-Type']
                                        const response = await fetch(this.action, {
                                                method: 'POST',
                                                headers,
                                                body: formData
                                        })
                                        if (!response.ok) throw new Error(`HTTP ${response.status}`)
                                        const res = await response.json().catch(() => ({}))
                                        const data = getAsVal(res, this.propsHttp.res)
                                        const url = getAsVal(data, this.propsHttp.url)
                                        const name = getAsVal(data, this.propsHttp.name) || file.name
                                        this.fileList = [
                                                ...this.fileList,
                                                { url, name, progress: 100 }
                                        ]
                                        this.onChange()
                                } catch (error) {
                                        console.error('Upload failed', error)
                                }
                        }
                },
                onRemove(index) {
                        this.fileList.splice(index, 1)
                        this.onChange()
                },
		onChange() {
			let arr = []
			if (this.validateNull(this.propsHttp.name) || this.stringMode) {
				this.fileList.forEach(f => {
					if (f.progress == 100) arr.push(f.url)
				})
			} else {
				this.fileList.forEach(f => {
					if (f.progress == 100) arr.push({ [this.labelKey]: f.name, [this.valueKey]: f.url })
				})
			}
			this.text = arr
		}
	}
}
</script>

<style lang="scss" scoped>
.wf-upload {
	width: 100%;
	.attachment {
		color: rgb(41, 121, 255);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
