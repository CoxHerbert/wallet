<template>
  <div class="wf-upload">
    <div class="wf-upload-button" v-if="!disabled && fileList.length < limit">
      <button type="button" class="wf-upload-button__trigger" @click="triggerFileSelect">点击上传</button>
      <input
        ref="fileInput"
        type="file"
        class="wf-upload-button__input"
        :multiple="multiple"
        @change="handleFileChange"
      />
    </div>
    <ul class="wf-upload-file">
      <li v-for="(item, index) in fileList" :key="index" class="wf-upload-file__item">
        <img
          v-if="isImageUrl(item.url)"
          :src="item.url"
          alt=""
          class="img-icon"
          @click="preview(item.url)"
        />
        <a
          v-else
          class="wf-upload-file__item--name"
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ item.name || item.url }}
        </a>
        <button v-if="!disabled" type="button" class="wf-upload-file__item--remove" @click="onRemove(index)">
          删除
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'upload',
  props: {
    fileList: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: Number.MAX_VALUE
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    multiple() {
      return this.limit > 1
    }
  },
  methods: {
    isImageUrl(url) {
      const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i
      return imageExtensions.test(url || '')
    },
    triggerFileSelect() {
      this.$refs.fileInput?.click()
    },
    handleFileChange(event) {
      const files = Array.from(event.target.files || [])
      if (!files.length) return
      if (files.length + this.fileList.length > this.limit) {
        event.target.value = ''
        return
      }
      this.$emit('choose', files)
      event.target.value = ''
    },
    preview(url) {
      if (!url) return
      window.open(url, '_blank')
    },
    onRemove(index) {
      this.$emit('remove', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.img-icon {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

.wf-upload {
  width: 100%;
  overflow: hidden;
}

.wf-upload-button {
  margin-bottom: 8px;
}

.wf-upload-button__trigger {
  padding: 6px 12px;
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.wf-upload-button__input {
  display: none;
}

.wf-upload-file {
  list-style: none;
  padding: 0;
  margin: 0;
}

.wf-upload-file__item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.wf-upload-file__item--name {
  color: #2979ff;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wf-upload-file__item--remove {
  border: none;
  background: transparent;
  color: #f56c6c;
  cursor: pointer;
}
</style>
