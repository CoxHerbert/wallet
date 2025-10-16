<template>
  <van-field :label="column.label" :label-width="column.labelWidth || labelWidth">
    <template #input>
      <van-empty description="暂未实现的组件类型" image-size="80" />
    </template>
  </van-field>
</template>

<script setup>
const props = defineProps({
  column: { type: Object, required: true },
  labelWidth: String,
});
</script>
