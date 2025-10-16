<!-- /pages/login/UserInfoTransitionMobile.vue -->
<template>
    <view class="m-userinfo" :class="statusClass">
        <!-- 顶部安全区 -->
        <view class="m-userinfo__safe-top"></view>

        <!-- 品牌/说明 -->
        <view class="m-userinfo__hero">
            <image class="m-userinfo__logo" src="/static/images/logo1.png"></image>
            <view class="m-userinfo__meta">
                <text class="m-userinfo__title">正在准备工作环境</text>
                <text class="m-userinfo__sub">解析跳转参数中…</text>
            </view>
        </view>

        <!-- 卡片主体 -->
        <view class="m-userinfo__card">
            <view class="m-userinfo__center">
                <view v-if="status === 'loading'" class="m-userinfo__spinner" aria-hidden="true"></view>
                <view v-if="status === 'success'" class="m-userinfo__result m-userinfo__result--ok"></view>
                <view v-if="status === 'error'" class="m-userinfo__result m-userinfo__result--err"></view>

                <view class="m-userinfo__msg">
                    <text class="m-userinfo__msg-main">{{ statusText }}</text>
                    <view v-if="status === 'loading'" class="m-userinfo__dots"><i></i><i></i><i></i></view>
                </view>
                <text class="m-userinfo__hint">{{ subHint }}</text>
            </view>

            <view class="m-userinfo__progress">
                <view class="m-userinfo__progress-bar" :style="{ '--pct': pctStr }"></view>
                <view class="m-userinfo__progress-text">
                    <text>进度</text><text class="m-userinfo__progress-num">{{ pctStr }}</text>
                </view>
            </view>

            <!-- 步骤仅显示“解析参数”和“跳转”两步 -->
            <view class="m-userinfo__steps">
                <view class="step" :class="stepClass(0)">
                    <view class="step__dot"></view><text class="step__text">解析 urlTicketId</text
                    ><text class="step__tag">{{ stepTag(0) }}</text>
                </view>
                <view class="step" :class="stepClass(1)">
                    <view class="step__dot"></view><text class="step__text">跳转目标页</text
                    ><text class="step__tag">{{ stepTag(1) }}</text>
                </view>
            </view>

            <view v-if="status === 'success'" class="m-userinfo__alert m-userinfo__alert--ok"
                >解析成功，正在进入系统…</view
            >
            <view v-if="status === 'error'" class="m-userinfo__alert m-userinfo__alert--err">{{
                errorMsg || '解析失败，请稍后重试'
            }}</view>
        </view>

        <view class="m-userinfo__footer">
            <text class="m-userinfo__tip">该页面为过渡页，请勿操作</text>
            <view class="m-userinfo__safe-bottom"></view>
        </view>
    </view>
</template>

