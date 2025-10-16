<template>
    <view class="container1">
        <image src="@/static/images/404.png" mode="aspectFill" class="image-icon"></image>
        <view>找不到：{{ redirect }}</view>

        <!-- 去首页按钮 -->
        <view class="btn btn--primary" @click="goHome">去首页</view>
        <!-- 若要保留重新授权按钮，解除下面注释 -->
        <!-- <view class="btn btn--ghost" @click="logout">未找到用户，请重新授权</view> -->
    </view>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
    data() {
        return { redirect: '' };
    },
    onLoad(options) {
        this.redirect = options?.redirect || '';
    },
    methods: {
        ...mapMutations(['LOGOUT']),
        logout() {
            this.LOGOUT();
        },
        goHome() {
            // 如果你的首页不是 /pages/index/index，请改成实际路径
            uni.reLaunch({ url: '/pages/home/home' });
        },
    },
};
</script>

<style lang="scss">
.container1 {
    min-height: 100vh;
    padding: 0rpx 50rpx 200rpx;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;

    .image-icon {
        width: 400rpx;
        height: 200rpx;
        margin-top: 300rpx;
        margin-bottom: 40rpx;
    }
}

.btn {
    margin-top: 40rpx;
    text-align: center;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 44rpx;
    font-size: 30rpx;
    font-weight: 600;
    width: 520rpx;
    border: 2rpx solid transparent;

    &--primary {
        background: #22c55e;
        color: #ffffff;
    }
    &--ghost {
        background: #ffffff;
        color: #141414;
        border-color: #e5e7eb;
    }
}
</style>
