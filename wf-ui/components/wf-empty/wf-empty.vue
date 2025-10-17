<template>
  <div class="wf-empty" :style="{ marginTop: marginStyle, fontSize: fontSizeStyle }">
    <img v-if="currentImage" :src="currentImage" :style="{ width: iconSizeStyle }" alt="empty" />
    <p class="wf-empty__text">{{ text || '暂无数据' }}</p>
  </div>
</template>

<script>
export default {
  name: 'wf-empty',
  props: {
    text: { type: String },
    mode: {
      type: String,
      default: () => 'list'
    },
    src: { type: String },
    iconSize: {
      type: String,
      default: () => '263'
    },
    marginTop: { type: String },
    fontSize: {
      type: String,
      default: () => '30'
    }
  },
  data() {
    const base = this.wfImage ? `${this.wfImage}/public/empty.png` : ''
    return { imageUrl: base, marginTOP: 0 }
  },
  computed: {
    currentImage() {
      return this.src || this.imageUrl
    },
    iconSizeStyle() {
      if (this.iconSize === undefined || this.iconSize === null || this.iconSize === '') return '120px'
      return isNaN(Number(this.iconSize)) ? this.iconSize : `${this.iconSize}px`
    },
    marginStyle() {
      const value = this.marginTop || this.marginTOP
      if (value === undefined || value === null || value === '') return undefined
      return isNaN(Number(value)) ? value : `${value}px`
    },
    fontSizeStyle() {
      if (this.fontSize === undefined || this.fontSize === null || this.fontSize === '') return undefined
      return isNaN(Number(this.fontSize)) ? this.fontSize : `${this.fontSize}px`
    }
  },
  created() {
    if (!this.marginTop && typeof window !== 'undefined') {
      this.marginTOP = window.innerHeight ? window.innerHeight / 2.5 : 0
    }
  }
}
</script>

<style lang="scss" scoped>
.wf-empty {
  width: 100%;
  text-align: center;
  color: #909399;
}

.wf-empty img {
  display: block;
  margin: 0 auto 16px;
  max-width: 200px;
}

.wf-empty__text {
  margin: 0;
}
</style>
