<template>
  <van-config-provider :theme-vars="themeVars">
    <main class="app">
      <header class="app__header">
        <h1>wf-ui (Vant) 示例</h1>
        <p>基于 Vant 4 与 Vue 3 的表单组件库</p>
      </header>
      <section class="app__content">
        <WfForm
          v-model="formModel"
          :columns="columns"
          label-width="90px"
          @submit="handleSubmit"
        />
      </section>
      <section class="app__debug">
        <h2>表单数据</h2>
        <pre>{{ formattedModel }}</pre>
      </section>
    </main>
  </van-config-provider>
</template>

<script setup>
import { computed, ref } from 'vue';
import { showToast } from 'vant';
import 'vant/es/toast/style';
import WfForm from '@/components/wf-ui/wf-form/WfForm.vue';

const themeVars = {
  cellLineHeight: '22px',
};

const formModel = ref({
  username: '张三',
  gender: 'male',
  city: '',
  hobbies: ['code'],
  rating: 3,
  agreement: false,
  birthday: '',
  slider: 40,
});

const columns = [
  {
    type: 'input',
    prop: 'username',
    label: '姓名',
    placeholder: '请输入姓名',
    rules: [{ required: true, message: '请输入姓名' }],
  },
  {
    type: 'radio',
    prop: 'gender',
    label: '性别',
    dicData: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
  {
    type: 'select',
    prop: 'city',
    label: '城市',
    placeholder: '请选择城市',
    dicData: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '深圳', value: 'shenzhen' },
    ],
  },
  {
    type: 'checkbox',
    prop: 'hobbies',
    label: '爱好',
    dicData: [
      { label: '编程', value: 'code' },
      { label: '音乐', value: 'music' },
      { label: '旅行', value: 'travel' },
    ],
  },
  {
    type: 'rate',
    prop: 'rating',
    label: '评分',
    count: 5,
  },
  {
    type: 'switch',
    prop: 'agreement',
    label: '同意条款',
  },
  {
    type: 'date',
    prop: 'birthday',
    label: '生日',
    placeholder: '请选择日期',
  },
  {
    type: 'slider',
    prop: 'slider',
    label: '进度',
    min: 0,
    max: 100,
  },
];

const formattedModel = computed(() => JSON.stringify(formModel.value, null, 2));

function handleSubmit(payload) {
  showToast({ message: `提交成功: ${JSON.stringify(payload)}`, duration: 2000 });
}
</script>

<style scoped lang="scss">
.app {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px;
  box-sizing: border-box;
}

.app__header {
  text-align: center;
  margin-bottom: 24px;

  h1 {
    margin: 0 0 8px;
    font-size: 28px;
  }

  p {
    margin: 0;
    color: #646566;
  }
}

.app__content {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(31, 45, 61, 0.1);
}

.app__debug {
  margin-top: 24px;
  padding: 16px;
  background: #fff;
  border-radius: 16px;
  box-shadow: inset 0 0 0 1px rgba(31, 45, 61, 0.05);

  pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
  }
}
</style>
