<template>
  <view class="mine">
    <wd-navbar title="我的" :safeAreaInsetTop="true"></wd-navbar>
    <wd-tabbar v-model="tabbar" fixed bordered safeAreaInsetBottom placeholder @change="onChange">
      <wd-tabbar-item title="首页" icon="home"></wd-tabbar-item>
      <wd-tabbar-item title="我的" icon="user-circle"></wd-tabbar-item>
    </wd-tabbar>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";

const tabbar = ref(1);

onShow(() => {
  tabbar.value = 1;
});

const onChange = ({ value }) => {
  if (value === 0) {
    uni.switchTab({ url: "/pages/home/index" });
  }
};
</script>

<style lang="scss" scoped></style>