<script>
import Api from '@/api/index';
export default {
    name: 'UserInfoTransitionMobile',
    data() {
        return {
            status: 'loading', // loading | success | error
            pct: 10,
            errorMsg: '',
            // 步骤：1=done, 0=doing, -1=error, -99=未开始
            steps: [0, -99],
            // 自定义
            UUID_PARAM_KEY: 'urlTicketId',
            MINIAPP_FALLBACK_URL: '/pages/index/index',
            WEBVIEW_PAGE_URL: '/pages/webview/index', // 如果 target 是 http 外链，用此容器承接
        };
    },
    computed: {
        statusText() {
            return this.status === 'loading' ? '正在解析参数' : this.status === 'success' ? '解析成功' : '解析失败';
        },
        subHint() {
            return this.status === 'loading'
                ? '正在读取并解析 urlTicketId'
                : this.status === 'success'
                ? '即将跳转到目标页面'
                : this.errorMsg || '请返回重试或联系管理员';
        },
        pctStr() {
            return `${this.pct}%`;
        },
        statusClass() {
            return `m-userinfo--${this.status}`;
        },
    },
    onLoad(options) {
        this.bootstrap(options);
    },
    methods: {
        stepClass(i) {
            const v = this.steps[i];
            if (v === 1) return 'step--done';
            if (v === 0) return 'step--doing';
            if (v === -1) return 'step--error';
            return '';
        },
        stepTag(i) {
            const v = this.steps[i];
            return v === 1 ? '完成' : v === 0 ? '进行中' : v === -1 ? '失败' : '待执行';
        },

        async bootstrap(options = {}) {
            try {
                const urlTicketId = options[this.UUID_PARAM_KEY];
                // step1: 请求 userinfo（原：Api.auth.consumeTicket({ urlTicketId: urlTicketId })）
                this.steps.splice(1, 1, 0);
                this.pct = 35;

                const res = await Api.auth.consumeTicket({ urlTicketId });
                const { code, data, msg } = res || {};
                if (code !== 200) {
                    throw new Error(msg || (data && data.msg) || '服务端返回失败');
                }

                const userInfo = data || {};
                this.steps.splice(1, 1, 1);
                this.steps.splice(2, 1, 0);
                this.pct = 68;

                // step3: 跳转
                this.steps.splice(3, 1, 0);
                this.status = 'success';
                this.pct = 88;

                const target = userInfo && userInfo.h5Url;
                const output = target.replace(/^\/h5(\/|$)/, '/');
                console.log('跳转目标：', output);

                setTimeout(() => {
                    this.steps.splice(3, 1, 1);
                    this.pct = 100;
                    uni.navigateTo({
                        url: output,
                        fail() {
                            // 页面不存在或路径错误时跳转到 404
                            uni.reLaunch({ url: `/pages/home/404?redirect=${output}` });
                        },
                    });
                }, 420);
            } catch (err) {
                console.error(err);
                this.status = 'error';
                this.errorMsg = (err && err.message) || '未知错误';
                if (this.steps[0] === 0) this.steps.splice(0, 1, -1);
                if (this.steps[1] === 0) this.steps.splice(1, 1, -1);
                this.pct = 100;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
/* ===== 移动端主题变量 ===== */
$bg-start: #0f1220;
$bg-end: #0b0f1a;
$ink: #eef1ff;
$muted: rgba(238, 241, 255, 0.72);
$glass-top: rgba(255, 255, 255, 0.1);
$glass-bottom: rgba(255, 255, 255, 0.06);
$glass-border: rgba(255, 255, 255, 0.14);
$ok: #22c55e;
$warn: #f59e0b;
$err: #ef4444;
/* 保留你现有的 SCSS（未改动） */
@keyframes rotate360 {
    to {
        transform: rotate(360deg);
    }
}
@keyframes bounce {
    0%,
    60%,
    100% {
        transform: translateY(0);
        opacity: 0.9;
    }
    30% {
        transform: translateY(-5px);
        opacity: 1;
    }
}
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(6px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ===== 容器（更紧凑的移动端排版） ===== */
.m-userinfo {
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto auto 1fr auto;
    background: radial-gradient(900px 600px at 10% -10%, rgba(99, 102, 241, 0.18), transparent),
        radial-gradient(600px 600px at 110% 10%, rgba(16, 185, 129, 0.18), transparent),
        linear-gradient(180deg, $bg-start, $bg-end);
    color: $ink;

    &__safe-top {
        height: constant(safe-area-inset-top);
        height: env(safe-area-inset-top);
    }
    &__safe-bottom {
        height: constant(safe-area-inset-bottom);
        height: env(safe-area-inset-bottom);
    }

    &__hero {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px 0;
    }
    &__logo {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        font-weight: 700;
        letter-spacing: 0.2px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.08));
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12), 0 6px 18px rgba(0, 0, 0, 0.35);
        font-size: 12px;
    }
    &__title {
        margin: 0 0 2px;
        font-size: 17px;
        font-weight: 700;
    }
    &__sub {
        margin: 0;
        font-size: 12px;
        color: $muted;
    }

    &__card {
        margin: 12px 12px 0;
        padding: 14px 12px 12px;
        border-radius: 16px;
        background: linear-gradient(180deg, $glass-top, $glass-bottom);
        border: 1px solid $glass-border;
        backdrop-filter: blur(8px);
        box-shadow: 0 8px 28px rgba(0, 0, 0, 0.42), inset 0 0 28px rgba(255, 255, 255, 0.06);
        animation: fadeInUp 0.28s ease both;
    }

    &__center {
        display: grid;
        justify-items: center;
        gap: 10px;
        min-height: 92px;
    }

    /* 更小的圈，适合手机视觉节奏 */
    &__spinner {
        $size: 48px;
        width: $size;
        height: $size;
        border-radius: 50%;
        position: relative;
        mask: radial-gradient(circle 18px, transparent 59%, #000 60%);
        background: conic-gradient(
            from 0deg,
            rgba(255, 255, 255, 0.06),
            rgba(255, 255, 255, 0.9) 60%,
            rgba(255, 255, 255, 0.06)
        );
        animation: rotate360 1.05s linear infinite;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08) inset;

        &::after {
            content: '';
            position: absolute;
            inset: -6px;
            border-radius: 50%;
            background: radial-gradient(5px 5px at 95% 50%, rgba(99, 102, 241, 0.95), transparent 70%),
                radial-gradient(6px 6px at 90% 50%, rgba(16, 185, 129, 0.85), transparent 70%);
            animation: rotate360 1.05s linear infinite;
            filter: blur(0.2px);
        }
    }

    /* 结果图标（无字体依赖） */
    &__result {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        &--ok {
            background: rgba($ok, 0.14);
            box-shadow: inset 0 0 0 2px rgba($ok, 0.45);
            position: relative;
            &::before,
            &::after {
                content: '';
                position: absolute;
                background: $ok;
                border-radius: 2px;
            }
            &::before {
                width: 9px;
                height: 2px;
                left: 15px;
                top: 24px;
                transform: rotate(40deg);
            }
            &::after {
                width: 20px;
                height: 2px;
                left: 22px;
                top: 20px;
                transform: rotate(-40deg);
            }
        }
        &--err {
            background: rgba($err, 0.14);
            box-shadow: inset 0 0 0 2px rgba($err, 0.45);
            position: relative;
            &::before,
            &::after {
                content: '';
                position: absolute;
                width: 22px;
                height: 2px;
                top: 23px;
                left: 13px;
                background: $err;
                border-radius: 2px;
            }
            &::before {
                transform: rotate(45deg);
            }
            &::after {
                transform: rotate(-45deg);
            }
        }
    }

    &__msg {
        display: inline-flex;
        align-items: baseline;
        gap: 6px;
        font-size: 14px;
    }
    &__dots {
        display: inline-flex;
        gap: 3px;
        i {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.9);
            animation: bounce 1.2s infinite ease-in-out;
            &:nth-child(2) {
                animation-delay: 0.15s;
            }
            &:nth-child(3) {
                animation-delay: 0.3s;
            }
        }
    }
    &__hint {
        font-size: 12px;
        color: $muted;
    }

    /* 进度条 */
    &__progress {
        margin-top: 6px;
        display: grid;
        gap: 6px;
    }
    &__progress-bar {
        height: 6px;
        border-radius: 999px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.12);
        position: relative;
        &::after {
            content: '';
            position: absolute;
            inset: 0;
            transform-origin: left center;
            transform: scaleX(calc(var(--pct, 0) / 100));
            background: linear-gradient(90deg, #6d8bff, #22c55e);
        }
    }
    &__progress-text {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: $muted;
    }
    &__progress-num {
        color: #fff;
        font-weight: 600;
    }

    /* 步骤：紧凑 */
    &__steps {
        margin: 8px 0 0;
        padding: 0;
        display: grid;
        gap: 6px;
    }
    .step {
        display: grid;
        grid-template-columns: 14px 1fr auto;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.08);
        &__dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.28);
        }
        &__text {
            font-size: 13px;
        }
        &__tag {
            font-size: 11px;
            padding: 1px 8px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.08);
            color: $muted;
            border: 1px solid rgba(255, 255, 255, 0.12);
        }
        &--doing {
            border-color: rgba($warn, 0.45);
            .step__dot {
                background: $warn;
                box-shadow: 0 0 0 4px rgba($warn, 0.18);
            }
            .step__tag {
                color: #fff;
                background: rgba($warn, 0.18);
                border-color: rgba($warn, 0.38);
            }
        }
        &--done {
            border-color: rgba($ok, 0.45);
            .step__dot {
                background: $ok;
                box-shadow: 0 0 0 4px rgba($ok, 0.18);
            }
            .step__tag {
                color: #fff;
                background: rgba($ok, 0.18);
                border-color: rgba($ok, 0.38);
            }
        }
        &--error {
            border-color: rgba($err, 0.45);
            .step__dot {
                background: $err;
                box-shadow: 0 0 0 4px rgba($err, 0.18);
            }
            .step__tag {
                color: #fff;
                background: rgba($err, 0.18);
                border-color: rgba($err, 0.38);
            }
        }
    }

    &__alert {
        margin-top: 8px;
        padding: 10px 12px;
        border-radius: 12px;
        font-size: 13px;
        text-align: center;
        border: 1px solid transparent;
        &--ok {
            background: rgba($ok, 0.14);
            border-color: rgba($ok, 0.4);
        }
        &--err {
            background: rgba($err, 0.14);
            border-color: rgba($err, 0.4);
        }
    }

    &__footer {
        margin: 8px 12px 0;
        padding-bottom: 6px;
        text-align: center;
        color: $muted;
        font-size: 11px;
    }
    &__tip {
        opacity: 0.9;
    }
}

/* 状态修饰符（可扩展） */
.m-userinfo--loading {
}
.m-userinfo--success {
}
.m-userinfo--error {
}
</style>
