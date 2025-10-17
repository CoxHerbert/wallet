<template>
    <div class="wf-upload">
        <div class="wf-upload-button" v-if="!disabled && fileList.length < limit">
            <van-button type="primary" size="small" block @click="handleChooseFile">点击上传</van-button>
        </div>
        <div class="wf-upload-file">
            <div v-for="(item, index) in fileList" :key="index" class="wf-upload-file__item">
                <img
                    v-if="isImageUrl(item.url)"
                    :src="item.url"
                    alt=""
                    class="img-icon"
                    @click="handleAttachments(item)"
                />
                <span v-else class="wf-upload-file__item--name" @click="handleAttachments(item)">{{
                    item.name || item.url
                }}</span>
                <div v-if="!disabled" class="wf-upload-file__item--icon" @click="onRemove(index)">
                    <van-icon name="cross" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { showModal, showToast, previewImage, chooseMessageFile } from '../../../util/uniCompat.js';

export default {
    name: 'upload',
    props: {
        fileList: {
            type: Array,
            default: () => [],
        },
        limit: {
            type: Number,
            default: Number.MAX_VALUE,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        // 判断是否为图片
        isImageUrl(url) {
            const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg)$/i;
            return imageExtensions.test(url);
        },
        handleChooseFile() {
            chooseMessageFile({
                success: ({ tempFiles }) => {
                    if (tempFiles.length + this.fileList.length > this.limit) {
                        showToast({
                            title: `超出数量限制：${this.limit}`,
                            icon: 'none',
                        });
                        return;
                    }
                    this.$emit('choose', tempFiles);
                },
            });
        },

        handleAttachments(item) {
            const { url } = item;
            const suffix = url.substring(url.lastIndexOf('.') + 1);
            const imageList = ['jpg', 'png', 'jpeg', 'gif', 'webp', 'bmp'];
            const documentList = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'];
            // 图片
            if (imageList.includes(suffix)) {
                previewImage({
                    urls: [url],
                });
            }
            // 文档
            else if (documentList.includes(suffix)) {
                window.open(url);
            }
            // 其他
            else {
                showToast({
                    title: `当前类型${suffix}不支持在移动端展示`,
                    icon: 'none',
                });
            }
        },
        onRemove(index) {
            showModal({
                title: '警告',
                content: '确定要删除此项吗？',
                success: (res) => {
                    if (res.confirm) {
                        this.$emit('remove', index);
                    }
                },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.img-icon {
    width: 70rpx;
    height: 70rpx;
}
.wf-upload-file__item {
    padding-right: 32rpx;
    box-sizing: border-box;
}
.wf-upload {
    width: 100%;
    overflow: hidden;

    &-button {
        width: 100%;
        height: 60rpx;
    }

    &-file {
        width: 690rpx;
        overflow: hidden;

        &__item {
            display: flex;
            justify-content: space-between;
            align-items: center;

            &--name {
                flex: 1;
                margin-right: 16rpx;
                color: rgb(41, 121, 255);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
</style>
